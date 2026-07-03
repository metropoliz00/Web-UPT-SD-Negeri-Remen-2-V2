import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCMS } from '../context/CMSContext';
import { 
  Save, RotateCcw, LogOut, CheckCircle, AlertTriangle, Eye, EyeOff, Edit3, Settings, Database
} from 'lucide-react';
import { isSupabaseConfigured } from '../supabase';

export default function AdminControlBar() {

  const navigate = useNavigate();
  const { 
    isLoggedIn, 
    editMode, 
    setEditMode, 
    saveChanges, 
    cancelChanges, 
    logOut, 
    isSaving, 
    hasChanges,
    setActiveSection
  } = useCMS();

  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Auto-reset logout confirmation and messages
  useEffect(() => {
    if (confirmSignOut) {
      const timer = setTimeout(() => setConfirmSignOut(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [confirmSignOut]);

  useEffect(() => {
    if (confirmCancel) {
      const timer = setTimeout(() => setConfirmCancel(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [confirmCancel]);

  useEffect(() => {
    if (saveMessage) {
      const timer = setTimeout(() => setSaveMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [saveMessage]);

  if (!isLoggedIn) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-14 bg-gradient-to-r from-brand-primary via-[#AFDDFF] to-brand-cream text-slate-900 z-[90] flex items-center justify-between px-4 sm:px-6 border-b border-brand-primary/30 shadow-lg font-sans text-xs">
      {/* Left: Indicator & Status */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
          </span>
          <span className="font-display font-black tracking-wider uppercase text-[10px] text-slate-800">
            Admin Panel
          </span>
        </div>
        
        <div className="hidden md:flex items-center space-x-2 bg-white/75 px-2.5 py-1 rounded-full border border-brand-primary/20 shadow-sm">
          <span className="text-[10px] text-slate-600 font-bold">Mode Edit:</span>
          <span className={`text-[10px] font-black uppercase ${editMode ? 'text-blue-600' : 'text-slate-500'}`}>
            {editMode ? 'AKTIF ✏️' : 'NON-AKTIF 🔒'}
          </span>
        </div>

        {/* Supabase Status Indicator */}
        <div 
          className={`hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-full border text-[10px] font-bold shadow-sm transition-all ${
            isSupabaseConfigured 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
              : 'bg-amber-50 text-amber-700 border-amber-200 cursor-help'
          }`}
          title={
            isSupabaseConfigured 
              ? 'Terhubung dengan database live Supabase Anda!' 
              : 'Menggunakan penyimpanan lokal sementara. Silakan atur VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di Secrets Anda untuk mengaktifkan database Supabase cloud.'
          }
        >
          <Database className={`h-3.5 w-3.5 ${isSupabaseConfigured ? 'text-emerald-600' : 'text-amber-600'}`} />
          <span className="relative flex h-1.5 w-1.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isSupabaseConfigured ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${isSupabaseConfigured ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
          </span>
          <span>{isSupabaseConfigured ? 'Database Terhubung' : 'Database Lokal'}</span>
        </div>
      </div>

      {/* Center: Quick Jump & Toggle */}
      <div className="flex items-center space-x-4">
        {/* Quick Jump Selector */}
        <div className="flex items-center space-x-1">
          <Settings className="h-3.5 w-3.5 text-slate-700" />
          <select 
            onChange={(e) => {
              if (e.target.value) {
                setActiveSection(e.target.value);
                e.target.value = ''; // Reset select after action
              }
            }}
            className="bg-white text-slate-800 border border-brand-primary/30 px-2.5 py-1 rounded-lg text-[11px] focus:outline-none focus:ring-1 focus:ring-brand-primary font-bold shadow-sm"
          >
            <option value="">-- Sunting Bagian --</option>
            <option value="hero">Banner Hero & Identitas</option>
            <option value="profil">Profil & Visi Misi</option>
            <option value="struktur">Struktur Organisasi</option>
            <option value="agenda">Agenda & Kegiatan Pekan Ini</option>
            <option value="keunggulan">Pilar Keunggulan</option>
            <option value="programs">Program Unggulan</option>
            <option value="prestasi">Prestasi</option>
            <option value="guru">GTK</option>
            <option value="galeri">Galeri Media</option>
            <option value="videos">Kanal Video Pembelajaran</option>
            <option value="sarana">Sarana & Prasarana</option>
            <option value="perpustakaan">Perpustakaan</option>
            <option value="uks">UKS</option>
            <option value="ekskul">Ekstrakurikuler</option>
            <option value="ppdb">Pendaftaran SPMB</option>
            <option value="faq">Kolom FAQ</option>
            <option value="berita">Berita Sekolah</option>
            <option value="testimoni">Testimoni</option>
            <option value="dokumen">Dokumentasi</option>
            <option value="contact">Kontak & Medsos</option>
          </select>
        </div>

        {/* Edit mode switcher */}
        <button
          onClick={() => setEditMode(!editMode)}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer shadow-sm border ${
            editMode 
              ? 'bg-brand-orange text-white border-transparent hover:bg-brand-orange/90' 
              : 'bg-white text-slate-700 hover:bg-slate-50 border-brand-primary/25'
          }`}
          title={editMode ? "Matikan overlay edit" : "Aktifkan overlay edit"}
        >
          {editMode ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
          <span className="hidden sm:inline text-[10px] uppercase">
            {editMode ? 'Pratinjau' : 'Mulai Edit'}
          </span>
        </button>
      </div>

      {/* Right: Actions (Save / Cancel / SignOut) */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Changes Indicator */}
        {hasChanges ? (
          <div className="hidden lg:flex items-center space-x-1 text-amber-800 font-bold bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300 text-[10px]">
            <AlertTriangle className="h-3 w-3 text-amber-600 animate-pulse" />
            <span>Belum disimpan</span>
          </div>
        ) : (
          <div className="hidden lg:flex items-center space-x-1 text-emerald-800 font-bold bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300 text-[10px]">
            <CheckCircle className="h-3 w-3 text-emerald-600" />
            <span>Tersimpan</span>
          </div>
        )}

        {/* Undo/Cancel */}
        {hasChanges && (
          <button
            onClick={() => {
              if (confirmCancel) {
                cancelChanges();
                setConfirmCancel(false);
              } else {
                setConfirmCancel(true);
              }
            }}
            className={`flex items-center space-x-1 px-2.5 py-1.5 border rounded-lg font-bold transition-all cursor-pointer shadow-sm ${
              confirmCancel 
                ? 'bg-amber-500 border-amber-500 text-white animate-pulse' 
                : 'bg-white border-slate-300 hover:bg-slate-100 text-slate-700'
            }`}
            title="Batalkan perubahan"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden md:inline text-[10px]">
              {confirmCancel ? 'Yakin Batal?' : 'Batal'}
            </span>
          </button>
        )}

        {/* Save All */}
        <div className="relative flex items-center">
          {saveMessage && (
            <div className={`absolute bottom-full mb-2 right-0 px-3 py-1.5 rounded-lg shadow-md text-[10px] font-bold whitespace-nowrap animate-bounce ${
              saveMessage.isError ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
            }`}>
              {saveMessage.text}
            </div>
          )}
          <button
            onClick={async () => {
              try {
                await saveChanges();
                setSaveMessage({ text: 'Sukses disimpan secara live! 🎉', isError: false });
              } catch (err: any) {
                setSaveMessage({ text: 'Gagal: ' + (err.message || err), isError: true });
              }
            }}
            disabled={!hasChanges || isSaving}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg font-bold transition-all shadow-md ${
              hasChanges 
                ? 'bg-emerald-500 text-white hover:bg-emerald-600 cursor-pointer shadow-emerald-500/20' 
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
            }`}
          >
            <Save className="h-3.5 w-3.5" />
            <span className="text-[10px] uppercase">
              {isSaving ? 'Menyimpan...' : 'Simpan'}
            </span>
          </button>
        </div>

        {/* Separator */}
        <div className="h-4 w-px bg-slate-300"></div>

        {/* Sign Out */}
        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center space-x-1 p-1.5 rounded-lg transition-all cursor-pointer border bg-red-100 hover:bg-red-200 text-red-700 border-red-200"
          title="Sign Out / Logout"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden md:inline text-[10px] font-bold ml-1">Sign Out</span>
        </button>
      </div>

      {/* Modern custom logout confirmation modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 p-6 text-center space-y-4 transform transition-all animate-scale-up">
            <div className="mx-auto h-14 w-14 bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center shadow-inner">
              <LogOut className="h-7 w-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-display font-bold text-lg text-slate-800 dark:text-white">
                Konfirmasi Sign Out
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Apakah Anda yakin ingin keluar dari mode Admin? Perubahan yang belum disimpan mungkin akan hilang.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-grow py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={async () => {
                  setShowLogoutModal(false);
                  await logOut();
                  window.location.href = '/beranda';
                }}
                className="flex-grow py-2.5 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-500/15 transition-all cursor-pointer"
              >
                Ya, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
