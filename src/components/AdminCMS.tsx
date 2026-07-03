import React, { useState, useEffect } from 'react';
import { SchoolContent, KeunggulanItem, ProgramItem, PrestasiItem, GuruItem, GaleriItem, EkstrakurikulerItem, FAQItem, BeritaItem, TestimoniItem, StrukturItem, VideoItem, SaranaItem, Dokumen } from '../types';
import Toast, { ToastType } from './Toast';
import { 
  ShieldAlert, Lock, User, LogIn, Save, ArrowLeft, RefreshCw, Plus, Trash, Edit, Check, Settings, 
  BookOpen, Award, Users, Image as ImageIcon, HelpCircle, FileText, Smartphone, GraduationCap,
  Eye, EyeOff, Calendar, Play, MonitorPlay, ExternalLink, Download, Home, Heart
} from 'lucide-react';

interface AdminCMSProps {
  initialContent: SchoolContent;
  onBackToSite: () => void;
}

export const CMS_SECTIONS = [
  { id: 'beranda', label: 'Beranda / Identitas Utama', icon: GraduationCap, group: 'Utama' },
  { id: 'profil', label: 'Profil Utama & Visi Misi', icon: Settings, group: 'Utama' },
  { id: 'struktur', label: 'Struktur Organisasi', icon: Users, group: 'Utama' },
  { id: 'sarana', label: 'Sarana dan Prasarana', icon: Home, group: 'Utama' },
  { id: 'agenda', label: 'Agenda Kalender Kegiatan', icon: Calendar, group: 'Utama' },
  
  { id: 'keunggulan', label: '6 Keunggulan Sekolah', icon: Award, group: 'Program' },
  { id: 'program', label: 'Program Unggulan', icon: BookOpen, group: 'Program' },
  { id: 'prestasi', label: 'Prestasi', icon: Award, group: 'Program' },
  { id: 'guru', label: 'Manajemen Dewan Guru', icon: Users, group: 'Program' },
  { id: 'galeri', label: 'Galeri Media', icon: ImageIcon, group: 'Program' },
  { id: 'videos', label: 'Kanal Video Pembelajaran', icon: MonitorPlay, group: 'Program' },
  { id: 'ekskul', label: 'Ekstrakurikuler', icon: Settings, group: 'Program' },
  
  { id: 'perpustakaan', label: 'Manajemen Perpustakaan', icon: BookOpen, group: 'Layanan' },
  { id: 'uks', label: 'Manajemen UKS', icon: Heart, group: 'Layanan' },
  { id: 'ppdb', label: 'Alur & Kuota SPMB', icon: FileText, group: 'Layanan' },
  { id: 'faq', label: 'Kolom Tanya Jawab FAQ', icon: HelpCircle, group: 'Layanan' },
  { id: 'berita', label: 'Berita Sekolah', icon: FileText, group: 'Layanan' },
  { id: 'testimoni', label: 'Testimoni Wali Murid', icon: Users, group: 'Layanan' },
  { id: 'kontak', label: 'Kontak & Alamat', icon: HelpCircle, group: 'Layanan' },
  
  { id: 'dokumen', label: 'Dokumen', icon: FileText, group: 'Administrasi' },
  { id: 'sagara', label: 'Sagara', icon: ExternalLink, group: 'Administrasi' }
] as const;

import { loginWithGoogle, logoutUser, onSupabaseAuthStateChange, saveCMSContent, signInWithEmail, signUpWithEmail, isSupabaseConfigured } from '../supabase';
import { useCMS } from '../context/CMSContext';
import CalendarComponent from './CalendarComponent';
import { Database } from 'lucide-react';

export default function AdminCMS({ initialContent, onBackToSite }: AdminCMSProps) {
  const { logInAdmin, visitorCount } = useCMS();
  const [token, setToken] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'beranda' | 'profil' | 'keunggulan' | 'program' | 'prestasi' | 'guru' | 'galeri' | 'videos' | 'ekskul' | 'ppdb' | 'faq' | 'berita' | 'testimoni' | 'kontak' | 'agenda' | 'struktur' | 'dokumen' | 'sagara' | 'sarana' | 'perpustakaan' | 'uks'>('beranda');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['Utama', 'Program', 'Layanan', 'Administrasi']));
  const [editedContent, setEditedContent] = useState<SchoolContent>(initialContent);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Helper component for "Rich Text" editing via textarea
