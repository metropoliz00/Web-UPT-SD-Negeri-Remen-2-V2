import React, { createContext, useContext, useState, useEffect } from 'react';
import { SchoolContent } from '../types';
import { defaultSchoolContent } from '../data/defaultContent';
import { 
  logoutUser, 
  onSupabaseAuthStateChange, 
  getCMSContent, 
  saveCMSContent, 
  incrementVisitorCount,
  getVisitorCount,
  verifyAdminLogin
} from '../supabase';

interface CMSContextType {
  isLoggedIn: boolean;
  editMode: boolean;
  setEditMode: (val: boolean) => void;
  content: SchoolContent;
  updateContentField: (key: keyof SchoolContent, value: any) => void;
  updateContentListItem: (listName: keyof SchoolContent, itemId: string, field: string, value: any) => void;
  deleteContentListItem: (listName: keyof SchoolContent, itemId: string) => void;
  addContentListItem: (listName: keyof SchoolContent, newItem: any) => void;
  saveChanges: () => Promise<void>;
  cancelChanges: () => void;
  logInAdmin: (username: string, pass: string) => Promise<boolean>;
  logOut: () => Promise<void>;
  activeSection: string | null;
  setActiveSection: (section: string | null) => void;
  isSaving: boolean;
  hasChanges: boolean;
  visitorCount: number;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export function CMSProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [dbContent, setDbContent] = useState<SchoolContent>(defaultSchoolContent);
  const [content, setContent] = useState<SchoolContent>(defaultSchoolContent);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [visitorCount, setVisitorCount] = useState<number>(0);

  // Load and increment visitor counter on actual application refresh
  useEffect(() => {
    let isMounted = true;
    const fetchAndIncrementVisitor = async () => {
      try {
        const count = await incrementVisitorCount();
        if (isMounted) {
          setVisitorCount(count);
        }
      } catch (err) {
        console.error("Failed to update visitor count:", err);
      }
    };
    fetchAndIncrementVisitor();

    // Poll for updates every 60 seconds to keep it "sesuai database"
    const interval = setInterval(async () => {
      try {
        const count = await getVisitorCount();
        if (isMounted) {
          setVisitorCount(count);
        }
      } catch (err) {
        console.error("Failed to poll visitor count:", err);
      }
    }, 60000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Load content from Supabase
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await getCMSContent();
        // Apply fallback/replacements if any
        if (data.contact && (data.contact.telepon === '+62 812-3456-7890' || data.contact.telepon === '085604431706')) {
          data.contact.telepon = '085604431706';
        }
        const merged = { ...defaultSchoolContent, ...data };
        if (!merged.agenda || !Array.isArray(merged.agenda)) {
          merged.agenda = defaultSchoolContent.agenda;
        }
        if (!merged.strukturSekolah || !Array.isArray(merged.strukturSekolah)) {
          merged.strukturSekolah = defaultSchoolContent.strukturSekolah || [];
        }
        if (!merged.strukturKomite || !Array.isArray(merged.strukturKomite)) {
          merged.strukturKomite = defaultSchoolContent.strukturKomite || [];
        }
        if (!merged.videos || !Array.isArray(merged.videos)) {
          merged.videos = defaultSchoolContent.videos || [];
        }
        setDbContent(merged);
        setContent(merged);
      } catch (err) {
        console.warn("CMS content load failed, using local fallback dataset:", err);
      }
    };
    fetchContent();
  }, []);

  // Monitor auth status
  useEffect(() => {
    const unsubscribe = onSupabaseAuthStateChange((userId) => {
      if (userId) {
        setIsLoggedIn(true);
        // Automatically enable edit mode when logged in
        setEditMode(true);
      } else {
        setIsLoggedIn(false);
        setEditMode(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Track if changes have been made
  useEffect(() => {
    setHasChanges(JSON.stringify(content) !== JSON.stringify(dbContent));
  }, [content, dbContent]);

  const updateContentField = (key: keyof SchoolContent, value: any) => {
    setContent(prev => ({ ...prev, [key]: value }));
  };

  const updateContentListItem = (listName: keyof SchoolContent, itemId: string, field: string, value: any) => {
    setContent((prev: any) => {
      const list = prev[listName];
      if (!Array.isArray(list)) return prev;
      const updatedList = list.map((item: any) => {
        if (item.id === itemId) {
          return { ...item, [field]: value };
        }
        return item;
      });
      return { ...prev, [listName]: updatedList };
    });
  };

  const deleteContentListItem = (listName: keyof SchoolContent, itemId: string) => {
    setContent((prev: any) => {
      const list = prev[listName];
      if (!Array.isArray(list)) return prev;
      const updatedList = list.filter((item: any) => item.id !== itemId);
      return { ...prev, [listName]: updatedList };
    });
  };

  const addContentListItem = (listName: keyof SchoolContent, newItem: any) => {
    setContent((prev: any) => {
      const list = prev[listName];
      if (!Array.isArray(list)) return prev;
      return { ...prev, [listName]: [...list, newItem] };
    });
  };

  const saveChanges = async () => {
    setIsSaving(true);
    try {
      await saveCMSContent(content);
      setDbContent(content);
      setHasChanges(false);
    } catch (err) {
      console.error("Gagal menyimpan perubahan ke Supabase:", err);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const cancelChanges = () => {
    setContent(dbContent);
    setHasChanges(false);
  };

  const logInAdmin = async (username: string, pass: string) => {
    const userId = await verifyAdminLogin(username, pass);
    if (userId) {
      setIsLoggedIn(true);
      setEditMode(true);
      return true;
    }
    return false;
  };

  const logOut = async () => {
    await logoutUser();
    setIsLoggedIn(false);
    setEditMode(false);
  };

  return (
    <CMSContext.Provider
      value={{
        isLoggedIn,
        editMode,
        setEditMode,
        content,
        updateContentField,
        updateContentListItem,
        deleteContentListItem,
        addContentListItem,
        saveChanges,
        cancelChanges,
        logInAdmin,
        logOut,
        activeSection,
        setActiveSection,
        isSaving,
        hasChanges,
        visitorCount
      }}
    >
      {children}
    </CMSContext.Provider>
  );
}

export function useCMS() {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
}
