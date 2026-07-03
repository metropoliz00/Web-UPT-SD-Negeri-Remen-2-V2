import { createClient } from '@supabase/supabase-js';
import { SchoolContent } from './types';
import { defaultSchoolContent } from './data/defaultContent';

// Helper to safely fetch environment variables in both Node and browser environments
const getEnv = (key: string): string => {
  if (typeof window !== 'undefined' && (window as any).env && (window as any).env[key]) {
    return (window as any).env[key];
  }
  // Try import.meta.env for Vite
  try {
    const val = (import.meta as any).env?.[key];
    if (val) return val;
  } catch (e) {}
  // Try process.env for Node/Express
  try {
    const val = process.env[key];
    if (val) return val;
  } catch (e) {}
  return '';
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL') || getEnv('SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY') || getEnv('SUPABASE_ANON_KEY');

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured && typeof window !== 'undefined') {
  console.warn(
    "⚠️ Supabase is not fully configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your secrets/environment variables."
  );
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      }
    })
  : null;

// Auth Helper Functions (MODIFIED: Using custom admin_accounts table instead of Supabase Auth)
export const verifyAdminLogin = async (username: string, password: string): Promise<string | null> => {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Please set your credentials in the Secrets panel.');
  }

  try {
    const { data, error } = await supabase!
      .from('admin_accounts')
      .select('id, username')
      .eq('username', username)
      .eq('password', password)
      .maybeSingle();

    if (error || !data) {
      console.warn("Invalid login attempt:", username);
      return null;
    }

    // After success, we store a session flag in localStorage
    localStorage.setItem('admin_session_id', data.id);
    return data.id;
  } catch (err) {
    console.error("Login check failed:", err);
    return null;
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  throw new Error('Feature disabled. Use Username & Password login.');
};

export const signUpWithEmail = async (email: string, password: string) => {
  throw new Error('Feature disabled.');
};

export const loginWithGoogle = async () => {
  throw new Error('Google Login disabled. Use Username & Password login.');
};

export const logoutUser = async () => {
  localStorage.removeItem('admin_session_id');
  window.location.reload();
};

export const onSupabaseAuthStateChange = (callback: (userId: string | null) => void) => {
  // We use our own session tracking now via localStorage
  const sessionId = localStorage.getItem('admin_session_id');
  callback(sessionId);
  
  return () => {};
};

// Helper for error handling
export const handleSupabaseError = (error: any, operation: string) => {
  console.error(`Supabase Error [${operation}]:`, error);
  throw new Error(error?.message || `Supabase operation failed: ${operation}`);
};

// 1. Fetch CMS Content
export const getCMSContent = async (): Promise<SchoolContent> => {
  if (!isSupabaseConfigured) {
    return defaultSchoolContent;
  }

  try {
    const { data, error } = await supabase!
      .from('cms_content')
      .select('data')
      .eq('id', 'content')
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // Row doesn't exist yet
        // Seed with default content
        const { error: insertError } = await supabase!
          .from('cms_content')
          .insert({ id: 'content', data: defaultSchoolContent });
        
        if (insertError) console.error("Failed to seed default content:", insertError);
        return defaultSchoolContent;
      }
      throw error;
    }

    return { ...defaultSchoolContent, ...(data.data as any) };
  } catch (err) {
    console.error("Failed to fetch CMS content from Supabase:", err);
    return defaultSchoolContent;
  }
};

// 2. Save CMS Content
export const saveCMSContent = async (content: SchoolContent): Promise<void> => {
  if (!isSupabaseConfigured) {
    throw new Error('Database connection required to save content.');
  }

  try {
    const { error } = await supabase!
      .from('cms_content')
      .upsert({ id: 'content', data: content, updated_at: new Date().toISOString() });

    if (error) throw error;
  } catch (err) {
    handleSupabaseError(err, 'saveCMSContent');
  }
};