const RichTextEditor = ({ label, value, onChange, placeholder }: { label: string, value: string, onChange: (val: string) => void, placeholder?: string }) => (
  <div className="space-y-1.5">
    <label className="text-xs text-slate-500 font-bold uppercase tracking-wider ml-1">{label}</label>
    <textarea
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      className="w-full px-4 py-3 text-sm bg-white border border-slate-200 rounded-xl text-slate-700 font-normal min-h-[160px] focus:ring-2 focus:ring-brand-primary outline-none transition-all shadow-sm"
      placeholder={placeholder}
    />
    <p className="text-[10px] text-slate-400 italic">Mendukung tag HTML dasar: &lt;b&gt;, &lt;i&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;br&gt;</p>
  </div>
);
  const [saveStatus, setSaveStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message?: string }>({ type: 'idle' });
  const [toast, setToast] = useState<{ message: string, type: ToastType, isVisible: boolean }>({
    message: '',
    type: 'success',
    isVisible: false
  });

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type, isVisible: true });
  };

  // Check auth state
  useEffect(() => {
    const unsubscribe = onSupabaseAuthStateChange((userId) => {
      if (userId) {
        setToken(userId);
      } else {
        setToken(null);
      }
      setCheckingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  // Reset editable state if initialContent changes
  useEffect(() => {
    setEditedContent(initialContent);
  }, [initialContent]);

  // Handle Login submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const success = await logInAdmin(username, password);
      if (success) {
        showToast('Login berhasil! Selamat datang Admin.', 'success');
      } else {
        setLoginError('Username atau Password salah.');
        showToast('Gagal: Username atau Password salah', 'error');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Operasi gagal.');
      showToast('Gagal: ' + (err.message || 'Terjadi kesalahan'), 'error');
    }
  };

  const handleLogout = async () => {
    setShowLogoutModal(true);
  };

  // Generic Field Updates
  const updateMainField = (key: keyof SchoolContent, val: any) => {
    setEditedContent(prev => ({ ...prev, [key]: val }));
  };

  const updateNestedField = (parent: 'contact' | 'ppdb', key: string, val: any) => {
    setEditedContent((prev: any) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [key]: val
      }
    }));
  };

  // Service (Perpustakaan & UKS) Modification Helpers
  const updateServiceField = (service: 'perpustakaan' | 'uks', key: string, val: any) => {
    setEditedContent((prev: any) => {
      const parentObj = prev[service] || { deskripsi: '', foto: '', stats: [], fasilitas: [], program: [] };
      return {
        ...prev,
        [service]: {
          ...parentObj,
          [key]: val
        }
      };
    });
  };

  const updateServiceStat = (
    service: 'perpustakaan' | 'uks',
    index: number,
    field: 'label' | 'value',
    value: string
  ) => {
    setEditedContent((prev: any) => {
      const parentObj = prev[service] || { deskripsi: '', foto: '', stats: [], fasilitas: [], program: [] };
      const list = [...(parentObj.stats || [])];
      if (list[index]) {
        list[index] = { ...list[index], [field]: value };
      }
      return {
        ...prev,
        [service]: {
          ...parentObj,
          stats: list
        }
      };
    });
  };

  const updateServiceListItem = (
    service: 'perpustakaan' | 'uks',
    listKey: 'fasilitas' | 'program' | 'stats',
    itemId: string,
    field: string,
    value: any
  ) => {
    setEditedContent((prev: any) => {
      const parentObj = prev[service] || { deskripsi: '', foto: '', stats: [], fasilitas: [], program: [] };
      const list = [...(parentObj[listKey] || [])];
      const idx = list.findIndex((item: any) => item.id === itemId);
      if (idx !== -1) {
        list[idx] = { ...list[idx], [field]: value };
      }
      return {
        ...prev,
        [service]: {
          ...parentObj,
          [listKey]: list
        }
      };
    });
  };

  const removeServiceListItem = (
    service: 'perpustakaan' | 'uks',
    listKey: 'fasilitas' | 'program' | 'stats',
    itemId: string
  ) => {
    setEditedContent((prev: any) => {
      const parentObj = prev[service] || { deskripsi: '', foto: '', stats: [], fasilitas: [], program: [] };
      const list = (parentObj[listKey] || []).filter((item: any) => item.id !== itemId);
      return {
        ...prev,
        [service]: {
          ...parentObj,
          [listKey]: list
        }
      };
    });
    showToast('Item berhasil dihapus', 'info');
  };

  const addServiceListItem = (
    service: 'perpustakaan' | 'uks',
    listKey: 'fasilitas' | 'program' | 'stats',
    newItem: any
  ) => {
    setEditedContent((prev: any) => {
      const parentObj = prev[service] || { deskripsi: '', foto: '', stats: [], fasilitas: [], program: [] };
      const list = [...(parentObj[listKey] || []), newItem];
      return {
        ...prev,
        [service]: {
          ...parentObj,
          [listKey]: list
        }
      };
    });
    showToast('Item baru ditambahkan', 'success');
  };

  // List Modification Helpers (Add/Remove/Update lists)
  const updateListItem = <T extends { id: string }>(
    listName: keyof SchoolContent,
    id: string,
    field: keyof T,
    value: any
  ) => {
    setEditedContent((prev: any) => {
      const list = [...(prev[listName] || [])];
      const idx = list.findIndex(item => item.id === id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], [field]: value };
      }
      return { ...prev, [listName]: list };
    });
  };

  const removeListItem = (listName: keyof SchoolContent, id: string) => {
    setEditedContent((prev: any) => ({
      ...prev,
      [listName]: (prev[listName] || []).filter((item: any) => item.id !== id)
    }));
    showToast('Item berhasil dihapus', 'info');
  };

  const addListItem = (listName: keyof SchoolContent, newItem: any) => {
    setEditedContent((prev: any) => ({
      ...prev,
      [listName]: [...(prev[listName] || []), newItem]
    }));
    showToast('Item baru ditambahkan', 'success');
  };

  // Submit to Server
  const handleSaveAll = async () => {
    if (!token) return;
    setSaveStatus({ type: 'loading' });

    try {
      await saveCMSContent(editedContent);
      setSaveStatus({ type: 'success', message: 'Seluruh pembaruan konten berhasil disimpan di server.' });
      showToast('Seluruh perubahan berhasil disimpan!', 'success');
      setTimeout(() => setSaveStatus({ type: 'idle' }), 4000);
    } catch (err: any) {
      console.error(err);
      setSaveStatus({ type: 'error', message: err.message || 'Gagal menyimpan.' });
      showToast(err.message || 'Gagal menyimpan data.', 'error');
    }
  };

  // If not logged in, show elegant login card
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/40 to-indigo-50/20 flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <div className="h-16 w-16 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
        </div>
        <p className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">Memeriksa Akses...</p>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/40 to-indigo-50/20 flex items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Animated Background Gradients */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-brand-primary/10 to-transparent rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-gradient-to-tl from-brand-orange/10 to-transparent rounded-full blur-[120px] animate-pulse delay-700" />
        
        <div className="w-full max-w-[480px] relative z-10 animate-in fade-in zoom-in-95 duration-700">
          <div className="bg-white/90 backdrop-blur-xl rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.12)] border-2 border-blue-100/60 overflow-hidden">
            <div className="bg-gradient-to-br from-white via-blue-50/50 to-indigo-50/30 p-12 text-center relative border-b border-blue-50/80">
              {/* Pattern Overlay */}
              <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="h-24 w-24 bg-white rounded-[2rem] shadow-xl p-4 mb-8 transform hover:scale-105 transition-transform duration-500 border border-slate-100/50">
                  <img src={editedContent.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                </div>
                <h2 className="text-4xl font-display font-black text-slate-900 tracking-tight leading-tight mb-3">
                  Admin <span className="text-brand-primary">Portal</span>
                </h2>
                <div className="h-1 w-12 bg-brand-primary rounded-full mb-3" />
                <p className="text-slate-400 text-sm font-bold tracking-widest uppercase">Control Management System</p>
              </div>
            </div>
            
            <div className="p-12 pt-10 space-y-6">
              {loginError && (
                <div className="flex items-center space-x-4 text-red-600 bg-red-50/80 p-5 rounded-2xl border border-red-100/50 text-xs font-bold animate-shake">
                  <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
                  <input 
                    type="text" 
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="admin"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-5 bg-brand-navy hover:bg-slate-900 text-white font-black rounded-2xl transition-all flex items-center justify-center space-x-4 cursor-pointer group shadow-[0_20px_40px_-10px_rgba(15,23,42,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(15,23,42,0.4)] active:scale-[0.97]"
                >
                  <span className="tracking-[0.1em] uppercase text-sm">
                    Sign In to Dashboard
                  </span>
                  <LogIn className="h-5 w-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                </button>
              </form>



              <div className="pt-2 text-center">
                <button
                  onClick={onBackToSite}
                  className="text-xs font-bold text-slate-400 hover:text-brand-primary flex items-center justify-center space-x-2 mx-auto cursor-pointer transition-all hover:gap-4 group"
                >
                  <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
                  <span className="tracking-wide">Back to website</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center space-y-2 opacity-50">
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">
              &copy; 2026 UPT SD Negeri Remen 2
            </p>
            <p className="text-[9px] text-slate-400 font-medium">Dev | MeyGa</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/20 to-slate-50 flex flex-col sm:flex-row font-sans text-slate-900">
      {/* Sidebar - Desktop */}
      <div className="w-full sm:w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 overflow-y-auto">
        <div className="p-6 bg-gradient-to-br from-white via-blue-50/50 to-indigo-50/30 border-b border-slate-100 text-slate-800">
          <div className="flex items-center space-x-3 mb-2">
            <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center shadow-md p-1.5 overflow-hidden border border-slate-100">
              <img src={editedContent.logoUrl} alt="Logo" className="h-full w-full object-contain" />
            </div>
            <span className="font-display font-black text-lg tracking-tight text-slate-900">Admin CMS</span>
          </div>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Portal Manajemen System</p>
        </div>
        
        <nav className="flex-grow p-4 space-y-4">
          {Array.from(new Set(CMS_SECTIONS.map(s => s.group))).map((group) => (
            <div key={group} className="space-y-1">
              <button
                onClick={() => {
                  const next = new Set(expandedGroups);
                  if (next.has(group)) next.delete(group);
                  else next.add(group);
                  setExpandedGroups(next);
                }}
                className="w-full flex items-center justify-between px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-brand-primary"
              >
                {group}
                {expandedGroups.has(group) ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
              </button>
              {expandedGroups.has(group) && CMS_SECTIONS.filter(s => s.group === group).map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full text-left px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center space-x-3 ${
                    activeTab === item.id 
                      ? 'bg-brand-primary/10 text-brand-primary' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-brand-navy'
                  }`}
                >
                  <item.icon className={`h-3.5 w-3.5 ${activeTab === item.id ? 'text-brand-primary' : 'text-slate-400'}`} />
                  <span>{item.label.split(' / ')[0]}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={() => handleLogout()}
            className="w-full py-2.5 px-4 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            <ShieldAlert className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-w-0 bg-slate-50/30">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center space-x-4">
            <h1 className="text-sm sm:text-base font-bold text-brand-navy tracking-tight truncate max-w-[200px] sm:max-w-none">
              {editedContent.schoolName}
            </h1>
            <span className="hidden sm:inline-block px-2 py-0.5 bg-brand-orange/10 text-brand-orange text-[10px] font-black uppercase rounded tracking-wider">
              Administrator
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className={`hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full border ${isSupabaseConfigured ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-red-50 border-red-100 text-red-600'}`}>
              <Database className="h-3.5 w-3.5 text-emerald-500" />
              <span className="relative flex h-1.5 w-1.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isSupabaseConfigured ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${isSupabaseConfigured ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
              </span>
              <span className="text-[9px] font-black uppercase tracking-widest">{isSupabaseConfigured ? 'Database Terhubung' : 'Database Terputus'}</span>
            </div>
            <button
              onClick={onBackToSite}
              className="text-xs font-bold text-slate-500 hover:text-brand-primary flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Lihat Situs</span>
            </button>
            <div className="h-4 w-[1px] bg-slate-200" />
            <button
              onClick={handleSaveAll}
              disabled={saveStatus.type === 'loading'}
              className={`px-4 py-2 rounded-xl text-white text-xs font-bold transition-all shadow-md flex items-center space-x-2 cursor-pointer ${
                saveStatus.type === 'loading' ? 'bg-slate-400' : 'bg-brand-primary hover:bg-brand-primary/90 hover:scale-[1.02]'
              }`}
            >
              {saveStatus.type === 'loading' ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              <span>{saveStatus.type === 'loading' ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
            </button>
          </div>
        </header>

        {!isSupabaseConfigured && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-amber-700">
              <ShieldAlert className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Peringatan: Database Belum Terkoneksi</span>
            </div>
            <p className="text-[9px] text-amber-600 font-bold hidden sm:block">Konten saat ini bersifat statis. Hubungkan Supabase di panel Secrets untuk sinkronisasi database aktif.</p>
          </div>
        )}

      {/* Main CMS Layout */}
      <div className="flex-grow flex flex-col">
        
        {/* Right workspace form details (9 span) */}
        <main className="flex-grow p-6 sm:p-8 max-w-5xl mx-auto w-full space-y-8 overflow-y-auto max-h-[calc(100vh-64px)] bg-slate-50/50">
          
          {/* Dropdown pemilih bagian yang disunting */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center space-x-3.5">
              <div className="h-11 w-11 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary shadow-sm">
                {React.createElement(CMS_SECTIONS.find(s => s.id === activeTab)?.icon || Settings, { className: "h-6 w-6" })}
              </div>
              <div>
                <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest">Bagian Yang Sedang Disunting</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Silakan pilih dari daftar dropdown berikut untuk mengedit halaman:</p>
              </div>
            </div>
            
            <div className="relative min-w-[280px]">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value as any)}
                className="w-full pl-4 pr-10 py-3 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary appearance-none cursor-pointer transition-all shadow-sm hover:border-slate-300"
              >
                {CMS_SECTIONS.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-brand-primary">
                <Settings className="h-4 w-4" />
              </div>
            </div>
          </div>
          
          {/* TAB 0: Beranda Dashboard & Content */}
          {activeTab === 'beranda' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <GraduationCap className="h-32 w-32" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-display font-black text-brand-navy mb-2">Selamat Datang, Admin!</h3>
                  <p className="text-slate-500 max-w-md leading-relaxed">
                    Kelola konten utama halaman beranda, monitor statistik, dan akses cepat ke modul penting.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button onClick={() => setActiveTab('berita')} className="px-5 py-2 bg-brand-primary text-white text-xs font-bold rounded-xl shadow-md shadow-brand-primary/20 hover:-translate-y-0.5 transition-all cursor-pointer">Tulis Berita Baru</button>
                    <button onClick={() => setActiveTab('galeri')} className="px-5 py-2 bg-brand-orange text-white text-xs font-bold rounded-xl shadow-md shadow-brand-orange/20 hover:-translate-y-0.5 transition-all cursor-pointer">Update Galeri</button>
                  </div>
                </div>
              </div>

              {/* Beranda Content Editing Section */}
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-8">
                <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-2xl bg-brand-primary/10 flex items-center justify-center">
                      <GraduationCap className="h-6 w-6 text-brand-primary" />
                    </div>
                    <div>
                      <h4 className="font-display font-black text-slate-800 text-lg">Identitas Visual Beranda</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Headline & Motto Sekolah</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[11px] text-slate-500 font-black uppercase tracking-wider ml-1">URL Logo Sekolah</label>
                      <div className="flex items-center space-x-4">
                        <div className="h-14 w-14 bg-slate-50 border border-slate-200 rounded-2xl p-2 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          <img src={editedContent.logoUrl} alt="Preview Logo" className="h-full w-full object-contain" />
                        </div>
                        <input
                          type="text"
                          value={editedContent.logoUrl || ''}
                          onChange={e => updateMainField('logoUrl', e.target.value)}
                          className="flex-grow px-4 py-3.5 text-xs font-mono bg-slate-50 border border-slate-200 text-slate-500 rounded-2xl focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all"
                          placeholder="https://...logo.png"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] text-slate-500 font-black uppercase tracking-wider ml-1">Visi Utama (Headline Hero)</label>
                      <textarea
                        value={editedContent.visionStatement || ''}
                        onChange={e => updateMainField('visionStatement', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3.5 text-sm bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all font-bold leading-relaxed"
                        placeholder="Contoh: Mewujudkan Generasi Cerdas, Berkarakter dan berprestasi"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[11px] text-slate-500 font-black uppercase tracking-wider ml-1">Motto RAMAH (Slogan)</label>
                      <input
                        type="text"
                        value={editedContent.motto || ''}
                        onChange={e => updateMainField('motto', e.target.value)}
                        className="w-full px-4 py-3.5 text-sm bg-slate-50 border border-slate-200 text-brand-primary rounded-2xl focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all font-black"
                        placeholder="RAMAH | Religius - Aktif - Maju - Aman - Humanis"
                      />
                    </div>

                    <div className="pt-4 space-y-4 border-t border-slate-100">
                      <div className="flex items-center space-x-2 mb-2">
                        <RefreshCw className="h-4 w-4 text-brand-orange" />
                        <h5 className="text-xs font-black text-slate-700 uppercase tracking-widest">Running Text (Marquee)</h5>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-[11px] text-slate-500 font-black uppercase tracking-wider ml-1">Pesan Pengumuman Jalan</label>
                        <textarea
                          value={editedContent.runningText || ''}
                          onChange={e => updateMainField('runningText', e.target.value)}
                          rows={2}
                          className="w-full px-4 py-3.5 text-sm bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all"
                          placeholder="Masukkan teks pengumuman yang akan berjalan..."
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center ml-1">
                          <label className="text-[11px] text-slate-500 font-black uppercase tracking-wider">Kecepatan Jalan (Detik)</label>
                          <span className="text-[10px] font-bold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-full">{editedContent.runningTextSpeed}s</span>
                        </div>
                        <input
                          type="range"
                          min="5"
                          max="60"
                          step="1"
                          value={editedContent.runningTextSpeed || 20}
                          onChange={e => updateMainField('runningTextSpeed', parseInt(e.target.value))}
                          className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                        />
                        <div className="flex justify-between text-[9px] text-slate-400 font-bold px-1 uppercase tracking-tighter">
                          <span>Cepat (5s)</span>
                          <span>Lambat (60s)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[11px] text-slate-500 font-black uppercase tracking-wider ml-1">Judul Sekunder Hero</label>
                      <input
                        type="text"
                        value={editedContent.heroTitle || ''}
                        onChange={e => updateMainField('heroTitle', e.target.value)}
                        className="w-full px-4 py-3.5 text-sm bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[11px] text-slate-500 font-black uppercase tracking-wider ml-1">Sub-tagline Hero</label>
                      <textarea
                        value={editedContent.heroSubtitle || ''}
                        onChange={e => updateMainField('heroSubtitle', e.target.value)}
                        rows={2}
                        className="w-full px-4 py-3.5 text-sm bg-slate-50 border border-slate-200 text-slate-600 rounded-2xl focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] text-slate-500 font-black uppercase tracking-wider ml-1">URL Media Background (Video/Image)</label>
                  <input
                    type="text"
                    value={editedContent.heroVideoUrlOrImage || ''}
                    onChange={e => updateMainField('heroVideoUrlOrImage', e.target.value)}
                    className="w-full px-4 py-3.5 text-xs font-mono bg-slate-50 border border-slate-200 text-slate-500 rounded-2xl"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] text-slate-500 font-black uppercase tracking-wider ml-1">URL Banner Popup (Muncul saat pertama masuk)</label>
                  <input
                    type="text"
                    value={editedContent.popupBannerUrl || ''}
                    onChange={e => updateMainField('popupBannerUrl', e.target.value)}
                    className="w-full px-4 py-3.5 text-xs font-mono bg-slate-50 border border-slate-200 text-slate-500 rounded-2xl"
                    placeholder="https://...popup.png"
                  />
                </div>

                <div className="space-y-4 border-t border-slate-100 pt-6">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] text-slate-500 font-black uppercase tracking-wider ml-1">Hero Image Carousel (Slider Utama)</label>
                    <button 
                      onClick={() => updateMainField('heroCarousel', [...(editedContent.heroCarousel || []), ""])}
                      className="px-3 py-1 bg-brand-primary/10 text-brand-primary text-[10px] font-black rounded-lg hover:bg-brand-primary/20 transition-all flex items-center space-x-1"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Tambah Foto Carousel</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(editedContent.heroCarousel || []).map((url, idx) => (
                      <div key={idx} className="group relative bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-2 transition-all hover:shadow-md">
                        <div className="aspect-video rounded-xl overflow-hidden bg-slate-200 relative">
                          {url ? (
                            <img 
                              src={url} 
                              alt={`Carousel ${idx}`} 
                              className="w-full h-full object-cover" 
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/600x400?text=Invalid+Image+URL';
                              }} 
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                              <ImageIcon className="h-8 w-8 mb-2" />
                              <span className="text-[10px] font-bold">Belum ada foto</span>
                            </div>
                          )}
                          <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/50 backdrop-blur-md text-white text-[10px] font-black rounded-md">
                            Slide {idx + 1}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={url}
                            onChange={e => {
                              const newCarousel = [...(editedContent.heroCarousel || [])];
                              newCarousel[idx] = e.target.value;
                              updateMainField('heroCarousel', newCarousel);
                            }}
                            className="flex-grow px-3 py-2 text-[10px] font-mono bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                            placeholder="Tempel URL Foto (Unsplash/ImgBB/dll)..."
                          />
                          <button 
                            type="button"
                            onClick={() => {
                              const newCarousel = (editedContent.heroCarousel || []).filter((_, i) => i !== idx);
                              updateMainField('heroCarousel', newCarousel);
                            }}
                            className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors shadow-sm"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {(editedContent.heroCarousel?.length === 0) && (
                    <div className="py-12 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center text-slate-400 space-y-2">
                      <ImageIcon className="h-10 w-10 opacity-20" />
                      <p className="text-xs font-bold italic opacity-40">Belum ada foto di carousel. Silakan klik tambah.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats Section */}
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-2xl bg-brand-orange/10 flex items-center justify-center">
                      <Award className="h-6 w-6 text-brand-orange" />
                    </div>
                    <div>
                      <h4 className="font-display font-black text-slate-800 text-lg">Statistik Keberhasilan</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Update Pencapaian Angka</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {editedContent.stats.map((stat) => (
                    <div key={stat.id} className="p-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] space-y-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Label</label>
                        <input
                          type="text"
                          value={stat.label || ''}
                          onChange={e => updateListItem('stats', stat.id, 'label' as any, e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-bold"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Angka</label>
                          <input
                            type="number"
                            value={stat.value}
                            onChange={e => updateListItem('stats', stat.id, 'value' as any, parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl font-black text-brand-primary"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Suffix</label>
                          <input
                            type="text"
                            value={stat.suffix || ''}
                            onChange={e => updateListItem('stats', stat.id, 'suffix' as any, e.target.value)}
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-medium"
                            placeholder="ex: +"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center space-x-3 border-b border-slate-100 pb-5">
                  <div className="h-10 w-10 rounded-2xl bg-brand-orange/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-brand-orange" />
                  </div>
                  <div>
                    <h4 className="font-display font-black text-slate-800 text-lg">Sambutan Kepala UPT SD Negeri Remen 2</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Pesan & Foto Resmi</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  <div className="md:col-span-8">
                    <RichTextEditor 
                      label="Teks Sambutan Resmi"
                      value={editedContent.headmasterSpeech}
                      onChange={val => updateMainField('headmasterSpeech', val)}
                      placeholder="Tuliskan kata sambutan kepala sekolah di sini..."
                    />
                  </div>
                  <div className="md:col-span-4 space-y-6">
                    <div className="space-y-2">
                      <label className="text-[11px] text-slate-500 font-black uppercase tracking-wider ml-1">Foto Kepala UPT SD Negeri Remen 2</label>
                      <div className="aspect-[3/4] bg-slate-50 rounded-[1.5rem] overflow-hidden mb-3 border border-slate-200 group relative">
                        <img src={editedContent.headmasterPhoto} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ImageIcon className="text-white h-8 w-8" />
                        </div>
                      </div>
                      <input
                        type="text"
                        value={editedContent.headmasterPhoto || ''}
                        onChange={e => updateMainField('headmasterPhoto', e.target.value)}
                        className="w-full px-4 py-3 text-[10px] font-mono bg-slate-50 border border-slate-200 rounded-xl text-slate-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  { label: 'Total Berita', value: editedContent.berita.length, icon: FileText, color: 'bg-blue-500' },
                  { label: 'Galeri Foto', value: editedContent.galeri.length, icon: ImageIcon, color: 'bg-purple-500' },
                  { label: 'Prestasi Juara', value: editedContent.prestasi.length, icon: Award, color: 'bg-amber-500' },
                  { label: 'Dewan Guru', value: editedContent.guru.length, icon: Users, color: 'bg-emerald-500' },
                  { label: 'Total Pengunjung', value: visitorCount, icon: Eye, color: 'bg-brand-navy' }
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
                    <div className={`p-3 rounded-xl ${stat.color} text-white`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                      <p className="text-xl font-display font-black text-slate-900">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-brand-navy text-white p-6 rounded-2xl shadow-xl shadow-brand-navy/10 relative">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <FileText className="h-6 w-6 text-brand-orange" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Status Pendaftaran (SPMB)</h4>
                    <p className="text-[10px] text-white/60">Kuota Terisi: {editedContent.ppdb.kuotaTerisi} / {editedContent.ppdb.kuota} Siswa</p>
                  </div>
                  <button onClick={() => setActiveTab('ppdb')} className="ml-auto px-4 py-1.5 bg-white text-brand-navy text-[10px] font-black rounded-lg cursor-pointer hover:bg-brand-light transition-colors">Kelola SPMB</button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: Profil Utama */}
          {activeTab === 'profil' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h3 className="font-display font-bold text-lg text-brand-navy">Profil & Metadata Utama</h3>
                <p className="text-xs text-slate-500">Sesuaikan nama sekolah, NPSN, tagline hero, dan kontak administratif.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 font-bold block">Nama Lembaga Sekolah</label>
                  <input
                    type="text"
                    value={editedContent.schoolName || ''}
                    onChange={e => updateMainField('schoolName', e.target.value)}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 text-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 font-bold block">NPSN Resmi</label>
                  <input
                    type="text"
                    value={editedContent.npsn || ''}
                    onChange={e => updateMainField('npsn', e.target.value)}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 text-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 font-bold block">Nama Kepala UPT SD Negeri Remen 2</label>
                  <input
                    type="text"
                    value={editedContent.headmasterName || ''}
                    onChange={e => updateMainField('headmasterName', e.target.value)}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 text-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 font-bold block">Gelar/Jabatan Kepala UPT SD Negeri Remen 2</label>
                  <input
                    type="text"
                    value={editedContent.headmasterTitle || ''}
                    onChange={e => updateMainField('headmasterTitle', e.target.value)}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 text-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary shadow-sm"
                  />
                </div>
              </div>

              {/* Contact specific updates */}
              <div className="border-t border-slate-200 pt-6 space-y-4">
                <h4 className="text-sm font-black text-brand-navy uppercase tracking-wider">Detail Kontak Sekretariat</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-500 font-bold block">Nomor Telepon</label>
                    <input
                      type="text"
                      value={editedContent.contact.telepon || ''}
                      onChange={e => updateNestedField('contact', 'telepon', e.target.value)}
                      className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 text-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary shadow-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-500 font-bold block">Alamat Email</label>
                    <input
                      type="email"
                      value={editedContent.contact.email || ''}
                      onChange={e => updateNestedField('contact', 'email', e.target.value)}
                      className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 text-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 font-bold block">Alamat Fisik Sekolah</label>
                  <input
                    type="text"
                    value={editedContent.contact.alamat || ''}
                    onChange={e => updateNestedField('contact', 'alamat', e.target.value)}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 text-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 font-bold block">Google Maps Embed URL</label>
                  <input
                    type="text"
                    value={editedContent.contact.mapsEmbedUrl || ''}
                    onChange={e => updateNestedField('contact', 'mapsEmbedUrl', e.target.value)}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 text-slate-500 rounded-xl focus:outline-none font-mono text-[10px]"
                  />
                </div>

                <div className="pt-4 space-y-4">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Media Sosial & Website</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-500 font-bold block">URL Instagram</label>
                      <input
                        type="text"
                        value={editedContent.contact.socials?.instagram || ''}
                        onChange={e => {
                          const newSocials = { ...editedContent.contact.socials, instagram: e.target.value };
                          updateNestedField('contact', 'socials', newSocials);
                        }}
                        className="w-full px-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl"
                        placeholder="https://instagram.com/..."
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-500 font-bold block">URL Youtube</label>
                      <input
                        type="text"
                        value={editedContent.contact.socials?.youtube || ''}
                        onChange={e => {
                          const newSocials = { ...editedContent.contact.socials, youtube: e.target.value };
                          updateNestedField('contact', 'socials', newSocials);
                        }}
                        className="w-full px-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl"
                        placeholder="https://youtube.com/..."
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-500 font-bold block">URL TikTok</label>
                      <input
                        type="text"
                        value={editedContent.contact.socials?.tiktok || ''}
                        onChange={e => {
                          const newSocials = { ...editedContent.contact.socials, tiktok: e.target.value };
                          updateNestedField('contact', 'socials', newSocials);
                        }}
                        className="w-full px-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl"
                        placeholder="https://tiktok.com/@..."
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-500 font-bold block">URL Website Sekolah</label>
                      <input
                        type="text"
                        value={editedContent.contact.socials?.website || ''}
                        onChange={e => {
                          const newSocials = { ...editedContent.contact.socials, website: e.target.value };
                          updateNestedField('contact', 'socials', newSocials);
                        }}
                        className="w-full px-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Visi, Misi, Tujuan Editors */}
              <div className="border-t border-slate-200 pt-6 space-y-6">
                <h4 className="text-sm font-black text-brand-navy uppercase tracking-wider">Visi, Misi & Tujuan Sekolah</h4>
                
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-500 font-bold block">Visi Utama Sekolah</label>
                    <textarea
                      value={editedContent.visi || ''}
                      onChange={e => updateMainField('visi', e.target.value)}
                      rows={2}
                      className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 text-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                      placeholder="Masukkan visi sekolah..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-500 font-bold block">Misi Sekolah (Baris baru untuk tiap poin)</label>
                    <textarea
                      value={editedContent.misi || ''}
                      onChange={e => updateMainField('misi', e.target.value)}
                      rows={5}
                      className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 text-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                      placeholder="Masukkan misi sekolah..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-500 font-bold block">Tujuan Sekolah (Baris baru untuk tiap poin)</label>
                    <textarea
                      value={editedContent.tujuan || ''}
                      onChange={e => updateMainField('tujuan', e.target.value)}
                      rows={5}
                      className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 text-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                      placeholder="Masukkan tujuan sekolah..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Struktur Organisasi */}
          {activeTab === 'struktur' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-slate-200 pb-4">
                <h3 className="font-display font-bold text-lg text-brand-navy">Manajemen Gambar Struktur Organisasi & Komite</h3>
                <p className="text-xs text-slate-500">
                  Sekarang Anda dapat mengunggah gambar bagan struktur organisasi atau komite sekolah ke layanan hosting gambar (seperti ImgBB, Postimages, dll) lalu menempelkan link langsungnya di sini.
                </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* School Structure Section */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                  <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
                    <div className="h-9 w-9 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-display font-black text-slate-800 text-sm">Struktur Organisasi Sekolah</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Bagan Struktur Sekolah</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] text-slate-500 font-black uppercase tracking-wider block">Link Gambar Bagan Sekolah</label>
                    <input
                      type="text"
                      value={editedContent.strukturSekolahImageUrl || ''}
                      onChange={e => updateMainField('strukturSekolahImageUrl', e.target.value)}
                      className="w-full px-4 py-3 text-xs font-mono bg-slate-50 border border-slate-200 text-slate-600 rounded-2xl focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all"
                      placeholder="https://...gambar_struktur_sekolah.jpg"
                    />
                  </div>
                </div>

                {/* Committee Structure Section */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                  <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
                    <div className="h-9 w-9 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-display font-black text-slate-800 text-sm">Struktur Komite Sekolah</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Bagan Struktur Komite</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] text-slate-500 font-black uppercase tracking-wider block">Link Gambar Bagan Komite</label>
                    <input
                      type="text"
                      value={editedContent.strukturKomiteImageUrl || ''}
                      onChange={e => updateMainField('strukturKomiteImageUrl', e.target.value)}
                      className="w-full px-4 py-3 text-xs font-mono bg-slate-50 border border-slate-200 text-slate-600 rounded-2xl focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all"
                      placeholder="https://...gambar_struktur_komite.jpg"
                    />
                  </div>
                </div>
                
                {/* UKS Structure Section */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                  <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
                    <div className="h-9 w-9 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-display font-black text-slate-800 text-sm">Struktur Organisasi UKS</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Bagan Struktur UKS</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] text-slate-500 font-black uppercase tracking-wider block">Link Gambar Bagan UKS</label>
                    <input
                      type="text"
                      value={editedContent.strukturUKSImageUrl || ''}
                      onChange={e => updateMainField('strukturUKSImageUrl', e.target.value)}
                      className="w-full px-4 py-3 text-xs font-mono bg-slate-50 border border-slate-200 text-slate-600 rounded-2xl focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all"
                      placeholder="https://...gambar_struktur_uks.jpg"
                    />
                  </div>
                </div>
                
                {/* Perpustakaan Structure Section */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                  <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
                    <div className="h-9 w-9 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-display font-black text-slate-800 text-sm">Struktur Organisasi Perpustakaan</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Bagan Struktur Perpustakaan</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] text-slate-500 font-black uppercase tracking-wider block">Link Gambar Bagan Perpustakaan</label>
                    <input
                      type="text"
                      value={editedContent.strukturPerpustakaanImageUrl || ''}
                      onChange={e => updateMainField('strukturPerpustakaanImageUrl', e.target.value)}
                      className="w-full px-4 py-3 text-xs font-mono bg-slate-50 border border-slate-200 text-slate-600 rounded-2xl focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all"
                      placeholder="https://...gambar_struktur_perpustakaan.jpg"
                    />
                  </div>
                </div>
                
                {/* Ekstrakurikuler Structure Section */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                  <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
                    <div className="h-9 w-9 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-display font-black text-slate-800 text-sm">Struktur Organisasi Ekstrakurikuler</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Bagan Struktur Ekstrakurikuler</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] text-slate-500 font-black uppercase tracking-wider block">Link Gambar Bagan Ekstrakurikuler</label>
                    <input
                      type="text"
                      value={editedContent.strukturEkskulImageUrl || ''}
                      onChange={e => updateMainField('strukturEkskulImageUrl', e.target.value)}
                      className="w-full px-4 py-3 text-xs font-mono bg-slate-50 border border-slate-200 text-slate-600 rounded-2xl focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all"
                      placeholder="https://...gambar_struktur_ekskul.jpg"
                    />
                  </div>
                </div>
              </div>          </div>

              {/* Instructions Box */}
              <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl flex items-start space-x-3 text-amber-800">
                <HelpCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <h5 className="font-bold text-xs uppercase tracking-wider">Petunjuk Cara Mengisi Link Gambar:</h5>
                  <ol className="list-decimal pl-4 text-xs space-y-1 text-amber-700/95 leading-relaxed font-medium">
                    <li>Buat bagan struktur sekolah/komite Anda (bisa berupa foto, Canva, PDF yang di-export jadi gambar, atau hasil scan).</li>
                    <li>Kunjungi situs gratis pengunggah gambar seperti <a href="https://imgbb.com/" target="_blank" rel="noreferrer" className="underline font-bold hover:text-amber-900">ImgBB</a> atau <a href="https://postimages.org/" target="_blank" rel="noreferrer" className="underline font-bold hover:text-amber-900">Postimages</a>.</li>
                    <li>Upload gambar Anda, lalu setelah berhasil, pilih opsi <strong>Link Langsung (Direct Link)</strong> yang berakhiran dengan format gambar seperti <code>.jpg</code>, <code>.png</code>, atau <code>.webp</code>.</li>
                    <li>Paste (tempel) link langsung tersebut ke kotak input di atas dan klik tombol <strong>"Simpan Perubahan"</strong> di pojok kanan atas!</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Keunggulan */}
          {activeTab === 'keunggulan' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h3 className="font-display font-bold text-lg text-brand-navy">Pilar Keunggulan Pembelajaran</h3>
                <p className="text-xs text-slate-500">Sesuaikan ikon Lucide, judul, dan penjelasan 6 pilar keunggulan sekolah.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {editedContent.keunggulan.map((item, idx) => (
                  <div key={item.id} className="p-5 bg-white border border-slate-100 rounded-2xl space-y-4 shadow-sm">
                    <span className="text-[10px] font-extrabold uppercase bg-brand-primary/10 text-brand-primary px-2.5 py-1 rounded">Pilar {idx + 1}</span>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 block">Ikon Lucide (e.g. Award)</label>
                        <input
                          type="text"
                          value={item.iconName}
                          onChange={e => updateListItem<KeunggulanItem>('keunggulan', item.id, 'iconName', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-brand-primary font-bold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 block">Judul Pilar</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={e => updateListItem<KeunggulanItem>('keunggulan', item.id, 'title', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 block font-bold">Deskripsi Penjelasan</label>
                      <textarea
                        value={item.description}
                        rows={2}
                        onChange={e => updateListItem<KeunggulanItem>('keunggulan', item.id, 'description', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-600 font-light"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Program Unggulan */}
          {activeTab === 'program' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4 flex justify-between items-center">
                <div>
                  <h3 className="font-display font-bold text-lg text-brand-navy">Program Unggulan</h3>
                  <p className="text-xs text-slate-500">Atur program, kurikulum komputasional, atau kelas keagamaan sekolah.</p>
                </div>
                <button
                  onClick={() => addListItem('programs', {
                    id: 'prog_' + Date.now(),
                    title: 'Program Baru',
                    description: 'Deskripsi program...',
                    category: 'Kurikulum',
                    image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=600'
                  })}
                  className="px-3.5 py-1.5 bg-brand-orange text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-md shadow-brand-orange/20"
                >
                  <Plus className="h-4 w-4" />
                  <span>Program Baru</span>
                </button>
              </div>

              <div className="space-y-4">
                {editedContent.programs.map((prog) => (
                  <div key={prog.id} className="p-5 bg-white border border-slate-100 rounded-2xl grid grid-cols-1 md:grid-cols-12 gap-4 items-center shadow-sm">
                    <div className="md:col-span-3">
                      <img src={prog.image} className="w-full aspect-video rounded-xl object-cover" />
                      <input
                        type="text"
                        value={prog.image}
                        onChange={e => updateListItem<ProgramItem>('programs', prog.id, 'image', e.target.value)}
                        className="w-full px-2 py-1 mt-1 text-[9px] bg-slate-50 border border-slate-200 rounded text-slate-500 font-mono"
                        placeholder="Image URL"
                      />
                    </div>

                    <div className="md:col-span-8 space-y-2">
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={prog.title}
                          onChange={e => updateListItem<ProgramItem>('programs', prog.id, 'title', e.target.value)}
                          className="col-span-2 px-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-brand-navy font-bold"
                          placeholder="Program Title"
                        />
                        <input
                          type="text"
                          value={prog.category}
                          onChange={e => updateListItem<ProgramItem>('programs', prog.id, 'category', e.target.value)}
                          className="px-3 py-1.5 text-xs bg-brand-primary/5 border border-brand-primary/10 rounded-lg text-brand-primary font-bold"
                          placeholder="Category"
                        />
                      </div>
                      <textarea
                        value={prog.description}
                        rows={2}
                        onChange={e => updateListItem<ProgramItem>('programs', prog.id, 'description', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-600 font-light"
                        placeholder="Description"
                      />
                    </div>

                    <div className="md:col-span-1 flex justify-end">
                      <button
                        onClick={() => removeListItem('programs', prog.id)}
                        className="p-2 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all cursor-pointer"
                        title="Delete Program"
                      >
                        <Trash className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Prestasi */}
          {activeTab === 'prestasi' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4 flex justify-between items-center">
                <div>
                  <h3 className="font-display font-bold text-lg text-brand-navy">Prestasi</h3>
                  <p className="text-xs text-slate-500">Atur catatan emas perlombaan keagamaan, bela diri, atau sains nasional.</p>
                </div>
                <button
                  onClick={() => addListItem('prestasi', {
                    id: 'pres_' + Date.now(),
                    title: 'Pemenang Baru',
                    achievement: 'Juara 1 Tingkat Kabupaten',
                    description: 'Penjelasan prestasi...',
                    category: 'Siswa',
                    subCategory: 'Akademik',
                    date: '20 Juni 2026',
                    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=600'
                  })}
                  className="px-3.5 py-1.5 bg-brand-orange text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-md shadow-brand-orange/20"
                >
                  <Plus className="h-4 w-4" />
                  <span>Prestasi Baru</span>
                </button>
              </div>

              <div className="space-y-4">
                {editedContent.prestasi.map((item) => (
                  <div key={item.id} className="p-5 bg-white border border-slate-100 rounded-2xl grid grid-cols-1 md:grid-cols-12 gap-4 items-center shadow-sm">
                    <div className="md:col-span-3">
                      <img src={item.image} className="w-full aspect-video rounded-xl object-cover" />
                      <input
                        type="text"
                        value={item.image}
                        onChange={e => updateListItem<PrestasiItem>('prestasi', item.id, 'image', e.target.value)}
                        className="w-full px-2 py-1 mt-1 text-[9px] bg-slate-50 border border-slate-200 rounded text-slate-500 font-mono"
                      />
                    </div>

                    <div className="md:col-span-8 space-y-2">
                      <div className="grid grid-cols-12 gap-2">
                        <input
                          type="text"
                          value={item.title}
                          onChange={e => updateListItem<PrestasiItem>('prestasi', item.id, 'title', e.target.value)}
                          className="col-span-7 px-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                          placeholder="Event Title"
                        />
                        <select
                          value={item.category}
                          onChange={e => {
                              updateListItem<PrestasiItem>('prestasi', item.id, 'category', e.target.value as any);
                              if (e.target.value !== 'Siswa') {
                                 updateListItem<PrestasiItem>('prestasi', item.id, 'subCategory', undefined);
                              }
                          }}
                          className="col-span-5 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-brand-primary font-bold focus:outline-none"
                        >
                          <option value="Siswa">Siswa</option>
                          <option value="Guru">Guru</option>
                          <option value="Sekolah">Sekolah</option>
                        </select>
                      </div>
                      
                      {item.category === 'Siswa' && (
                        <div className="grid grid-cols-12 gap-2">
                            <select
                                value={item.subCategory || ''}
                                onChange={e => updateListItem<PrestasiItem>('prestasi', item.id, 'subCategory', e.target.value as any)}
                                className="col-span-12 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-brand-primary font-bold focus:outline-none"
                            >
                                <option value="">-- Pilih Kategori --</option>
                                <option value="Akademik">Akademik</option>
                                <option value="Non akademik">Non akademik</option>
                            </select>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={item.achievement}
                          onChange={e => updateListItem<PrestasiItem>('prestasi', item.id, 'achievement', e.target.value)}
                          className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-brand-orange font-bold"
                          placeholder="Trophy Achieved (e.g. Juara 1)"
                        />
                        <input
                          type="text"
                          value={item.date}
                          onChange={e => updateListItem<PrestasiItem>('prestasi', item.id, 'date', e.target.value)}
                          className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-500"
                          placeholder="Date"
                        />
                      </div>

                      <textarea
                        value={item.description}
                        rows={2}
                        onChange={e => updateListItem<PrestasiItem>('prestasi', item.id, 'description', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-600 font-light"
                        placeholder="Describe Achievement"
                      />
                    </div>

                    <div className="md:col-span-1 flex justify-end">
                      <button
                        onClick={() => removeListItem('prestasi', item.id)}
                        className="p-2 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all cursor-pointer"
                      >
                        <Trash className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Dewan Guru */}
          {activeTab === 'guru' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4 flex justify-between items-center">
                <div>
                  <h3 className="font-display font-bold text-lg text-brand-navy">Dewan Guru & Tenaga Kependidikan</h3>
                  <p className="text-xs text-slate-500">Pembaruan profil guru wali kelas, mata pelajaran, dan kontak email.</p>
                </div>
                <button
                  onClick={() => addListItem('guru', {
                    id: 'guru_' + Date.now(),
                    name: 'Guru Baru, S.Pd',
                    role: 'Guru Kelas 4',
                    subject: 'Pendidikan Agama & Budi Pekerti',
                    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
                    socials: { email: 'guru@sdnremen2.sch.id', instagram: '', facebook: '' }
                  })}
                  className="px-3.5 py-1.5 bg-brand-orange text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-md shadow-brand-orange/20"
                >
                  <Plus className="h-4 w-4" />
                  <span>Guru Baru</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {editedContent.guru.map((guru) => (
                  <div key={guru.id} className="p-5 bg-white border border-slate-100 rounded-2xl space-y-4 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div className="h-14 w-14 rounded-full overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                        <img src={guru.photo} className="h-full w-full object-cover object-top" />
                      </div>
                      
                      <button
                        onClick={() => removeListItem('guru', guru.id)}
                        className="p-1.5 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-all cursor-pointer"
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <input
                        type="text"
                        value={guru.name}
                        onChange={e => updateListItem<GuruItem>('guru', guru.id, 'name', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                        placeholder="Teacher Name & Degrees"
                      />

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={guru.role}
                          onChange={e => updateListItem<GuruItem>('guru', guru.id, 'role', e.target.value)}
                          className="px-3 py-1.5 text-xs bg-brand-primary/5 border border-brand-primary/10 rounded-lg text-brand-primary font-bold"
                          placeholder="Role (e.g. Wali Kelas 1)"
                        />
                        <input
                          type="text"
                          value={guru.subject}
                          onChange={e => updateListItem<GuruItem>('guru', guru.id, 'subject', e.target.value)}
                          className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-600"
                          placeholder="Teaching Subject"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={guru.photo}
                          onChange={e => updateListItem<GuruItem>('guru', guru.id, 'photo', e.target.value)}
                          className="px-2 py-1.5 text-[10px] font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-400"
                          placeholder="Photo URL"
                        />
                        <input
                          type="email"
                          value={guru.socials?.email || ''}
                          onChange={e => {
                            const updatedSocials = { ...(guru.socials || {}), email: e.target.value };
                            updateListItem<GuruItem>('guru', guru.id, 'socials', updatedSocials);
                          }}
                          className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-600"
                          placeholder="E-mail"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB Sarana */}
          {activeTab === 'sarana' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4 flex justify-between items-center">
                <div>
                  <h3 className="font-display font-bold text-lg text-brand-navy">Sarana & Prasarana</h3>
                  <p className="text-xs text-slate-500">Kelola daftar sarana dan prasarana sekolah.</p>
                </div>
                <button
                  onClick={() => addListItem('sarana', {
                    id: 'sarana_' + Date.now(),
                    name: 'Sarana Baru',
                    description: 'Deskripsi sarana baru...',
                    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600'
                  })}
                  className="px-3.5 py-1.5 bg-brand-orange text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-md shadow-brand-orange/20"
                >
                  <Plus className="h-4 w-4" />
                  <span>Sarana Baru</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {editedContent.sarana.map((item) => (
                  <div key={item.id} className="p-4 bg-white border border-slate-100 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm">
                    <img src={item.imageUrl} className="w-full aspect-video rounded-xl object-cover" />
                    <div className="space-y-2">
                       <input
                        type="text"
                        value={item.name}
                        onChange={e => updateListItem<SaranaItem>('sarana', item.id, 'name', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                        placeholder="Nama Sarana"
                      />
                      <textarea
                        value={item.description}
                        onChange={e => updateListItem<SaranaItem>('sarana', item.id, 'description', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-600"
                        placeholder="Deskripsi"
                        rows={2}
                      />
                      <input
                        type="text"
                        value={item.imageUrl}
                        onChange={e => updateListItem<SaranaItem>('sarana', item.id, 'imageUrl', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-500"
                        placeholder="URL Gambar"
                      />
                    </div>
                    <button
                      onClick={() => removeListItem('sarana', item.id)}
                      className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg font-bold"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: Galeri Media */}
          {activeTab === 'galeri' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4 flex justify-between items-center">
                <div>
                  <h3 className="font-display font-bold text-lg text-brand-navy">Galeri Foto & Sarana</h3>
                  <p className="text-xs text-slate-500">Kelola visualisasi kegiatan dan prasarana di SD Negeri Remen 2.</p>
                </div>
                <button
                  onClick={() => addListItem('galeri', {
                    id: 'gal_' + Date.now(),
                    title: 'Foto Kegiatan Baru',
                    category: 'Kegiatan',
                    url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=600'
                  })}
                  className="px-3.5 py-1.5 bg-brand-orange text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-md shadow-brand-orange/20"
                >
                  <Plus className="h-4 w-4" />
                  <span>Foto Baru</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {editedContent.galeri.map((photo) => (
                  <div key={photo.id} className="p-4 bg-white border border-slate-100 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm">
                    <img src={photo.url} className="w-full aspect-video rounded-xl object-cover" />
                    
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={photo.title}
                          onChange={e => updateListItem<GaleriItem>('galeri', photo.id, 'title', e.target.value)}
                          className="col-span-2 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                          placeholder="Caption / Title"
                        />
                        <select
                          value={photo.category}
                          onChange={e => updateListItem<GaleriItem>('galeri', photo.id, 'category', e.target.value as any)}
                          className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-brand-orange font-bold focus:outline-none"
                        >
                          <option value="Kegiatan">Kegiatan</option>
                          <option value="Prestasi">Prestasi</option>
                          <option value="Pembelajaran">Pembelajaran</option>
                          <option value="Sarana">Sarana</option>
                        </select>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={photo.url}
                          onChange={e => updateListItem<GaleriItem>('galeri', photo.id, 'url', e.target.value)}
                          className="flex-grow px-2 py-1.5 text-[10px] font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-400"
                        />
                        <button
                          onClick={() => removeListItem('galeri', photo.id)}
                          className="p-1.5 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-all cursor-pointer"
                        >
                          <Trash className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: Kanal Video Pembelajaran */}
          {activeTab === 'videos' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4 flex justify-between items-center">
                <div>
                  <h3 className="font-display font-bold text-lg text-brand-navy">Kanal Video Pembelajaran & Kegiatan</h3>
                  <p className="text-xs text-slate-500">Kelola daftar putar video kegiatan, proyek P5, dan profil sekolah dari YouTube.</p>
                </div>
                <button
                  onClick={() => addListItem('videos', {
                    id: 'vid_' + Date.now(),
                    youtubeId: 'dQw4w9WgXcQ',
                    title: 'Video Baru Sekolah',
                    duration: '5:00',
                    category: 'Kegiatan Siswa',
                    thumbnail: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=600'
                  })}
                  className="px-3.5 py-1.5 bg-brand-orange text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-md shadow-brand-orange/20"
                >
                  <Plus className="h-4 w-4" />
                  <span>Tambah Video</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(editedContent.videos || []).map((video) => (
                  <div key={video.id} className="p-4 bg-white border border-slate-100 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm relative">
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100">
                      <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                        <div className="bg-red-600 text-white p-2 rounded-full shadow-lg">
                          <Play className="h-4 w-4 fill-white" />
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeListItem('videos', video.id)}
                      className="absolute top-6 right-6 p-1.5 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-all cursor-pointer z-10"
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </button>

                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Judul Video</label>
                        <input
                          type="text"
                          value={video.title}
                          onChange={e => updateListItem<VideoItem>('videos', video.id, 'title', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                          placeholder="Judul Video"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">YouTube ID</label>
                          <input
                            type="text"
                            value={video.youtubeId}
                            onChange={e => updateListItem<VideoItem>('videos', video.id, 'youtubeId', e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                            placeholder="Contoh: dQw4w9WgXcQ"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Durasi</label>
                          <input
                            type="text"
                            value={video.duration}
                            onChange={e => updateListItem<VideoItem>('videos', video.id, 'duration', e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                            placeholder="Contoh: 4:15"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Kategori</label>
                          <select
                            value={video.category}
                            onChange={e => updateListItem<VideoItem>('videos', video.id, 'category', e.target.value as any)}
                            className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-brand-orange font-bold focus:outline-none"
                          >
                            <option value="Profil Utama">Profil Utama</option>
                            <option value="Kegiatan Siswa">Kegiatan Siswa</option>
                            <option value="Smart Classroom">Smart Classroom</option>
                            <option value="Sains & Teknologi">Sains & Teknologi</option>
                            <option value="Kesenian & Budaya">Kesenian & Budaya</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">URL Cover / Thumbnail</label>
                          <input
                            type="text"
                            value={video.thumbnail}
                            onChange={e => updateListItem<VideoItem>('videos', video.id, 'thumbnail', e.target.value)}
                            className="w-full px-3 py-1.5 text-[10px] font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-500"
                            placeholder="URL Gambar Thumbnail"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: Ekstrakurikuler */}
          {activeTab === 'ekskul' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4 flex justify-between items-center">
                <div>
                  <h3 className="font-display font-bold text-lg text-brand-navy">Program Ekstrakurikuler</h3>
                  <p className="text-xs text-slate-500">Atur 8 kegiatan pembinaan karakter, pramuka, bela diri, atau seni siswa.</p>
                </div>
                <button
                  onClick={() => addListItem('ekstrakurikuler', {
                    id: 'ek_' + Date.now(),
                    name: 'Ekskul Baru',
                    description: 'Pembinaan ekstrakurikuler baru...',
                    iconName: 'Compass',
                    pembina: 'Nama Pembina',
                    waktu: 'Hari, Pukul'
                  })}
                  className="px-3.5 py-1.5 bg-brand-orange text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-md shadow-brand-orange/20"
                >
                  <Plus className="h-4 w-4" />
                  <span>Ekskul Baru</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {editedContent.ekstrakurikuler.map((item) => (
                  <div key={item.id} className="p-4 bg-white border border-slate-100 rounded-2xl space-y-3 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={item.name}
                        onChange={e => updateListItem<EkstrakurikulerItem>('ekstrakurikuler', item.id, 'name', e.target.value)}
                        className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                        placeholder="Ekskul Name"
                      />
                      <input
                        type="text"
                        value={item.iconName}
                        onChange={e => updateListItem<EkstrakurikulerItem>('ekstrakurikuler', item.id, 'iconName', e.target.value)}
                        className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-brand-orange font-bold"
                        placeholder="Lucide Icon (e.g. Compass)"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={item.pembina}
                        onChange={e => updateListItem<EkstrakurikulerItem>('ekstrakurikuler', item.id, 'pembina', e.target.value)}
                        className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                        placeholder="Nama Pembina"
                      />
                      <input
                        type="text"
                        value={item.waktu}
                        onChange={e => updateListItem<EkstrakurikulerItem>('ekstrakurikuler', item.id, 'waktu', e.target.value)}
                        className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                        placeholder="Hari, Pukul"
                      />
                    </div>

                    <div className="flex gap-2">
                      <textarea
                        value={item.description}
                        rows={2}
                        onChange={e => updateListItem<EkstrakurikulerItem>('ekstrakurikuler', item.id, 'description', e.target.value)}
                        className="flex-grow px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-600 font-light"
                        placeholder="Description"
                      />
                      <button
                        onClick={() => removeListItem('ekstrakurikuler', item.id)}
                        className="p-2 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-all self-end cursor-pointer"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: SPMB Config */}
          {activeTab === 'ppdb' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h3 className="font-display font-bold text-lg text-brand-navy">Kuota & Alur Pendaftaran SPMB</h3>
                <p className="text-xs text-slate-500">Sesuaikan status pembukaan, kapasitas kursi terisi, dan berkas persyaratan resmi.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 block font-bold">Status SPMB</label>
                  <input
                    type="text"
                    value={editedContent.ppdb.status}
                    onChange={e => updateNestedField('ppdb', 'status', e.target.value)}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 text-slate-900 rounded-xl font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 block font-bold">Total Kuota Kursi</label>
                  <input
                    type="number"
                    value={editedContent.ppdb.kuota}
                    onChange={e => updateNestedField('ppdb', 'kuota', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 text-slate-900 rounded-xl font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 block font-bold">Siswa Terisi (Terdaftar)</label>
                  <input
                    type="number"
                    value={editedContent.ppdb.kuotaTerisi}
                    onChange={e => updateNestedField('ppdb', 'kuotaTerisi', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 text-brand-primary rounded-xl font-black"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 block font-bold">Tanggal & Waktu Batas Akhir Hitung Mundur</label>
                <input
                  type="datetime-local"
                  value={editedContent.ppdb.countdownDate ? editedContent.ppdb.countdownDate.substring(0, 16) : ''}
                  onChange={e => updateNestedField('ppdb', 'countdownDate', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs bg-white border border-slate-200 text-brand-orange rounded-xl font-bold"
                />
              </div>

              {/* Requirements array update */}
              <div className="space-y-3">
                <label className="text-xs text-slate-500 block font-bold">Berkas Persyaratan Administrasi</label>
                {editedContent.ppdb.persyaratan.map((req, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={req}
                      onChange={e => {
                        const newPersyaratan = [...editedContent.ppdb.persyaratan];
                        newPersyaratan[idx] = e.target.value;
                        updateNestedField('ppdb', 'persyaratan', newPersyaratan);
                      }}
                      className="flex-grow px-3 py-2 text-xs bg-white border border-slate-200 text-slate-700 rounded-lg"
                    />
                    <button
                      onClick={() => {
                        const newPersyaratan = editedContent.ppdb.persyaratan.filter((_, i) => i !== idx);
                        updateNestedField('ppdb', 'persyaratan', newPersyaratan);
                      }}
                      className="p-1.5 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-all cursor-pointer"
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newPersyaratan = [...editedContent.ppdb.persyaratan, 'Persyaratan baru...'];
                    updateNestedField('ppdb', 'persyaratan', newPersyaratan);
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[11px] font-bold text-slate-600 rounded-lg flex items-center space-x-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Tambah Syarat</span>
                </button>
              </div>

              {/* Jadwal Penting update */}
              <div className="space-y-3 pt-4 border-t border-slate-150">
                <label className="text-xs text-slate-500 block font-bold">Jadwal Penting SPMB</label>
                {(editedContent.ppdb.jadwal || []).map((item, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row gap-2 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 block font-semibold">Nama Tahapan / Jalur</span>
                        <input
                          type="text"
                          value={item.phase}
                          onChange={e => {
                            const newJadwal = [...(editedContent.ppdb.jadwal || [])];
                            newJadwal[idx] = { ...newJadwal[idx], phase: e.target.value };
                            updateNestedField('ppdb', 'jadwal', newJadwal);
                          }}
                          placeholder="Contoh: Gelombang 1"
                          className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 block font-semibold">Waktu Pelaksanaan</span>
                        <input
                          type="text"
                          value={item.date}
                          onChange={e => {
                            const newJadwal = [...(editedContent.ppdb.jadwal || [])];
                            newJadwal[idx] = { ...newJadwal[idx], date: e.target.value };
                            updateNestedField('ppdb', 'jadwal', newJadwal);
                          }}
                          placeholder="Contoh: 1 - 20 Juni 2026"
                          className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const newJadwal = (editedContent.ppdb.jadwal || []).filter((_, i) => i !== idx);
                        updateNestedField('ppdb', 'jadwal', newJadwal);
                      }}
                      className="p-1.5 self-end sm:self-center bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-all cursor-pointer flex-shrink-0"
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newJadwal = [...(editedContent.ppdb.jadwal || []), { phase: 'Tahapan Baru', date: 'Tanggal Pelaksanaan' }];
                    updateNestedField('ppdb', 'jadwal', newJadwal);
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[11px] font-bold text-slate-600 rounded-lg flex items-center space-x-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Tambah Jadwal</span>
                </button>
              </div>

              {/* Alur & Prosedur Pendaftaran update */}
              <div className="space-y-3 pt-4 border-t border-slate-150">
                <label className="text-xs text-slate-500 block font-bold">Alur & Prosedur Pendaftaran</label>
                {(editedContent.ppdb.alur || []).map((item, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row gap-2 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="flex-shrink-0 flex items-center justify-center bg-brand-primary/10 h-7 w-7 rounded-full text-brand-navy dark:text-white font-extrabold text-xs">
                      {idx + 1}
                    </div>
                    <div className="flex-grow grid grid-cols-1 gap-2">
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 block font-semibold">Judul Alur</span>
                        <input
                          type="text"
                          value={item.title}
                          onChange={e => {
                            const newAlur = [...(editedContent.ppdb.alur || [])];
                            newAlur[idx] = { ...newAlur[idx], title: e.target.value };
                            updateNestedField('ppdb', 'alur', newAlur);
                          }}
                          placeholder="Contoh: Pengisian Formulir"
                          className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 block font-semibold">Deskripsi Alur</span>
                        <textarea
                          value={item.desc}
                          onChange={e => {
                            const newAlur = [...(editedContent.ppdb.alur || [])];
                            newAlur[idx] = { ...newAlur[idx], desc: e.target.value };
                            updateNestedField('ppdb', 'alur', newAlur);
                          }}
                          placeholder="Keterangan alur..."
                          rows={2}
                          className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const newAlur = (editedContent.ppdb.alur || []).filter((_, i) => i !== idx)
                          .map((val, i) => ({ ...val, step: i + 1 })); // recalculate step order
                        updateNestedField('ppdb', 'alur', newAlur);
                      }}
                      className="p-1.5 self-end sm:self-center bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-all cursor-pointer flex-shrink-0"
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const nextStep = (editedContent.ppdb.alur || []).length + 1;
                    const newAlur = [...(editedContent.ppdb.alur || []), { step: nextStep, title: 'Langkah Baru', desc: 'Penjelasan detail langkah pendaftaran...' }];
                    updateNestedField('ppdb', 'alur', newAlur);
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[11px] font-bold text-slate-600 rounded-lg flex items-center space-x-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Tambah Alur</span>
                </button>
              </div>

              {/* SPMB Student Management Callout */}
              <div className="mt-8 bg-brand-navy/5 border border-brand-navy/10 p-5 rounded-2xl space-y-3">
                <div className="flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5 text-brand-primary" />
                  <h4 className="text-sm font-bold text-brand-navy">Manajemen Calon Siswa SPMB</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Semua data siswa yang mendaftar online disimpan secara aman dan real-time di database Firestore. Anda dapat mengedit detail (nama, NIK, status diterima/tidak diterima) atau menghapus siswa tersebut langsung pada tabel halaman <b>SPMB Online</b> di website saat Anda login dan mode edit aktif.
                </p>
                <button
                  onClick={() => {
                    onBackToSite();
                    setTimeout(() => {
                      window.location.href = '/spmb#daftar-siswa-diterima';
                    }, 100);
                  }}
                  className="px-4 py-2 bg-brand-primary hover:bg-brand-primary/95 text-slate-950 text-xs font-bold rounded-xl transition-colors shadow-sm shadow-brand-primary/10 flex items-center space-x-1.5"
                >
                  <span>Buka & Kelola Daftar Siswa di Halaman SPMB Website</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB: Agenda Kalender */}
          {activeTab === 'agenda' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h3 className="font-display font-bold text-lg text-brand-navy">Kelola Kalender Agenda Sekolah</h3>
                <p className="text-xs text-slate-500">
                  Tambahkan atau hapus agenda kegiatan sekolah secara interaktif dengan mengklik langsung pada tanggal pilihan Anda di kalender bawah ini.
                </p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <CalendarComponent lang="id" agenda={editedContent.agenda || []} />
              </div>
            </div>
          )}

          {/* TAB 9: FAQ */}
          {activeTab === 'faq' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4 flex justify-between items-center">
                <div>
                  <h3 className="font-display font-bold text-lg text-brand-navy">Kolom Pertanyaan & Jawaban (FAQ)</h3>
                  <p className="text-xs text-slate-500">Atur rujukan pertanyaan seputar SPP, pendaftaran, dan seragam.</p>
                </div>
                <button
                  onClick={() => addListItem('faq', {
                    id: 'faq_' + Date.now(),
                    question: 'Pertanyaan baru?',
                    answer: 'Jawaban detail...'
                  })}
                  className="px-3.5 py-1.5 bg-brand-orange text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-md shadow-brand-orange/20"
                >
                  <Plus className="h-4 w-4" />
                  <span>FAQ Baru</span>
                </button>
              </div>

              <div className="space-y-4">
                {editedContent.faq.map((item, idx) => (
                  <div key={item.id} className="p-5 bg-white border border-slate-100 rounded-2xl space-y-3 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-primary bg-brand-primary/10 px-2.5 py-1 rounded">Q&A {idx + 1}</span>
                      <button
                        onClick={() => removeListItem('faq', item.id)}
                        className="p-1.5 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-all cursor-pointer"
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <input
                        type="text"
                        value={item.question}
                        onChange={e => updateListItem<FAQItem>('faq', item.id, 'question', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                        placeholder="Question text"
                      />
                      <textarea
                        value={item.answer}
                        rows={2}
                        onChange={e => updateListItem<FAQItem>('faq', item.id, 'answer', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-600 font-light"
                        placeholder="Answer text"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 10: Berita Sekolah */}
          {activeTab === 'berita' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4 flex justify-between items-center">
                <div>
                  <h3 className="font-display font-bold text-lg text-brand-navy">Berita Sekolah</h3>
                  <p className="text-xs text-slate-500">Atur artikel berita terbaru.</p>
                </div>
                <button
                  onClick={() => addListItem('berita', {
                    id: 'berita_' + Date.now(),
                    title: 'Berita Baru',
                    category: 'Umum',
                    summary: 'Ringkasan singkat...',
                    content: 'Konten lengkap...',
                    date: new Date().toLocaleDateString('id-ID'),
                    thumbnail: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=600'
                  })}
                  className="px-3.5 py-1.5 bg-brand-orange text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-md shadow-brand-orange/20"
                >
                  <Plus className="h-4 w-4" />
                  <span>Berita Baru</span>
                </button>
              </div>

              <div className="space-y-4">
                {editedContent.berita.map((item) => (
                  <div key={item.id} className="p-5 bg-white border border-slate-100 rounded-2xl space-y-3 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-primary bg-brand-primary/10 px-2.5 py-1 rounded">{item.date}</span>
                      <button
                        onClick={() => removeListItem('berita', item.id)}
                        className="p-1.5 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-all cursor-pointer"
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={item.title}
                      onChange={e => updateListItem<BeritaItem>('berita', item.id, 'title', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                      placeholder="Judul Berita"
                    />
                    <textarea
                      value={item.summary}
                      rows={2}
                      onChange={e => updateListItem<BeritaItem>('berita', item.id, 'summary', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-600 font-light"
                      placeholder="Ringkasan"
                    />
                    <RichTextEditor 
                        label="Konten Berita"
                        value={item.content}
                        onChange={val => updateListItem<BeritaItem>('berita', item.id, 'content', val)}
                        placeholder="Konten lengkap..."
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 11: Testimoni */}
          {activeTab === 'testimoni' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4 flex justify-between items-center">
                <div>
                  <h3 className="font-display font-bold text-lg text-brand-navy">Testimoni</h3>
                  <p className="text-xs text-slate-500">Atur testimoni dari orang tua, alumni, siswa, dan guru.</p>
                </div>
                <button
                  onClick={() => addListItem('testimoni', {
                    id: 'test_' + Date.now(),
                    name: 'Nama Baru',
                    role: 'Orang Tua',
                    relation: 'Orang Tua Siswa Kelas 4',
                    content: 'Testimoni...',
                    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
                  })}
                  className="px-3.5 py-1.5 bg-brand-orange text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-md shadow-brand-orange/20"
                >
                  <Plus className="h-4 w-4" />
                  <span>Testimoni Baru</span>
                </button>
              </div>

              <div className="space-y-4">
                {editedContent.testimoni.map((item) => (
                  <div key={item.id} className="p-5 bg-white border border-slate-100 rounded-2xl space-y-3 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-primary bg-brand-primary/10 px-2.5 py-1 rounded">{item.role}</span>
                      <button
                        onClick={() => removeListItem('testimoni', item.id)}
                        className="p-1.5 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-all cursor-pointer"
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={item.name}
                      onChange={e => updateListItem<TestimoniItem>('testimoni', item.id, 'name', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                      placeholder="Nama"
                    />
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-slate-50 border border-slate-200 rounded-full flex-shrink-0 overflow-hidden">
                        <img src={item.avatar} alt="Avatar" className="h-full w-full object-cover" />
                      </div>
                      <input
                        type="text"
                        value={item.avatar}
                        onChange={e => updateListItem<TestimoniItem>('testimoni', item.id, 'avatar', e.target.value)}
                        className="flex-grow px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-600"
                        placeholder="URL Foto Avatar"
                      />
                    </div>
                    <textarea
                      value={item.content}
                      rows={2}
                      onChange={e => updateListItem<TestimoniItem>('testimoni', item.id, 'content', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-600 font-light"
                      placeholder="Konten Testimoni"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 12: Dokumen */}
          {activeTab === 'dokumen' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-display font-bold text-lg text-brand-navy">Kelola Dokumen Umum</h3>
                  <p className="text-xs text-slate-500">Kelola berkas dokumen sekolah, panduan, administrasi, regulasi, dsb.</p>
                </div>
                <button
                  onClick={() => addListItem('dokumen', {
                    id: 'doc_' + Date.now(),
                    title: 'Dokumen Baru',
                    url: 'https://example.com/dokumen.pdf'
                  })}
                  className="px-3.5 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-md shadow-brand-primary/10 transition-all self-end"
                >
                  <Plus className="h-4 w-4" />
                  <span>Tambah Dokumen</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {(editedContent.dokumen || []).length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
                    <p className="text-sm text-slate-400 font-medium">Belum ada dokumen yang ditambahkan.</p>
                    <button
                      onClick={() => addListItem('dokumen', {
                        id: 'doc_' + Date.now(),
                        title: 'Dokumen Baru',
                        url: 'https://example.com/dokumen.pdf'
                      })}
                      className="mt-3 inline-flex items-center space-x-1.5 px-3 py-1.5 bg-brand-primary text-white text-xs font-semibold rounded-lg hover:bg-brand-primary/90 transition-all cursor-pointer"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Buat Dokumen Pertama</span>
                    </button>
                  </div>
                ) : (
                  (editedContent.dokumen || []).map((doc, idx) => (
                    <div key={doc.id} className="p-5 bg-white border border-slate-200/80 rounded-2xl flex flex-col md:flex-row gap-4 items-start md:items-center justify-between shadow-sm hover:border-slate-300 transition-all">
                      <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-xl bg-brand-primary/10 text-brand-primary font-bold text-sm">
                        {idx + 1}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-grow w-full">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Judul Dokumen</label>
                          <input
                            type="text"
                            value={doc.title}
                            onChange={e => updateListItem<Dokumen>('dokumen', doc.id, 'title', e.target.value)}
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 focus:border-brand-primary outline-none focus:ring-1 focus:ring-brand-primary rounded-xl font-bold text-slate-800"
                            placeholder="Contoh: Kalender Akademik 2026/2027"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">URL Dokumen / Link Download</label>
                          <input
                            type="text"
                            value={doc.url}
                            onChange={e => updateListItem<Dokumen>('dokumen', doc.id, 'url', e.target.value)}
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 focus:border-brand-primary outline-none focus:ring-1 focus:ring-brand-primary rounded-xl font-mono text-slate-600"
                            placeholder="Contoh: https://link-berkas.com/file.pdf"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end md:self-center">
                        <a 
                          href={doc.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="p-2 bg-slate-100 text-slate-600 hover:bg-brand-primary/10 hover:text-brand-primary rounded-xl transition-all"
                          title="Pratinjau Link"
                        >
                          <Eye className="h-4 w-4" />
                        </a>
                        <button
                          onClick={() => removeListItem('dokumen', doc.id)}
                          className="p-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                          title="Hapus Dokumen"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 13: Sagara */}
          {activeTab === 'sagara' && (
            <div className="space-y-6">
              <h3 className="font-display font-bold text-lg text-brand-navy">Sagara Redirect</h3>
              <div className="p-8 text-center bg-white rounded-3xl border border-slate-200">
                <p className="text-slate-600 mb-6">Klik tombol di bawah untuk membuka Sagara di tab baru.</p>
                <a
                  href="https://sagara.example.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-brand-primary text-white rounded-xl font-bold hover:bg-brand-primary/90 transition-all"
                >
                  <ExternalLink className="h-5 w-5" />
                  <span>Buka Sagara</span>
                </a>
              </div>
            </div>
          )}

          {/* TAB 12: Kontak */}
          {activeTab === 'kontak' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h3 className="font-display font-bold text-lg text-brand-navy">Pengaturan Kontak & Peta</h3>
                <p className="text-xs text-slate-500">Gunakan tab 'Profil Utama' untuk mengedit detail alamat dan maps secara terperinci.</p>
              </div>
              
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
                <div className="p-4 bg-brand-primary/10 rounded-full">
                  <HelpCircle className="h-10 w-10 text-brand-primary" />
                </div>
                <h4 className="font-bold text-slate-900">Seluruh Pengaturan Kontak</h4>
                <p className="text-xs text-slate-500 max-w-sm">
                  Untuk menjaga konsistensi data, seluruh pengaturan alamat, nomor telepon, email resmi, 
                  dan link Google Maps telah disatukan di dalam modul <strong>Profil Utama</strong>.
                </p>
                <button 
                  onClick={() => setActiveTab('profil')}
                  className="px-6 py-2.5 bg-brand-navy text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Buka Profil Utama Sekarang
                </button>
              </div>
            </div>
          )}

          {/* TAB: Perpustakaan */}
          {activeTab === 'perpustakaan' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-slate-200 pb-4">
                <h3 className="font-display font-bold text-lg text-brand-navy">Manajemen Perpustakaan "Widya Pustaka"</h3>
                <p className="text-xs text-slate-500">Kelola deskripsi, foto, statistik, fasilitas, dan program perpustakaan sekolah.</p>
              </div>

              {/* Deskripsi & Foto */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                <h4 className="font-display font-black text-slate-800 text-sm border-b border-slate-100 pb-2">Informasi Umum</h4>
                
                <div className="space-y-2">
                  <label className="text-[11px] text-slate-500 font-black uppercase tracking-wider block">Foto Perpustakaan (URL)</label>
                  <input
                    type="text"
                    value={editedContent.perpustakaan?.foto || ''}
                    onChange={e => updateServiceField('perpustakaan', 'foto', e.target.value)}
                    className="w-full px-4 py-3 text-xs font-mono bg-slate-50 border border-slate-200 text-slate-600 rounded-2xl focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all"
                    placeholder="https://images.unsplash.com/...foto_perpus.jpg"
                  />
                  {editedContent.perpustakaan?.foto && (
                    <img src={editedContent.perpustakaan.foto} className="w-48 aspect-video object-cover rounded-xl mt-2 border" />
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 font-bold uppercase tracking-wider ml-1">Deskripsi Perpustakaan</label>
                  <textarea
                    value={editedContent.perpustakaan?.deskripsi || ''}
                    onChange={e => updateServiceField('perpustakaan', 'deskripsi', e.target.value)}
                    className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-normal min-h-[120px] focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                    placeholder="Masukkan deskripsi perpustakaan..."
                  />
                </div>
              </div>

              {/* Statistik Perpustakaan */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                <h4 className="font-display font-black text-slate-800 text-sm border-b border-slate-100 pb-2">Statistik Angka Perpustakaan</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(editedContent.perpustakaan?.stats || []).map((stat, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Statistik {idx + 1}</label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={e => updateServiceStat('perpustakaan', idx, 'label', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-bold"
                        placeholder="Label (e.g., Total Koleksi Buku)"
                      />
                      <input
                        type="text"
                        value={stat.value}
                        onChange={e => updateServiceStat('perpustakaan', idx, 'value', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-brand-primary font-black"
                        placeholder="Value (e.g., 2.500+)"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Fasilitas Perpustakaan */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <h4 className="font-display font-black text-slate-800 text-sm">Fasilitas Perpustakaan</h4>
                  <button
                    onClick={() => addServiceListItem('perpustakaan', 'fasilitas', {
                      id: 'f_lib_' + Date.now(),
                      nama: 'Fasilitas Baru',
                      deskripsi: 'Deskripsi fasilitas perpustakaan...',
                      iconName: 'BookOpen'
                    })}
                    className="px-2.5 py-1 bg-brand-primary text-white text-[11px] font-bold rounded-lg flex items-center space-x-1"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Fasilitas Baru</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {(editedContent.perpustakaan?.fasilitas || []).map((item) => (
                    <div key={item.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row gap-3 items-start justify-between">
                      <div className="flex-grow space-y-2 w-full">
                        <input
                          type="text"
                          value={item.nama}
                          onChange={e => updateServiceListItem('perpustakaan', 'fasilitas', item.id, 'nama', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-bold"
                          placeholder="Nama Fasilitas"
                        />
                        <textarea
                          value={item.deskripsi}
                          onChange={e => updateServiceListItem('perpustakaan', 'fasilitas', item.id, 'deskripsi', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-600"
                          placeholder="Deskripsi"
                          rows={2}
                        />
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] text-slate-400 font-bold">Nama Icon (Lucide):</span>
                          <input
                            type="text"
                            value={item.iconName}
                            onChange={e => updateServiceListItem('perpustakaan', 'fasilitas', item.id, 'iconName', e.target.value)}
                            className="px-2 py-1 text-xs bg-white border border-slate-200 rounded-md font-mono w-32"
                            placeholder="Wind, Monitor, etc."
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => removeServiceListItem('perpustakaan', 'fasilitas', item.id)}
                        className="p-1.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all text-xs font-bold"
                      >
                        Hapus
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Program Perpustakaan */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <h4 className="font-display font-black text-slate-800 text-sm">Program Kegiatan Perpustakaan</h4>
                  <button
                    onClick={() => addServiceListItem('perpustakaan', 'program', {
                      id: 'p_lib_' + Date.now(),
                      nama: 'Program Baru',
                      deskripsi: 'Deskripsi program kegiatan...',
                      jadwal: 'Setiap Hari'
                    })}
                    className="px-2.5 py-1 bg-brand-orange text-white text-[11px] font-bold rounded-lg flex items-center space-x-1"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Program Baru</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {(editedContent.perpustakaan?.program || []).map((item) => (
                    <div key={item.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row gap-3 items-start justify-between">
                      <div className="flex-grow space-y-2 w-full">
                        <input
                          type="text"
                          value={item.nama}
                          onChange={e => updateServiceListItem('perpustakaan', 'program', item.id, 'nama', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-bold"
                          placeholder="Nama Program"
                        />
                        <textarea
                          value={item.deskripsi}
                          onChange={e => updateServiceListItem('perpustakaan', 'program', item.id, 'deskripsi', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-600"
                          placeholder="Deskripsi"
                          rows={2}
                        />
                        <input
                          type="text"
                          value={item.jadwal}
                          onChange={e => updateServiceListItem('perpustakaan', 'program', item.id, 'jadwal', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-brand-orange font-semibold"
                          placeholder="Jadwal Pelaksanaan"
                        />
                      </div>
                      <button
                        onClick={() => removeServiceListItem('perpustakaan', 'program', item.id)}
                        className="p-1.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all text-xs font-bold"
                      >
                        Hapus
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: UKS */}
          {activeTab === 'uks' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-slate-200 pb-4">
                <h3 className="font-display font-bold text-lg text-brand-navy">Manajemen Unit Kesehatan Sekolah (UKS)</h3>
                <p className="text-xs text-slate-500">Kelola deskripsi, foto, statistik, fasilitas, dan program kerja UKS sekolah.</p>
              </div>

              {/* Deskripsi & Foto */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                <h4 className="font-display font-black text-slate-800 text-sm border-b border-slate-100 pb-2">Informasi Umum</h4>
                
                <div className="space-y-2">
                  <label className="text-[11px] text-slate-500 font-black uppercase tracking-wider block">Foto UKS (URL)</label>
                  <input
                    type="text"
                    value={editedContent.uks?.foto || ''}
                    onChange={e => updateServiceField('uks', 'foto', e.target.value)}
                    className="w-full px-4 py-3 text-xs font-mono bg-slate-50 border border-slate-200 text-slate-600 rounded-2xl focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all"
                    placeholder="https://images.unsplash.com/...foto_uks.jpg"
                  />
                  {editedContent.uks?.foto && (
                    <img src={editedContent.uks.foto} className="w-48 aspect-video object-cover rounded-xl mt-2 border" />
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 font-bold uppercase tracking-wider ml-1">Deskripsi UKS</label>
                  <textarea
                    value={editedContent.uks?.deskripsi || ''}
                    onChange={e => updateServiceField('uks', 'deskripsi', e.target.value)}
                    className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-normal min-h-[120px] focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                    placeholder="Masukkan deskripsi UKS..."
                  />
                </div>
              </div>

              {/* Statistik UKS */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                <h4 className="font-display font-black text-slate-800 text-sm border-b border-slate-100 pb-2">Statistik Angka UKS</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(editedContent.uks?.stats || []).map((stat, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Statistik {idx + 1}</label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={e => updateServiceStat('uks', idx, 'label', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-bold"
                        placeholder="Label (e.g., Kader Dokter Kecil)"
                      />
                      <input
                        type="text"
                        value={stat.value}
                        onChange={e => updateServiceStat('uks', idx, 'value', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-brand-orange font-black"
                        placeholder="Value (e.g., 24 Siswa)"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Fasilitas UKS */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <h4 className="font-display font-black text-slate-800 text-sm">Fasilitas UKS</h4>
                  <button
                    onClick={() => addServiceListItem('uks', 'fasilitas', {
                      id: 'f_uks_' + Date.now(),
                      nama: 'Fasilitas Baru',
                      deskripsi: 'Deskripsi fasilitas UKS...',
                      iconName: 'Heart'
                    })}
                    className="px-2.5 py-1 bg-brand-primary text-white text-[11px] font-bold rounded-lg flex items-center space-x-1"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Fasilitas Baru</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {(editedContent.uks?.fasilitas || []).map((item) => (
                    <div key={item.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row gap-3 items-start justify-between">
                      <div className="flex-grow space-y-2 w-full">
                        <input
                          type="text"
                          value={item.nama}
                          onChange={e => updateServiceListItem('uks', 'fasilitas', item.id, 'nama', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-bold"
                          placeholder="Nama Fasilitas"
                        />
                        <textarea
                          value={item.deskripsi}
                          onChange={e => updateServiceListItem('uks', 'fasilitas', item.id, 'deskripsi', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-600"
                          placeholder="Deskripsi"
                          rows={2}
                        />
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] text-slate-400 font-bold">Nama Icon (Lucide):</span>
                          <input
                            type="text"
                            value={item.iconName}
                            onChange={e => updateServiceListItem('uks', 'fasilitas', item.id, 'iconName', e.target.value)}
                            className="px-2 py-1 text-xs bg-white border border-slate-200 rounded-md font-mono w-32"
                            placeholder="Heart, ShieldAlert, etc."
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => removeServiceListItem('uks', 'fasilitas', item.id)}
                        className="p-1.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all text-xs font-bold"
                      >
                        Hapus
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Program UKS */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <h4 className="font-display font-black text-slate-800 text-sm">Program Kerja UKS</h4>
                  <button
                    onClick={() => addServiceListItem('uks', 'program', {
                      id: 'p_uks_' + Date.now(),
                      nama: 'Program Baru',
                      deskripsi: 'Deskripsi program kerja uks...',
                      jadwal: 'Setiap Bulan'
                    })}
                    className="px-2.5 py-1 bg-brand-orange text-white text-[11px] font-bold rounded-lg flex items-center space-x-1"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Program Baru</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {(editedContent.uks?.program || []).map((item) => (
                    <div key={item.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row gap-3 items-start justify-between">
                      <div className="flex-grow space-y-2 w-full">
                        <input
                          type="text"
                          value={item.nama}
                          onChange={e => updateServiceListItem('uks', 'program', item.id, 'nama', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-bold"
                          placeholder="Nama Program"
                        />
                        <textarea
                          value={item.deskripsi}
                          onChange={e => updateServiceListItem('uks', 'program', item.id, 'deskripsi', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-600"
                          placeholder="Deskripsi"
                          rows={2}
                        />
                        <input
                          type="text"
                          value={item.jadwal}
                          onChange={e => updateServiceListItem('uks', 'program', item.id, 'jadwal', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-brand-orange font-semibold"
                          placeholder="Jadwal Pelaksanaan"
                        />
                      </div>
                      <button
                        onClick={() => removeServiceListItem('uks', 'program', item.id)}
                        className="p-1.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all text-xs font-bold"
                      >
                        Hapus
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6 text-center space-y-4">
            <div className="mx-auto h-14 w-14 bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center shadow-inner">
              <ShieldAlert className="h-7 w-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-display font-bold text-lg text-slate-850 dark:text-white">
                Sign Out dari CMS?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Apakah Anda yakin ingin keluar dari sistem manajemen sekolah (CMS)? Semua perubahan yang belum disimpan akan hilang.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-grow py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={async () => {
                  setShowLogoutModal(false);
                  try {
                    await logoutUser();
                    setToken(null);
                    showToast('Anda telah keluar dari sistem CMS.', 'info');
                    window.location.href = '/beranda';
                  } catch (err) {
                    console.error(err);
                  }
                }}
                className="flex-grow py-2.5 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-500/15 transition-all cursor-pointer"
              >
                Ya, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  </div>
);
}