// 3. Visitor count
export const getVisitorCount = async (): Promise<number> => {
  const getLocalCount = () => {
    const local = localStorage.getItem('school_visitor_count');
    return local ? parseInt(local, 10) : 1248; // A polished starting visitor count
  };

  if (!isSupabaseConfigured) {
    return getLocalCount();
  }

  try {
    const { data, error } = await supabase!
      .from('stats')
      .select('count')
      .eq('id', 'visitors')
      .maybeSingle();

    if (error) throw error;
    
    if (data && typeof data.count === 'number') {
      localStorage.setItem('school_visitor_count', data.count.toString());
      return data.count;
    } else {
      // Row doesn't exist yet, try to initialize it
      const initialCount = getLocalCount();
      await supabase!
        .from('stats')
        .insert({ id: 'visitors', count: initialCount });
      return initialCount;
    }
  } catch (err) {
    console.warn("Visitor table check deferred, using local visitor counter fallback:", err);
    return getLocalCount();
  }
};

export const incrementVisitorCount = async (): Promise<number> => {
  const getLocalCount = () => {
    const local = localStorage.getItem('school_visitor_count');
    return local ? parseInt(local, 10) : 1248;
  };

  if (!isSupabaseConfigured) {
    const next = getLocalCount() + 1;
    localStorage.setItem('school_visitor_count', next.toString());
    return next;
  }

  try {
    const currentCount = await getVisitorCount();
    const newCount = currentCount + 1;

    const { error } = await supabase!
      .from('stats')
      .upsert({ 
        id: 'visitors', 
        count: newCount, 
        updated_at: new Date().toISOString() 
      });

    if (error) throw error;
    localStorage.setItem('school_visitor_count', newCount.toString());
    return newCount;
  } catch (err) {
    console.warn("Failed to update visitor count in database, updating locally:", err);
    const next = getLocalCount() + 1;
    localStorage.setItem('school_visitor_count', next.toString());
    return next;
  }
};

// 4. PPDB Registrants (pendaftaran)
export const getRegistrants = async (): Promise<any[]> => {
  if (!isSupabaseConfigured) return [];

  try {
    const { data, error } = await supabase!
      .from('pendaftaran')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Supabase getRegistrants failed:", err);
    return [];
  }
};

export const addRegistrant = async (registrant: any): Promise<any> => {
  if (!isSupabaseConfigured) throw new Error('Database connection required.');

  try {
    const { data, error } = await supabase!
      .from('pendaftaran')
      .insert([registrant])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Supabase addRegistrant failed:", err);
    throw err;
  }
};

export const updateRegistrant = async (id: string, updateData: any): Promise<void> => {
  if (!isSupabaseConfigured) throw new Error('Database connection required.');

  try {
    const { error } = await supabase!
      .from('pendaftaran')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
  } catch (err) {
    handleSupabaseError(err, 'updateRegistrant');
  }
};

export const deleteRegistrant = async (id: string): Promise<void> => {
  if (!isSupabaseConfigured) throw new Error('Database connection required.');

  try {
    const { error } = await supabase!
      .from('pendaftaran')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (err) {
    handleSupabaseError(err, 'deleteRegistrant');
  }
};

// 5. Testimonials (suara_komunitas)
export const getTestimonials = async (): Promise<any[]> => {
  if (!isSupabaseConfigured) return [];

  try {
    const { data, error } = await supabase!
      .from('suara_komunitas')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Supabase getTestimonials failed:", err);
    return [];
  }
};

export const addTestimonial = async (testimonial: any): Promise<any> => {
  if (!isSupabaseConfigured) throw new Error('Database connection required.');

  try {
    const { data, error } = await supabase!
      .from('suara_komunitas')
      .insert([testimonial])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Supabase addTestimonial failed:", err);
    throw err;
  }
};

// 6. Agendas
export const getAgendas = async (): Promise<any[]> => {
  if (!isSupabaseConfigured) return [];

  try {
    const { data, error } = await supabase!
      .from('agenda')
      .select('*')
      .order('date', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Failed to fetch agendas:", err);
    return [];
  }
};

export const addAgenda = async (agenda: any): Promise<any> => {
  if (!isSupabaseConfigured) throw new Error('Database connection required.');

  try {
    const { data, error } = await supabase!
      .from('agenda')
      .insert([agenda])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Supabase addAgenda failed:", err);
    throw err;
  }
};

export const deleteAgenda = async (id: string): Promise<void> => {
  if (!isSupabaseConfigured) throw new Error('Database connection required.');

  try {
    const { error } = await supabase!
      .from('agenda')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (err) {
    console.error("Supabase deleteAgenda failed:", err);
    throw err;
  }
};
