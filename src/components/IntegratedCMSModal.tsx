import React, { useState } from 'react';
import { useCMS } from '../context/CMSContext';
import { 
  X, Save, Trash, Plus, ImageIcon, Award, BookOpen, Users, HelpCircle, FileText, Settings, GraduationCap, ChevronRight, LayoutGrid, Share2, Play, MonitorPlay
} from 'lucide-react';
import { KeunggulanItem, ProgramItem, PrestasiItem, GuruItem, GaleriItem, EkstrakurikulerItem, FAQItem, BeritaItem, TestimoniItem, SchoolContent } from '../types';

export default function IntegratedCMSModal() {
  const { 
    activeSection, 
    setActiveSection, 
    content, 
    updateContentField, 
    updateContentListItem, 
    deleteContentListItem, 
    addContentListItem,
    saveChanges,
    isSaving
  } = useCMS();

  const [errorText, setErrorText] = useState<string | null>(null);
  const [editStructSubTab, setEditStructSubTab] = useState<'sekolah' | 'komite'>('sekolah');
  const [structViewMode, setStructViewMode] = useState<'daftar' | 'visual'>('daftar');

  if (!activeSection) return null;

  // Rich Text Editor component
  const RichTextEditor = ({ label, value, onChange, placeholder }: { label: string, value: string, onChange: (val: string) => void, placeholder?: string }) => (
    <div className="space-y-1.5">
      <label className="text-xs text-slate-500 font-bold uppercase tracking-wider block">{label}</label>
      <textarea
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-3 text-sm bg-white border border-slate-200 rounded-xl text-slate-700 font-normal min-h-[140px] focus:ring-2 focus:ring-brand-primary outline-none transition-all shadow-sm"
        placeholder={placeholder}
      />
      <p className="text-[10px] text-slate-400 italic">Mendukung tag HTML dasar: &lt;b&gt;, &lt;i&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;br&gt;</p>
    </div>
  );

  const getSectionTitle = () => {
    switch(activeSection) {
      case 'hero': return 'Edit Banner Hero & Identitas';
      case 'agenda': return 'Edit Agenda & Kegiatan Pekan Ini';
      case 'profil': return 'Edit Profil & Visi Misi';
      case 'perpustakaan': return 'Kelola Perpustakaan Sekolah';
      case 'uks': return 'Kelola UKS (Unit Kesehatan Sekolah)';
      case 'struktur': return 'Kelola Struktur Organisasi';
      case 'keunggulan': return 'Edit 6 Keunggulan Sekolah';
      case 'programs': return 'Kelola Program Unggulan';
      case 'prestasi': return 'Kelola Prestasi';
      case 'guru': return 'Kelola Dewan Guru';
      case 'galeri': return 'Kelola Galeri Media';
      case 'ekskul': return 'Kelola Ekstrakurikuler';
      case 'sarana': return 'Kelola Sarana & Prasarana';
      case 'ppdb': return 'Kelola Pendaftaran SPMB';
      case 'faq': return 'Kelola Kolom FAQ';
      case 'berita': return 'Kelola Berita Sekolah';
      case 'testimoni': return 'Kelola Testimoni';
      case 'contact': return 'Edit Informasi Kontak & Medsos';
      case 'dokumen': return 'Kelola Dokumen';
      default: return 'Pengaturan Konten';
    }
  };

  const handleClose = () => {
    setActiveSection(null);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[100] flex justify-end animate-fade-in font-sans">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-slide-left overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-brand-primary via-[#AFDDFF] to-brand-cream text-slate-900 flex items-center justify-between shadow-md border-b border-brand-primary/20">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/60 rounded-xl text-blue-600 shadow-sm">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display font-black text-base sm:text-lg leading-tight text-slate-900">{getSectionTitle()}</h3>
              <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Visual Editor Mode</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 bg-white/50 hover:bg-white/80 text-slate-800 rounded-xl transition-all cursor-pointer shadow-sm border border-brand-primary/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-grow p-6 overflow-y-auto space-y-6 bg-slate-50/50">
          
          {/* SECTION: SARANA */}
          {activeSection === 'sarana' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs text-slate-600 font-bold">Total Sarana: {content.sarana ? content.sarana.length : 0}</span>
                <button
                  onClick={() => addContentListItem('sarana', {
                    id: 'sarana_' + Date.now(),
                    name: 'Sarana Baru',
                    description: 'Penjelasan sarana...',
                    imageUrl: '#'
                  })}
                  className="px-3 py-1.5 bg-brand-primary text-white text-xs font-bold rounded-lg hover:bg-brand-primary/90 flex items-center space-x-1 cursor-pointer transition-all shadow-sm shadow-brand-primary/15"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Tambah Sarana</span>
                </button>
              </div>

              <div className="space-y-4">
                {content.sarana && content.sarana.map((item) => (
                  <div key={item.id} className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4 relative group">
                    <button
                      onClick={() => deleteContentListItem('sarana', item.id)}
                      className="absolute top-4 right-4 p-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                      title="Hapus sarana"
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </button>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Nama Sarana</label>
                      <input
                        type="text"
                        value={item.name || ''}
                        onChange={e => updateContentListItem('sarana', item.id, 'name', e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 text-slate-800 rounded-lg focus:ring-1 focus:ring-brand-primary outline-none transition-all font-bold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Deskripsi</label>
                      <textarea
                        value={item.description || ''}
                        onChange={e => updateContentListItem('sarana', item.id, 'description', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 text-slate-600 rounded-lg focus:ring-1 focus:ring-brand-primary outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">URL Foto</label>
                      <input
                        type="text"
                        value={item.imageUrl || ''}
                        onChange={e => updateContentListItem('sarana', item.id, 'imageUrl', e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 text-slate-600 rounded-lg focus:ring-1 focus:ring-brand-primary outline-none transition-all"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: DOKUMEN */}
          {activeSection === 'dokumen' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs text-slate-600 font-bold">Total Dokumen: {content.dokumen ? content.dokumen.length : 0}</span>
                <button
                  onClick={() => addContentListItem('dokumen', {
                    id: 'doc_' + Date.now(),
                    title: 'Dokumen Baru',
                    url: '#'
                  })}
                  className="px-3 py-1.5 bg-brand-primary text-white text-xs font-bold rounded-lg hover:bg-brand-primary/90 flex items-center space-x-1 cursor-pointer transition-all shadow-sm shadow-brand-primary/15"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Tambah Dokumen</span>
                </button>
              </div>

              <div className="space-y-4">
                {content.dokumen && content.dokumen.map((item) => (
                  <div key={item.id} className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4 relative group">
                    <button
                      onClick={() => deleteContentListItem('dokumen', item.id)}
                      className="absolute top-4 right-4 p-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                      title="Hapus dokumen"
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </button>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Judul Dokumen</label>
                      <input
                        type="text"
                        value={item.title || ''}
                        onChange={e => updateContentListItem('dokumen', item.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 text-slate-800 rounded-lg focus:ring-1 focus:ring-brand-primary outline-none transition-all font-bold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">URL Dokumen</label>
                      <input
                        type="text"
                        value={item.url || ''}
                        onChange={e => updateContentListItem('dokumen', item.id, 'url', e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 text-slate-600 rounded-lg focus:ring-1 focus:ring-brand-primary outline-none transition-all"
                        placeholder="Contoh: https://drive.google.com/..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 1: HERO */}
          {activeSection === 'hero' && (
            <div className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 font-bold block">Visi Utama (Headline Hero)</label>
                <textarea
                  value={content.visionStatement || ''}
                  onChange={e => updateContentField('visionStatement', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 text-sm bg-white border border-slate-200 text-slate-800 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all shadow-sm font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 font-bold block">Motto RAMAH (Slogan)</label>
                <input
                  type="text"
                  value={content.motto || ''}
                  onChange={e => updateContentField('motto', e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-white border border-slate-200 text-brand-primary rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all shadow-sm font-black"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 font-bold block">Judul Sekunder Hero</label>
                <input
                  type="text"
                  value={content.heroTitle || ''}
                  onChange={e => updateContentField('heroTitle', e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-white border border-slate-200 text-slate-800 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 font-bold block">Sub-tagline Hero</label>
                <textarea
                  value={content.heroSubtitle || ''}
                  onChange={e => updateContentField('heroSubtitle', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 text-sm bg-white border border-slate-200 text-slate-600 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 font-bold block">Running Text (Marquee Pengumuman)</label>
                <textarea
                  value={content.runningText || ''}
                  onChange={e => updateContentField('runningText', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 text-sm bg-white border border-slate-200 text-slate-800 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all shadow-sm"
                />
              </div>

              {/* TTS Toggle */}
              <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Fitur Aksesibilitas (Text-to-Speech)</h4>
                  <p className="text-[10px] text-slate-500">Aktifkan fitur pembaca teks otomatis saat mouse diarahkan ke elemen.</p>
                </div>
                <button
                  onClick={() => updateContentField('isTextToSpeechEnabled', !content.isTextToSpeechEnabled)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${content.isTextToSpeechEnabled ? 'bg-brand-primary' : 'bg-slate-300'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${content.isTextToSpeechEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 font-bold block">Logo Sekolah URL</label>
                <input
                  type="text"
                  value={content.logoUrl || ''}
                  onChange={e => updateContentField('logoUrl', e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-white border border-slate-200 text-slate-800 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all shadow-sm"
                />
              </div>

              {/* Carousel Image Slider Editor */}
              <div className="border-t border-slate-200 pt-5 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Carousel Foto Utama (Slider Beranda)</h4>
                    <p className="text-[10px] text-slate-400">Daftar foto yang akan bergantian tampil di latar belakang header utama.</p>
                  </div>
                  <button
                    onClick={() => {
                      const newCarousel = [...(content.heroCarousel || [])];
                      newCarousel.push("https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200");
                      updateContentField('heroCarousel', newCarousel);
                    }}
                    className="px-3 py-1.5 bg-brand-primary text-white text-xs font-bold rounded-lg hover:bg-brand-primary/90 flex items-center space-x-1 cursor-pointer transition-all shadow-sm shadow-brand-primary/15"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Tambah Foto</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {(content.heroCarousel || []).map((url, idx) => (
                    <div key={idx} className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row gap-4 items-start relative group">
                      <button
                        onClick={() => {
                          const newCarousel = (content.heroCarousel || []).filter((_, i) => i !== idx);
                          updateContentField('heroCarousel', newCarousel);
                        }}
                        className="absolute top-4 right-4 p-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                        title="Hapus foto ini"
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </button>

                      <div className="w-full sm:w-32 h-20 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center border border-slate-200 shrink-0">
                        {url ? (
                          <img 
                            src={url} 
                            alt={`Slide ${idx + 1}`} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200";
                            }}
                          />
                        ) : (
                          <ImageIcon className="h-6 w-6 text-slate-400" />
                        )}
                      </div>

                      <div className="flex-grow w-full space-y-1.5 pr-8">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block font-bold">URL Foto Slide {idx + 1}</label>
                        <input
                          type="text"
                          value={url}
                          onChange={e => {
                            const newCarousel = [...(content.heroCarousel || [])];
                            newCarousel[idx] = e.target.value;
                            updateContentField('heroCarousel', newCarousel);
                          }}
                          placeholder="Masukkan URL foto dari Unsplash, ImgBB, dsb."
                          className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 text-slate-800 rounded-lg focus:ring-1 focus:ring-brand-primary outline-none transition-all"
                        />
                      </div>
                    </div>
                  ))}

                  {(!content.heroCarousel || content.heroCarousel.length === 0) && (
                    <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                      <ImageIcon className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-xs text-slate-500 font-medium">Belum ada foto carousel. Silakan klik "Tambah Foto".</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats Item Editing */}
              <div className="border-t border-slate-200 pt-5 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Statistik Angka Beranda</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {content.stats.map((stat) => (
                    <div key={stat.id} className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2">
                      <input
                        type="text"
                        value={stat.label || ''}
                        onChange={e => updateContentListItem('stats', stat.id, 'label', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold"
                        placeholder="Label"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          value={stat.value}
                          onChange={e => updateContentListItem('stats', stat.id, 'value', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-black text-brand-primary"
                          placeholder="Value"
                        />
                        <input
                          type="text"
                          value={stat.suffix || ''}
                          onChange={e => updateContentListItem('stats', stat.id, 'suffix', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                          placeholder="Suffix (e.g. +)"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION: AGENDA */}
          {activeSection === 'agenda' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs text-slate-600 font-bold">Total Agenda: {content.agenda ? content.agenda.length : 0}</span>
                <button
                  onClick={() => addContentListItem('agenda', {
                    id: 'agenda_' + Date.now(),
                    date: new Date().toISOString().split('T')[0],
                    title: 'Agenda Baru',
                    description: 'Penjelasan agenda baru...',
                    color: 'primary'
                  })}
                  className="px-3 py-1.5 bg-brand-primary text-white text-xs font-bold rounded-lg hover:bg-brand-primary/90 flex items-center space-x-1 cursor-pointer transition-all shadow-sm shadow-brand-primary/15"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Tambah Agenda</span>
                </button>
              </div>

              <div className="space-y-4">
                {content.agenda && content.agenda.map((item) => (
                  <div key={item.id} className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4 relative group">
                    <button
                      onClick={() => deleteContentListItem('agenda', item.id)}
                      className="absolute top-4 right-4 p-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                      title="Hapus agenda"
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Tanggal Agenda</label>
                        <input
                          type="date"
                          value={item.date || ''}
                          onChange={e => updateContentListItem('agenda', item.id, 'date', e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded-lg focus:ring-1 focus:ring-brand-primary outline-none transition-all font-bold"
                        />
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Warna Badge</label>
                        <select
                          value={item.color || 'primary'}
                          onChange={e => updateContentListItem('agenda', item.id, 'color', e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded-lg focus:ring-1 focus:ring-brand-primary outline-none transition-all font-bold"
                        >
                          <option value="primary">Indigo/Biru (Utama)</option>
                          <option value="orange">Oranye (Penting)</option>
                          <option value="light">Biru Muda (Kasual)</option>
                          <option value="green">Hijau (Sukses/Selesai)</option>
                          <option value="purple">Ungu (Spesial/Akademik)</option>
                          <option value="rose">Merah Muda (Perayaan/Event)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Nama Agenda / Kegiatan</label>
                      <input
                        type="text"
                        value={item.title || ''}
                        onChange={e => updateContentListItem('agenda', item.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 text-slate-800 rounded-lg focus:ring-1 focus:ring-brand-primary outline-none transition-all font-bold"
                        placeholder="Contoh: Pembagian Rapor Semester"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Deskripsi Singkat</label>
                      <textarea
                        value={item.description || ''}
                        onChange={e => updateContentListItem('agenda', item.id, 'description', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 text-slate-600 rounded-lg focus:ring-1 focus:ring-brand-primary outline-none transition-all"
                        placeholder="Keterangan waktu, tempat, atau detail kegiatan..."
                      />
                    </div>
                  </div>
                ))}

                {(!content.agenda || content.agenda.length === 0) && (
                  <p className="text-center py-8 text-xs text-slate-400 italic bg-white border border-dashed border-slate-200 rounded-xl">Belum ada agenda pekan ini. Silakan klik "Tambah Agenda" di atas.</p>
                )}
              </div>
            </div>
          )}

          {/* SECTION 2: PROFIL */}
          {activeSection === 'profil' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 font-bold block">Nama Lembaga Sekolah</label>
                  <input
                    type="text"
                    value={content.schoolName || ''}
                    onChange={e => updateContentField('schoolName', e.target.value)}
                    className="w-full px-4 py-3 text-sm bg-white border border-slate-200 text-slate-800 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all shadow-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 font-bold block">NPSN Resmi</label>
                  <input
                    type="text"
                    value={content.npsn || ''}
                    onChange={e => updateContentField('npsn', e.target.value)}
                    className="w-full px-4 py-3 text-sm bg-white border border-slate-200 text-slate-800 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 font-bold block">Nama Kepala UPT SD Negeri Remen 2</label>
                  <input
                    type="text"
                    value={content.headmasterName || ''}
                    onChange={e => updateContentField('headmasterName', e.target.value)}
                    className="w-full px-4 py-3 text-sm bg-white border border-slate-200 text-slate-800 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all shadow-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 font-bold block">Jabatan/Gelar</label>
                  <input
                    type="text"
                    value={content.headmasterTitle || ''}
                    onChange={e => updateContentField('headmasterTitle', e.target.value)}
                    className="w-full px-4 py-3 text-sm bg-white border border-slate-200 text-slate-800 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 font-bold block">Foto Kepala UPT SD Negeri Remen 2 URL</label>
                <input
                  type="text"
                  value={content.headmasterPhoto || ''}
                  onChange={e => updateContentField('headmasterPhoto', e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-white border border-slate-200 text-slate-800 rounded-xl"
                />
              </div>

              <RichTextEditor 
                label="Sambutan Kepala UPT SD Negeri Remen 2"
                value={content.headmasterSpeech}
                onChange={val => updateContentField('headmasterSpeech', val)}
              />

              <div className="border-t border-slate-200 pt-5 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Visi & Misi & Tujuan</h4>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-500 font-bold block">Visi</label>
                    <textarea
                      value={content.visi || ''}
                      onChange={e => updateContentField('visi', e.target.value)}
                      rows={2}
                      className="w-full px-4 py-3 text-sm bg-white border border-slate-200 text-slate-800 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all shadow-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-500 font-bold block">Misi (Pisahkan tiap baris)</label>
                    <textarea
                      value={content.misi || ''}
                      onChange={e => updateContentField('misi', e.target.value)}
                      rows={5}
                      className="w-full px-4 py-3 text-sm bg-white border border-slate-200 text-slate-800 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all shadow-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-500 font-bold block">Tujuan (Pisahkan tiap baris)</label>
                    <textarea
                      value={content.tujuan || ''}
                      onChange={e => updateContentField('tujuan', e.target.value)}
                      rows={5}
                      className="w-full px-4 py-3 text-sm bg-white border border-slate-200 text-slate-800 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: PERPUSTAKAAN */}
          {activeSection === 'perpustakaan' && (
            <div className="space-y-6 font-sans text-left">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 font-bold block">Deskripsi Perpustakaan</label>
                <textarea
                  value={content.perpustakaan?.deskripsi || ''}
                  onChange={e => updateContentField('perpustakaan', { ...content.perpustakaan, deskripsi: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 text-sm bg-white border border-slate-200 text-slate-800 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 font-bold block">Foto Perpustakaan URL</label>
                <input
                  type="text"
                  value={content.perpustakaan?.foto || ''}
                  onChange={e => updateContentField('perpustakaan', { ...content.perpustakaan, foto: e.target.value })}
                  className="w-full px-4 py-3 text-sm bg-white border border-slate-200 text-slate-800 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none"
                />
              </div>

              {/* Stats */}
              <div className="border-t border-slate-200 pt-5 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Statistik Perpustakaan</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(content.perpustakaan?.stats || []).map((stat, idx) => (
                    <div key={idx} className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2">
                      <input
                        type="text"
                        value={stat.label || ''}
                        onChange={e => {
                          const newStats = [...(content.perpustakaan?.stats || [])];
                          newStats[idx] = { ...newStats[idx], label: e.target.value };
                          updateContentField('perpustakaan', { ...content.perpustakaan, stats: newStats });
                        }}
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold"
                        placeholder="Label"
                      />
                      <input
                        type="text"
                        value={stat.value || ''}
                        onChange={e => {
                          const newStats = [...(content.perpustakaan?.stats || [])];
                          newStats[idx] = { ...newStats[idx], value: e.target.value };
                          updateContentField('perpustakaan', { ...content.perpustakaan, stats: newStats });
                        }}
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-black text-brand-primary"
                        placeholder="Value (e.g. 2.500+)"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Fasilitas */}
              <div className="border-t border-slate-200 pt-5 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Fasilitas Perpustakaan</h4>
                  <button
                    onClick={() => {
                      const newFas = [...(content.perpustakaan?.fasilitas || [])];
                      newFas.push({ id: 'f_lib_' + Date.now(), nama: 'Fasilitas Baru', deskripsi: 'Penjelasan...', iconName: 'Wind' });
                      updateContentField('perpustakaan', { ...content.perpustakaan, fasilitas: newFas });
                    }}
                    className="px-2.5 py-1 bg-brand-primary/10 text-brand-primary rounded-lg text-[10px] font-black uppercase flex items-center space-x-1"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Tambah Fasilitas</span>
                  </button>
                </div>
                <div className="space-y-4">
                  {(content.perpustakaan?.fasilitas || []).map((f, idx) => (
                    <div key={f.id} className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 relative">
                      <button
                        onClick={() => {
                          const newFas = (content.perpustakaan?.fasilitas || []).filter(item => item.id !== f.id);
                          updateContentField('perpustakaan', { ...content.perpustakaan, fasilitas: newFas });
                        }}
                        className="absolute top-4 right-4 p-1 bg-red-50 text-red-500 rounded hover:bg-red-100"
                      >
                        <Trash className="h-3 w-3" />
                      </button>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 block font-bold">Nama Fasilitas</label>
                          <input
                            type="text"
                            value={f.nama || ''}
                            onChange={e => {
                              const newFas = [...(content.perpustakaan?.fasilitas || [])];
                              newFas[idx] = { ...newFas[idx], nama: e.target.value };
                              updateContentField('perpustakaan', { ...content.perpustakaan, fasilitas: newFas });
                            }}
                            className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 block font-bold">Icon Lucide (e.g. Wind, Monitor)</label>
                          <input
                            type="text"
                            value={f.iconName || ''}
                            onChange={e => {
                              const newFas = [...(content.perpustakaan?.fasilitas || [])];
                              newFas[idx] = { ...newFas[idx], iconName: e.target.value };
                              updateContentField('perpustakaan', { ...content.perpustakaan, fasilitas: newFas });
                            }}
                            className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 block font-bold">Deskripsi</label>
                        <textarea
                          value={f.deskripsi || ''}
                          onChange={e => {
                            const newFas = [...(content.perpustakaan?.fasilitas || [])];
                            newFas[idx] = { ...newFas[idx], deskripsi: e.target.value };
                            updateContentField('perpustakaan', { ...content.perpustakaan, fasilitas: newFas });
                          }}
                          rows={2}
                          className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-600"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Program Kerja */}
              <div className="border-t border-slate-200 pt-5 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Program Kerja & Kegiatan</h4>
                  <button
                    onClick={() => {
                      const newProg = [...(content.perpustakaan?.program || [])];
                      newProg.push({ id: 'p_lib_' + Date.now(), nama: 'Program Baru', deskripsi: 'Penjelasan...', jadwal: 'Hari/Jadwal' });
                      updateContentField('perpustakaan', { ...content.perpustakaan, program: newProg });
                    }}
                    className="px-2.5 py-1 bg-brand-primary/10 text-brand-primary rounded-lg text-[10px] font-black uppercase flex items-center space-x-1"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Tambah Program</span>
                  </button>
                </div>
                <div className="space-y-4">
                  {(content.perpustakaan?.program || []).map((p, idx) => (
                    <div key={p.id} className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 relative">
                      <button
                        onClick={() => {
                          const newProg = (content.perpustakaan?.program || []).filter(item => item.id !== p.id);
                          updateContentField('perpustakaan', { ...content.perpustakaan, program: newProg });
                        }}
                        className="absolute top-4 right-4 p-1 bg-red-50 text-red-500 rounded hover:bg-red-100"
                      >
                        <Trash className="h-3 w-3" />
                      </button>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 block font-bold">Nama Program</label>
                          <input
                            type="text"
                            value={p.nama || ''}
                            onChange={e => {
                              const newProg = [...(content.perpustakaan?.program || [])];
                              newProg[idx] = { ...newProg[idx], nama: e.target.value };
                              updateContentField('perpustakaan', { ...content.perpustakaan, program: newProg });
                            }}
                            className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 block font-bold">Jadwal/Waktu</label>
                          <input
                            type="text"
                            value={p.jadwal || ''}
                            onChange={e => {
                              const newProg = [...(content.perpustakaan?.program || [])];
                              newProg[idx] = { ...newProg[idx], jadwal: e.target.value };
                              updateContentField('perpustakaan', { ...content.perpustakaan, program: newProg });
                            }}
                            className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 block font-bold">Deskripsi Kegiatan</label>
                        <textarea
                          value={p.deskripsi || ''}
                          onChange={e => {
                            const newProg = [...(content.perpustakaan?.program || [])];
                            newProg[idx] = { ...newProg[idx], deskripsi: e.target.value };
                            updateContentField('perpustakaan', { ...content.perpustakaan, program: newProg });
                          }}
                          rows={2}
                          className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-600"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dokumen Perpustakaan */}
              <div className="border-t border-slate-200 pt-5 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Dokumen Perpustakaan</h4>
                  <button
                    onClick={() => {
                      const newDocs = [...(content.perpustakaan?.dokumen || [])];
                      newDocs.push({ id: 'doc_lib_' + Date.now(), title: 'Dokumen Baru', url: '#' });
                      updateContentField('perpustakaan', { ...content.perpustakaan, dokumen: newDocs });
                    }}
                    className="px-2.5 py-1 bg-brand-primary/10 text-brand-primary rounded-lg text-[10px] font-black uppercase flex items-center space-x-1 cursor-pointer hover:bg-brand-primary/20 transition-all"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Tambah Dokumen</span>
                  </button>
                </div>
                <div className="space-y-4">
                  {(content.perpustakaan?.dokumen || []).map((doc, idx) => (
                    <div key={doc.id} className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 relative">
                      <button
                        onClick={() => {
                          const newDocs = (content.perpustakaan?.dokumen || []).filter(item => item.id !== doc.id);
                          updateContentField('perpustakaan', { ...content.perpustakaan, dokumen: newDocs });
                        }}
                        className="absolute top-4 right-4 p-1 bg-red-50 text-red-500 rounded hover:bg-red-100 cursor-pointer"
                        title="Hapus dokumen"
                      >
                        <Trash className="h-3 w-3" />
                      </button>
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-400 block font-bold">Judul Dokumen</label>
                        <input
                          type="text"
                          value={doc.title || ''}
                          onChange={e => {
                            const newDocs = [...(content.perpustakaan?.dokumen || [])];
                            newDocs[idx] = { ...newDocs[idx], title: e.target.value };
                            updateContentField('perpustakaan', { ...content.perpustakaan, dokumen: newDocs });
                          }}
                          className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800 focus:ring-1 focus:ring-brand-primary outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-400 block font-bold">URL Dokumen</label>
                        <input
                          type="text"
                          value={doc.url || ''}
                          onChange={e => {
                            const newDocs = [...(content.perpustakaan?.dokumen || [])];
                            newDocs[idx] = { ...newDocs[idx], url: e.target.value };
                            updateContentField('perpustakaan', { ...content.perpustakaan, dokumen: newDocs });
                          }}
                          className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-600 focus:ring-1 focus:ring-brand-primary outline-none"
                          placeholder="Contoh: https://drive.google.com/..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION: UKS */}
          {activeSection === 'uks' && (
            <div className="space-y-6 font-sans text-left">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 font-bold block">Deskripsi UKS</label>
                <textarea
                  value={content.uks?.deskripsi || ''}
                  onChange={e => updateContentField('uks', { ...content.uks, deskripsi: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 text-sm bg-white border border-slate-200 text-slate-800 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 font-bold block">Foto UKS URL</label>
                <input
                  type="text"
                  value={content.uks?.foto || ''}
                  onChange={e => updateContentField('uks', { ...content.uks, foto: e.target.value })}
                  className="w-full px-4 py-3 text-sm bg-white border border-slate-200 text-slate-800 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none"
                />
              </div>

              {/* Stats */}
              <div className="border-t border-slate-200 pt-5 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Statistik UKS</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(content.uks?.stats || []).map((stat, idx) => (
                    <div key={idx} className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2">
                      <input
                        type="text"
                        value={stat.label || ''}
                        onChange={e => {
                          const newStats = [...(content.uks?.stats || [])];
                          newStats[idx] = { ...newStats[idx], label: e.target.value };
                          updateContentField('uks', { ...content.uks, stats: newStats });
                        }}
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold"
                        placeholder="Label"
                      />
                      <input
                        type="text"
                        value={stat.value || ''}
                        onChange={e => {
                          const newStats = [...(content.uks?.stats || [])];
                          newStats[idx] = { ...newStats[idx], value: e.target.value };
                          updateContentField('uks', { ...content.uks, stats: newStats });
                        }}
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-black text-brand-orange"
                        placeholder="Value (e.g. 24 Siswa)"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Fasilitas */}
              <div className="border-t border-slate-200 pt-5 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Fasilitas UKS</h4>
                  <button
                    onClick={() => {
                      const newFas = [...(content.uks?.fasilitas || [])];
                      newFas.push({ id: 'f_uks_' + Date.now(), nama: 'Fasilitas Baru', deskripsi: 'Penjelasan...', iconName: 'Bed' });
                      updateContentField('uks', { ...content.uks, fasilitas: newFas });
                    }}
                    className="px-2.5 py-1 bg-brand-orange/10 text-brand-orange rounded-lg text-[10px] font-black uppercase flex items-center space-x-1"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Tambah Fasilitas</span>
                  </button>
                </div>
                <div className="space-y-4">
                  {(content.uks?.fasilitas || []).map((f, idx) => (
                    <div key={f.id} className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 relative">
                      <button
                        onClick={() => {
                          const newFas = (content.uks?.fasilitas || []).filter(item => item.id !== f.id);
                          updateContentField('uks', { ...content.uks, fasilitas: newFas });
                        }}
                        className="absolute top-4 right-4 p-1 bg-red-50 text-red-500 rounded hover:bg-red-100"
                      >
                        <Trash className="h-3 w-3" />
                      </button>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 block font-bold">Nama Fasilitas</label>
                          <input
                            type="text"
                            value={f.nama || ''}
                            onChange={e => {
                              const newFas = [...(content.uks?.fasilitas || [])];
                              newFas[idx] = { ...newFas[idx], nama: e.target.value };
                              updateContentField('uks', { ...content.uks, fasilitas: newFas });
                            }}
                            className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 block font-bold">Icon Lucide (e.g. Bed, Activity)</label>
                          <input
                            type="text"
                            value={f.iconName || ''}
                            onChange={e => {
                              const newFas = [...(content.uks?.fasilitas || [])];
                              newFas[idx] = { ...newFas[idx], iconName: e.target.value };
                              updateContentField('uks', { ...content.uks, fasilitas: newFas });
                            }}
                            className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 block font-bold">Deskripsi</label>
                        <textarea
                          value={f.deskripsi || ''}
                          onChange={e => {
                            const newFas = [...(content.uks?.fasilitas || [])];
                            newFas[idx] = { ...newFas[idx], deskripsi: e.target.value };
                            updateContentField('uks', { ...content.uks, fasilitas: newFas });
                          }}
                          rows={2}
                          className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-600"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Program Kerja */}
              <div className="border-t border-slate-200 pt-5 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Program Kerja & Kegiatan</h4>
                  <button
                    onClick={() => {
                      const newProg = [...(content.uks?.program || [])];
                      newProg.push({ id: 'p_uks_' + Date.now(), nama: 'Program Baru', deskripsi: 'Penjelasan...', jadwal: 'Hari/Jadwal' });
                      updateContentField('uks', { ...content.uks, program: newProg });
                    }}
                    className="px-2.5 py-1 bg-brand-orange/10 text-brand-orange rounded-lg text-[10px] font-black uppercase flex items-center space-x-1"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Tambah Program</span>
                  </button>
                </div>
                <div className="space-y-4">
                  {(content.uks?.program || []).map((p, idx) => (
                    <div key={p.id} className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 relative">
                      <button
                        onClick={() => {
                          const newProg = (content.uks?.program || []).filter(item => item.id !== p.id);
                          updateContentField('uks', { ...content.uks, program: newProg });
                        }}
                        className="absolute top-4 right-4 p-1 bg-red-50 text-red-500 rounded hover:bg-red-100"
                      >
                        <Trash className="h-3 w-3" />
                      </button>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 block font-bold">Nama Program</label>
                          <input
                            type="text"
                            value={p.nama || ''}
                            onChange={e => {
                              const newProg = [...(content.uks?.program || [])];
                              newProg[idx] = { ...newProg[idx], nama: e.target.value };
                              updateContentField('uks', { ...content.uks, program: newProg });
                            }}
                            className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 block font-bold">Jadwal/Waktu</label>
                          <input
                            type="text"
                            value={p.jadwal || ''}
                            onChange={e => {
                              const newProg = [...(content.uks?.program || [])];
                              newProg[idx] = { ...newProg[idx], jadwal: e.target.value };
                              updateContentField('uks', { ...content.uks, program: newProg });
                            }}
                            className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 block font-bold">Deskripsi Kegiatan</label>
                        <textarea
                          value={p.deskripsi || ''}
                          onChange={e => {
                            const newProg = [...(content.uks?.program || [])];
                            newProg[idx] = { ...newProg[idx], deskripsi: e.target.value };
                            updateContentField('uks', { ...content.uks, program: newProg });
                          }}
                          rows={2}
                          className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-600"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dokumen UKS */}
              <div className="border-t border-slate-200 pt-5 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Dokumen UKS</h4>
                  <button
                    onClick={() => {
                      const newDocs = [...(content.uks?.dokumen || [])];
                      newDocs.push({ id: 'doc_uks_' + Date.now(), title: 'Dokumen Baru', url: '#' });
                      updateContentField('uks', { ...content.uks, dokumen: newDocs });
                    }}
                    className="px-2.5 py-1 bg-brand-orange/10 text-brand-orange rounded-lg text-[10px] font-black uppercase flex items-center space-x-1 cursor-pointer hover:bg-brand-orange/20 transition-all"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Tambah Dokumen</span>
                  </button>
                </div>
                <div className="space-y-4">
                  {(content.uks?.dokumen || []).map((doc, idx) => (
                    <div key={doc.id} className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 relative">
                      <button
                        onClick={() => {
                          const newDocs = (content.uks?.dokumen || []).filter(item => item.id !== doc.id);
                          updateContentField('uks', { ...content.uks, dokumen: newDocs });
                        }}
                        className="absolute top-4 right-4 p-1 bg-red-50 text-red-500 rounded hover:bg-red-100 cursor-pointer"
                        title="Hapus dokumen"
                      >
                        <Trash className="h-3 w-3" />
                      </button>
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-400 block font-bold">Judul Dokumen</label>
                        <input
                          type="text"
                          value={doc.title || ''}
                          onChange={e => {
                            const newDocs = [...(content.uks?.dokumen || [])];
                            newDocs[idx] = { ...newDocs[idx], title: e.target.value };
                            updateContentField('uks', { ...content.uks, dokumen: newDocs });
                          }}
                          className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800 focus:ring-1 focus:ring-brand-orange outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-400 block font-bold">URL Dokumen</label>
                        <input
                          type="text"
                          value={doc.url || ''}
                          onChange={e => {
                            const newDocs = [...(content.uks?.dokumen || [])];
                            newDocs[idx] = { ...newDocs[idx], url: e.target.value };
                            updateContentField('uks', { ...content.uks, dokumen: newDocs });
                          }}
                          className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-600 focus:ring-1 focus:ring-brand-orange outline-none"
                          placeholder="Contoh: https://drive.google.com/..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: KEUNGGULAN */}
          {activeSection === 'keunggulan' && (
            <div className="space-y-6">
              {content.keunggulan.map((item, idx) => (
                <div key={item.id} className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-[10px] font-black text-brand-primary bg-brand-primary/10 px-2.5 py-0.5 rounded">Pilar Keunggulan {idx + 1}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase block">Ikon Lucide (e.g. Award)</label>
                      <input
                        type="text"
                        value={item.iconName || ''}
                        onChange={e => updateContentListItem('keunggulan', item.id, 'iconName', e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase block">Judul Pilar</label>
                      <input
                        type="text"
                        value={item.title || ''}
                        onChange={e => updateContentListItem('keunggulan', item.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase block">Penjelasan Singkat</label>
                    <textarea
                      value={item.description || ''}
                      onChange={e => updateContentListItem('keunggulan', item.id, 'description', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SECTION 4: PROGRAMS */}
          {activeSection === 'programs' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-brand-navy/5 p-4 rounded-2xl">
                <span className="text-xs text-slate-600 font-bold">Total program: {content.programs.length}</span>
                <button
                  onClick={() => addContentListItem('programs', {
                    id: 'prog_' + Date.now(),
                    title: 'Program Baru',
                    description: 'Penjelasan program baru...',
                    category: 'Teknologi',
                    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800'
                  })}
                  className="px-3 py-1.5 bg-brand-orange text-white text-xs font-bold rounded-xl flex items-center space-x-1 hover:bg-brand-orange/90 transition-colors cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Tambah Program</span>
                </button>
              </div>

              <div className="space-y-4">
                {content.programs.map((item) => (
                  <div key={item.id} className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-sm relative">
                    <button
                      onClick={() => deleteContentListItem('programs', item.id)}
                      className="absolute top-4 right-4 p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2 space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold block">Judul Program</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={e => updateContentListItem('programs', item.id, 'title', e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold block">Kategori</label>
                        <input
                          type="text"
                          value={item.category}
                          onChange={e => updateContentListItem('programs', item.id, 'category', e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold block">Deskripsi Lengkap</label>
                      <textarea
                        value={item.description}
                        onChange={e => updateContentListItem('programs', item.id, 'description', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold block">URL Foto Cover</label>
                      <input
                        type="text"
                        value={item.image}
                        onChange={e => updateContentListItem('programs', item.id, 'image', e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 5: PRESTASI */}
          {activeSection === 'prestasi' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-brand-navy/5 p-4 rounded-2xl">
                <span className="text-xs text-slate-600 font-bold">Total Prestasi: {content.prestasi.length}</span>
                <button
                  onClick={() => addContentListItem('prestasi', {
                    id: 'pres_' + Date.now(),
                    title: 'Prestasi Baru',
                    category: 'Akademik',
                    achievement: 'Juara 1 Lomba Baru',
                    date: 'Juni 2026',
                    description: 'Penjelasan prestasi baru...',
                    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800'
                  })}
                  className="px-3 py-1.5 bg-brand-orange text-white text-xs font-bold rounded-xl flex items-center space-x-1 hover:bg-brand-orange/90 transition-colors cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Tambah Prestasi</span>
                </button>
              </div>

              <div className="space-y-4">
                {content.prestasi.map((item) => (
                  <div key={item.id} className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-sm relative">
                    <button
                      onClick={() => deleteContentListItem('prestasi', item.id)}
                      className="absolute top-4 right-4 p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold block">Nama Lomba / Event</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={e => updateContentListItem('prestasi', item.id, 'title', e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold block">Pencapaian (ex: Medali Emas)</label>
                        <input
                          type="text"
                          value={item.achievement}
                          onChange={e => updateContentListItem('prestasi', item.id, 'achievement', e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-brand-orange"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold block">Tanggal Pelaksanaan</label>
                        <input
                          type="text"
                          value={item.date}
                          onChange={e => updateContentListItem('prestasi', item.id, 'date', e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold block">Kategori Utama</label>
                        <select
                          value={item.category}
                          onChange={e => {
                              updateContentListItem('prestasi', item.id, 'category', e.target.value);
                              if (e.target.value !== 'Siswa') {
                                 updateContentListItem('prestasi', item.id, 'subCategory', undefined);
                              }
                          }}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                        >
                          <option value="Siswa">Siswa</option>
                          <option value="Guru">Guru</option>
                          <option value="Sekolah">Sekolah</option>
                        </select>
                      </div>
                      {item.category === 'Siswa' && (
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 font-bold block">Sub Kategori</label>
                          <select
                            value={item.subCategory || ''}
                            onChange={e => updateContentListItem('prestasi', item.id, 'subCategory', e.target.value)}
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                          >
                            <option value="">-- Pilih --</option>
                            <option value="Akademik">Akademik</option>
                            <option value="Non akademik">Non akademik</option>
                          </select>
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold block">Rincian Cerita Singkat</label>
                      <textarea
                        value={item.description}
                        onChange={e => updateContentListItem('prestasi', item.id, 'description', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold block">URL Foto Dokumentasi</label>
                      <input
                        type="text"
                        value={item.image}
                        onChange={e => updateContentListItem('prestasi', item.id, 'image', e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 6: GURU */}
          {activeSection === 'guru' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-brand-navy/5 p-4 rounded-2xl">
                <span className="text-xs text-slate-600 font-bold">Total Guru: {content.guru.length}</span>
                <button
                  onClick={() => addContentListItem('guru', {
                    id: 'guru_' + Date.now(),
                    name: 'Guru Baru, S.Pd',
                    nip: '-',
                    role: 'Guru Wali Kelas',
                    subject: 'Mata Pelajaran',
                    photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=600',
                    socials: { email: 'guru@sdnremen2.sch.id' }
                  })}
                  className="px-3 py-1.5 bg-brand-orange text-white text-xs font-bold rounded-xl flex items-center space-x-1 hover:bg-brand-orange/90 transition-colors cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Tambah Guru</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {content.guru.map((item) => (
                  <div key={item.id} className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-sm relative">
                    <button
                      onClick={() => deleteContentListItem('guru', item.id)}
                      className="absolute top-4 right-4 p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </button>
                    <div className="flex items-center space-x-3 border-b border-slate-100 pb-2">
                      <img src={item.photo} alt={item.name} className="h-10 w-10 rounded-full object-cover" />
                      <div className="truncate pr-8">
                        <h4 className="font-bold text-xs">{item.name}</h4>
                        <p className="text-[10px] text-slate-400">{item.role}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-400 uppercase font-black tracking-wider block">Nama Lengkap & Gelar</label>
                          <input
                            type="text"
                            value={item.name}
                            onChange={e => updateContentListItem('guru', item.id, 'name', e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-400 uppercase font-black tracking-wider block">NIP (Nomor Induk Pegawai)</label>
                          <input
                            type="text"
                            value={item.nip || ''}
                            onChange={e => updateContentListItem('guru', item.id, 'nip', e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                            placeholder="NIP. 19..."
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-400 uppercase font-black tracking-wider block">Jabatan/Wali Kelas</label>
                          <input
                            type="text"
                            value={item.role}
                            onChange={e => updateContentListItem('guru', item.id, 'role', e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-brand-primary font-bold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-400 uppercase font-black tracking-wider block">Mata Pelajaran</label>
                          <input
                            type="text"
                            value={item.subject}
                            onChange={e => updateContentListItem('guru', item.id, 'subject', e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-400 uppercase font-black tracking-wider block">URL Foto Profil</label>
                          <input
                            type="text"
                            value={item.photo}
                            onChange={e => updateContentListItem('guru', item.id, 'photo', e.target.value)}
                            className="w-full px-2 py-1.5 text-[9px] bg-slate-50 border border-slate-200 rounded-lg font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-400 uppercase font-black tracking-wider block">E-mail</label>
                          <input
                            type="email"
                            value={item.socials?.email || ''}
                            onChange={e => {
                              const s = { ...(item.socials || {}), email: e.target.value };
                              updateContentListItem('guru', item.id, 'socials', s);
                            }}
                            className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 7: GALERI */}
          {activeSection === 'galeri' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-brand-navy/5 p-4 rounded-2xl">
                <span className="text-xs text-slate-600 font-bold">Total Foto: {content.galeri.length}</span>
                <button
                  onClick={() => addContentListItem('galeri', {
                    id: 'gal_' + Date.now(),
                    title: 'Foto Kegiatan Baru',
                    category: 'Kegiatan',
                    url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800'
                  })}
                  className="px-3 py-1.5 bg-brand-orange text-white text-xs font-bold rounded-xl flex items-center space-x-1 hover:bg-brand-orange/90 transition-colors cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Tambah Foto</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {content.galeri.map((photo) => (
                  <div key={photo.id} className="p-3 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-sm relative">
                    <img src={photo.url} alt={photo.title} className="w-full aspect-video rounded-xl object-cover" />
                    <button
                      onClick={() => deleteContentListItem('galeri', photo.id)}
                      className="absolute top-4 right-4 p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </button>
                    <div className="space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="col-span-2 space-y-1">
                          <label className="text-[9px] text-slate-400 font-bold uppercase block">Judul / Keterangan Dokumentasi</label>
                          <input
                            type="text"
                            value={photo.title}
                            onChange={e => updateContentListItem('galeri', photo.id, 'title', e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800"
                            placeholder="Judul / Keterangan Dokumentasi"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-400 font-bold uppercase block">Jenis / Kategori</label>
                          <select
                            value={photo.category}
                            onChange={e => updateContentListItem('galeri', photo.id, 'category', e.target.value)}
                            className="w-full px-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-brand-orange font-bold focus:outline-none"
                          >
                            <option value="Kegiatan">Kegiatan</option>
                            <option value="Prestasi">Prestasi</option>
                            <option value="Pembelajaran">Pembelajaran</option>
                            <option value="Sarana">Sarana</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-400 font-bold uppercase block">URL Foto</label>
                        <input
                          type="text"
                          value={photo.url}
                          onChange={e => updateContentListItem('galeri', photo.id, 'url', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-[9px] bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-500"
                          placeholder="URL Foto"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: VIDEOS */}
          {activeSection === 'videos' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-brand-navy/5 p-4 rounded-2xl">
                <span className="text-xs text-slate-600 font-bold">Total Video: {(content.videos || []).length}</span>
                <button
                  onClick={() => addContentListItem('videos', {
                    id: 'vid_' + Date.now(),
                    youtubeId: 'dQw4w9WgXcQ',
                    title: 'Video Baru Sekolah',
                    duration: '5:00',
                    category: 'Kegiatan Siswa',
                    thumbnail: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=600'
                  })}
                  className="px-3 py-1.5 bg-brand-orange text-white text-xs font-bold rounded-xl flex items-center space-x-1 hover:bg-brand-orange/90 transition-colors cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Tambah Video</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(content.videos || []).map((video) => (
                  <div key={video.id} className="p-3 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-sm relative">
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100">
                      <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                        <div className="bg-red-600 text-white p-2 rounded-full shadow-lg">
                          <Play className="h-4 w-4 fill-white" />
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteContentListItem('videos', video.id)}
                      className="absolute top-4 right-4 p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all cursor-pointer z-10"
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </button>
                    <div className="space-y-2">
                      <div>
                        <label className="text-[9px] text-slate-400 uppercase font-black block mb-1">Judul Video</label>
                        <input
                          type="text"
                          value={video.title}
                          onChange={e => updateContentListItem('videos', video.id, 'title', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold"
                          placeholder="Judul Video"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] text-slate-400 uppercase font-black block mb-1">YouTube ID</label>
                          <input
                            type="text"
                            value={video.youtubeId}
                            onChange={e => updateContentListItem('videos', video.id, 'youtubeId', e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                            placeholder="Contoh: dQw4w9WgXcQ"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-400 uppercase font-black block mb-1">Durasi (Menit)</label>
                          <input
                            type="text"
                            value={video.duration}
                            onChange={e => updateContentListItem('videos', video.id, 'duration', e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold"
                            placeholder="Contoh: 4:15"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] text-slate-400 uppercase font-black block mb-1">Kategori</label>
                          <select
                            value={video.category}
                            onChange={e => updateContentListItem('videos', video.id, 'category', e.target.value)}
                            className="w-full px-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-brand-orange font-bold focus:outline-none"
                          >
                            <option value="Profil Utama">Profil Utama</option>
                            <option value="Kegiatan Siswa">Kegiatan Siswa</option>
                            <option value="Smart Classroom">Smart Classroom</option>
                            <option value="Sains & Teknologi">Sains & Teknologi</option>
                            <option value="Kesenian & Budaya">Kesenian & Budaya</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-400 uppercase font-black block mb-1">URL Cover / Thumbnail</label>
                          <input
                            type="text"
                            value={video.thumbnail}
                            onChange={e => updateContentListItem('videos', video.id, 'thumbnail', e.target.value)}
                            className="w-full px-2.5 py-1.5 text-[9px] bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-500"
                            placeholder="URL Cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 8: EKSKUL */}
          {activeSection === 'ekskul' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-brand-navy/5 p-4 rounded-2xl">
                <span className="text-xs text-slate-600 font-bold">Total Ekskul: {content.ekstrakurikuler.length}</span>
                <button
                  onClick={() => addContentListItem('ekstrakurikuler', {
                    id: 'ek_' + Date.now(),
                    name: 'Ekstrakurikuler Baru',
                    description: 'Pembinaan karakter dan minat baru...',
                    iconName: 'Sparkles'
                  })}
                  className="px-3 py-1.5 bg-brand-orange text-white text-xs font-bold rounded-xl flex items-center space-x-1 hover:bg-brand-orange/90 transition-colors cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Tambah Ekskul</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {content.ekstrakurikuler.map((item) => (
                  <div key={item.id} className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2 relative">
                    <button
                      onClick={() => deleteContentListItem('ekstrakurikuler', item.id)}
                      className="absolute top-4 right-4 p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </button>
                    <div className="grid grid-cols-2 gap-2 pr-6">
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-400 block font-bold">Nama Kegiatan</label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={e => updateContentListItem('ekstrakurikuler', item.id, 'name', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-400 block font-bold">Ikon Lucide</label>
                        <input
                          type="text"
                          value={item.iconName}
                          onChange={e => updateContentListItem('ekstrakurikuler', item.id, 'iconName', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-brand-orange font-bold"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-slate-400 block font-bold">Deskripsi</label>
                      <textarea
                        value={item.description}
                        onChange={e => updateContentListItem('ekstrakurikuler', item.id, 'description', e.target.value)}
                        rows={2}
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-600 font-light"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 9: PPDB / Admissions */}
          {activeSection === 'ppdb' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 block font-bold">Status Pendaftaran</label>
                  <select
                    value={content.ppdb.status}
                    onChange={e => updateContentField('ppdb', { ...content.ppdb, status: e.target.value })}
                    className="w-full px-4 py-3 text-sm bg-white border border-slate-200 text-slate-900 rounded-xl font-bold"
                  >
                    <option value="Open">Buka (Open)</option>
                    <option value="Closed">Tutup (Closed)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 block font-bold">Total Kuota Kursi</label>
                  <input
                    type="number"
                    value={content.ppdb.kuota}
                    onChange={e => updateContentField('ppdb', { ...content.ppdb, kuota: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 text-slate-900 rounded-xl font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 block font-bold">Siswa Terdaftar</label>
                  <input
                    type="number"
                    value={content.ppdb.kuotaTerisi}
                    onChange={e => updateContentField('ppdb', { ...content.ppdb, kuotaTerisi: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 text-brand-primary rounded-xl font-black"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 block font-bold">Batas Tanggal Hitung Mundur</label>
                <input
                  type="datetime-local"
                  value={content.ppdb.countdownDate ? content.ppdb.countdownDate.substring(0, 16) : ''}
                  onChange={e => updateContentField('ppdb', { ...content.ppdb, countdownDate: e.target.value })}
                  className="w-full px-4 py-3 text-sm bg-white border border-slate-200 text-brand-orange rounded-xl font-bold"
                />
              </div>

              {/* Requirements editing */}
              <div className="space-y-3">
                <label className="text-xs text-slate-500 block font-bold">Persyaratan Berkas</label>
                {content.ppdb.persyaratan.map((req, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={req}
                      onChange={e => {
                        const newReqs = [...content.ppdb.persyaratan];
                        newReqs[idx] = e.target.value;
                        updateContentField('ppdb', { ...content.ppdb, persyaratan: newReqs });
                      }}
                      className="flex-grow px-3 py-2 text-xs bg-white border border-slate-200 text-slate-700 rounded-xl"
                    />
                    <button
                      onClick={() => {
                        const newReqs = content.ppdb.persyaratan.filter((_, i) => i !== idx);
                        updateContentField('ppdb', { ...content.ppdb, persyaratan: newReqs });
                      }}
                      className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newReqs = [...content.ppdb.persyaratan, 'Persyaratan baru...'];
                    updateContentField('ppdb', { ...content.ppdb, persyaratan: newReqs });
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-600 rounded-lg flex items-center space-x-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Tambah Berkas</span>
                </button>
              </div>

              {/* Jadwal Penting update */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <label className="text-xs text-slate-500 block font-bold">Jadwal Penting SPMB</label>
                {(content.ppdb.jadwal || []).map((item, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row gap-2 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-850">
                    <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 block font-semibold">Nama Tahapan / Jalur</span>
                        <input
                          type="text"
                          value={item.phase}
                          onChange={e => {
                            const newJadwal = [...(content.ppdb.jadwal || [])];
                            newJadwal[idx] = { ...newJadwal[idx], phase: e.target.value };
                            updateContentField('ppdb', { ...content.ppdb, jadwal: newJadwal });
                          }}
                          placeholder="Contoh: Gelombang 1"
                          className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 block font-semibold">Waktu Pelaksanaan</span>
                        <input
                          type="text"
                          value={item.date}
                          onChange={e => {
                            const newJadwal = [...(content.ppdb.jadwal || [])];
                            newJadwal[idx] = { ...newJadwal[idx], date: e.target.value };
                            updateContentField('ppdb', { ...content.ppdb, jadwal: newJadwal });
                          }}
                          placeholder="Contoh: 1 - 20 Juni 2026"
                          className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const newJadwal = (content.ppdb.jadwal || []).filter((_, i) => i !== idx);
                        updateContentField('ppdb', { ...content.ppdb, jadwal: newJadwal });
                      }}
                      className="p-1.5 self-end sm:self-center bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all cursor-pointer flex-shrink-0"
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newJadwal = [...(content.ppdb.jadwal || []), { phase: 'Tahapan Baru', date: 'Tanggal Pelaksanaan' }];
                    updateContentField('ppdb', { ...content.ppdb, jadwal: newJadwal });
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-600 rounded-lg flex items-center space-x-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Tambah Jadwal</span>
                </button>
              </div>

              {/* Alur & Prosedur Pendaftaran update */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <label className="text-xs text-slate-500 block font-bold">Alur & Prosedur Pendaftaran</label>
                {(content.ppdb.alur || []).map((item, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row gap-2 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-850">
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
                            const newAlur = [...(content.ppdb.alur || [])];
                            newAlur[idx] = { ...newAlur[idx], title: e.target.value };
                            updateContentField('ppdb', { ...content.ppdb, alur: newAlur });
                          }}
                          placeholder="Contoh: Pengisian Formulir"
                          className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 block font-semibold">Deskripsi Alur</span>
                        <textarea
                          value={item.desc}
                          onChange={e => {
                            const newAlur = [...(content.ppdb.alur || [])];
                            newAlur[idx] = { ...newAlur[idx], desc: e.target.value };
                            updateContentField('ppdb', { ...content.ppdb, alur: newAlur });
                          }}
                          placeholder="Keterangan alur..."
                          rows={2}
                          className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const newAlur = (content.ppdb.alur || []).filter((_, i) => i !== idx)
                          .map((val, i) => ({ ...val, step: i + 1 }));
                        updateContentField('ppdb', { ...content.ppdb, alur: newAlur });
                      }}
                      className="p-1.5 self-end sm:self-center bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all cursor-pointer flex-shrink-0"
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const nextStep = (content.ppdb.alur || []).length + 1;
                    const newAlur = [...(content.ppdb.alur || []), { step: nextStep, title: 'Langkah Baru', desc: 'Penjelasan detail langkah pendaftaran...' }];
                    updateContentField('ppdb', { ...content.ppdb, alur: newAlur });
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-600 rounded-lg flex items-center space-x-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Tambah Alur</span>
                </button>
              </div>

              {/* SPMB Student Management Callout */}
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200">Manajemen Calon Siswa SPMB</h4>
                  <span className="text-[10px] bg-brand-primary/10 text-brand-primary px-2.5 py-1 rounded-full font-bold">
                    Otomatis
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Semua siswa yang mendaftar online akan tercatat dan dihitung secara real-time. Anda dapat mengedit detail (nama, NIK, status diterima/tidak diterima) atau menghapus siswa tersebut langsung pada tabel halaman <b>SPMB Online</b> di website ini saat mode edit aktif.
                </p>
                <button
                  onClick={() => {
                    setActiveSection(null); // Close the CMS modal
                    setTimeout(() => {
                      window.location.href = '/spmb#daftar-siswa-diterima';
                    }, 100);
                  }}
                  className="px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 text-slate-950 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Lihat & Kelola Daftar Siswa di Halaman SPMB
                </button>
              </div>
            </div>
          )}

          {/* SECTION 10: FAQ */}
          {activeSection === 'faq' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-brand-navy/5 p-4 rounded-2xl">
                <span className="text-xs text-slate-600 font-bold">Total FAQ: {content.faq.length}</span>
                <button
                  onClick={() => addContentListItem('faq', {
                    id: 'faq_' + Date.now(),
                    question: 'Pertanyaan baru?',
                    answer: 'Jawaban detail...'
                  })}
                  className="px-3 py-1.5 bg-brand-orange text-white text-xs font-bold rounded-xl flex items-center space-x-1 hover:bg-brand-orange/90 transition-colors cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Tambah FAQ</span>
                </button>
              </div>

              <div className="space-y-4">
                {content.faq.map((item) => (
                  <div key={item.id} className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2 relative">
                    <button
                      onClick={() => deleteContentListItem('faq', item.id)}
                      className="absolute top-4 right-4 p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </button>
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold block">Pertanyaan</label>
                        <input
                          type="text"
                          value={item.question}
                          onChange={e => updateContentListItem('faq', item.id, 'question', e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold block">Jawaban</label>
                        <textarea
                          value={item.answer}
                          onChange={e => updateContentListItem('faq', item.id, 'answer', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 11: BERITA */}
          {activeSection === 'berita' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-brand-navy/5 p-4 rounded-2xl">
                <span className="text-xs text-slate-600 font-bold">Total Artikel: {content.berita.length}</span>
                <button
                  onClick={() => addContentListItem('berita', {
                    id: 'berita_' + Date.now(),
                    title: 'Berita Sekolah Terbaru',
                    category: 'Akademik',
                    summary: 'Penjelasan ringkas berita...',
                    content: 'Tulis isi konten berita selengkapnya...',
                    date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
                    thumbnail: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800'
                  })}
                  className="px-3 py-1.5 bg-brand-orange text-white text-xs font-bold rounded-xl flex items-center space-x-1 hover:bg-brand-orange/90 transition-colors cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Tulis Berita Baru</span>
                </button>
              </div>

              <div className="space-y-6">
                {content.berita.map((item) => (
                  <div key={item.id} className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-sm relative">
                    <button
                      onClick={() => deleteContentListItem('berita', item.id)}
                      className="absolute top-4 right-4 p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold block">Judul Berita</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={e => updateContentListItem('berita', item.id, 'title', e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold block">Kategori</label>
                        <input
                          type="text"
                          value={item.category}
                          onChange={e => updateContentListItem('berita', item.id, 'category', e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold block">Tanggal Terbit</label>
                        <input
                          type="text"
                          value={item.date}
                          onChange={e => updateContentListItem('berita', item.id, 'date', e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold block">URL Thumbnail</label>
                        <input
                          type="text"
                          value={item.thumbnail}
                          onChange={e => updateContentListItem('berita', item.id, 'thumbnail', e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold block">Ringkasan Berita</label>
                      <textarea
                        value={item.summary}
                        onChange={e => updateContentListItem('berita', item.id, 'summary', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-600"
                      />
                    </div>
                    <RichTextEditor 
                      label="Konten Artikel Lengkap"
                      value={item.content}
                      onChange={val => updateContentListItem('berita', item.id, 'content', val)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 12: TESTIMONI */}
          {activeSection === 'testimoni' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-brand-navy/5 p-4 rounded-2xl">
                <span className="text-xs text-slate-600 font-bold">Total Testimoni: {content.testimoni.length}</span>
                <button
                  onClick={() => addContentListItem('testimoni', {
                    id: 'test_' + Date.now(),
                    name: 'Bapak / Ibu Wali',
                    role: 'Orang Tua',
                    relation: 'Orang Tua dari Siswa Kelas 2',
                    content: 'Testimoni positif seputar pelayanan sekolah...',
                    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
                  })}
                  className="px-3 py-1.5 bg-brand-orange text-white text-xs font-bold rounded-xl flex items-center space-x-1 hover:bg-brand-orange/90 transition-colors cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Tambah Testimoni</span>
                </button>
              </div>

              <div className="space-y-4">
                {content.testimoni.map((item) => (
                  <div key={item.id} className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-sm relative">
                    <button
                      onClick={() => deleteContentListItem('testimoni', item.id)}
                      className="absolute top-4 right-4 p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold block">Nama Lengkap</label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={e => updateContentListItem('testimoni', item.id, 'name', e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold block">Hubungan / Peran (ex: Wali Kelas 3)</label>
                        <input
                          type="text"
                          value={item.relation}
                          onChange={e => updateContentListItem('testimoni', item.id, 'relation', e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold block">Peran Kategori</label>
                        <select
                          value={item.role}
                          onChange={e => updateContentListItem('testimoni', item.id, 'role', e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                        >
                          <option value="Orang Tua">Orang Tua</option>
                          <option value="Alumni">Alumni</option>
                          <option value="Guru">Guru</option>
                          <option value="Siswa">Siswa</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold block">URL Avatar Foto</label>
                        <input
                          type="text"
                          value={item.avatar}
                          onChange={e => updateContentListItem('testimoni', item.id, 'avatar', e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-400"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold block">Komentar Testimoni</label>
                      <textarea
                        value={item.content}
                        onChange={e => updateContentListItem('testimoni', item.id, 'content', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-600 font-light"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: STRUKTUR ORGANISASI */}
          {activeSection === 'struktur' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h4 className="font-display font-bold text-slate-800 text-sm">Kelola Link Gambar Bagan Struktur</h4>
                <p className="text-xs text-slate-500">
                  Unggah gambar bagan struktur organisasi sekolah, komite, UKS, perpustakaan, atau ekstrakurikuler ke hosting gambar Anda (seperti ImgBB, Postimages, Canva, dsb), lalu masukkan link langsung (Direct Link) gambarnya di sini.
                </p>
              </div>

              <div className="space-y-5">
                {/* 1. Struktur Sekolah */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="h-8 w-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                      <Users className="h-4.5 w-4.5" />
                    </div>
                    <span className="font-display font-black text-slate-800 text-xs uppercase tracking-tight">Struktur Organisasi Sekolah</span>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={content.strukturSekolahImageUrl || ''}
                      onChange={e => updateContentField('strukturSekolahImageUrl', e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 text-slate-600 rounded-xl focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                      placeholder="Contoh: https://i.ibb.co/xyz/bagan_sekolah.jpg"
                    />
                    {content.strukturSekolahImageUrl && (
                      <div className="relative group w-48 aspect-video overflow-hidden rounded-lg border border-slate-200 mt-1">
                        <img src={content.strukturSekolahImageUrl} alt="Pratinjau Struktur Sekolah" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <a href={content.strukturSekolahImageUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-white/90 rounded-full text-slate-800 text-xs font-bold hover:bg-white flex items-center gap-1">
                            <ImageIcon className="h-3 w-3 text-brand-primary" />
                            <span>Buka</span>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Struktur Komite */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="h-8 w-8 rounded-lg bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                      <Users className="h-4.5 w-4.5" />
                    </div>
                    <span className="font-display font-black text-slate-800 text-xs uppercase tracking-tight">Struktur Komite Sekolah</span>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={content.strukturKomiteImageUrl || ''}
                      onChange={e => updateContentField('strukturKomiteImageUrl', e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 text-slate-600 rounded-xl focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                      placeholder="Contoh: https://i.ibb.co/xyz/bagan_komite.jpg"
                    />
                    {content.strukturKomiteImageUrl && (
                      <div className="relative group w-48 aspect-video overflow-hidden rounded-lg border border-slate-200 mt-1">
                        <img src={content.strukturKomiteImageUrl} alt="Pratinjau Struktur Komite" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <a href={content.strukturKomiteImageUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-white/90 rounded-full text-slate-800 text-xs font-bold hover:bg-white flex items-center gap-1">
                            <ImageIcon className="h-3 w-3 text-brand-primary" />
                            <span>Buka</span>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Struktur UKS */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500">
                      <Users className="h-4.5 w-4.5" />
                    </div>
                    <span className="font-display font-black text-slate-800 text-xs uppercase tracking-tight">Struktur Organisasi UKS</span>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={content.strukturUKSImageUrl || ''}
                      onChange={e => updateContentField('strukturUKSImageUrl', e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 text-slate-600 rounded-xl focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                      placeholder="Contoh: https://i.ibb.co/xyz/bagan_uks.jpg"
                    />
                    {content.strukturUKSImageUrl && (
                      <div className="relative group w-48 aspect-video overflow-hidden rounded-lg border border-slate-200 mt-1">
                        <img src={content.strukturUKSImageUrl} alt="Pratinjau Struktur UKS" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <a href={content.strukturUKSImageUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-white/90 rounded-full text-slate-800 text-xs font-bold hover:bg-white flex items-center gap-1">
                            <ImageIcon className="h-3 w-3 text-brand-primary" />
                            <span>Buka</span>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. Struktur Perpustakaan */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                      <Users className="h-4.5 w-4.5" />
                    </div>
                    <span className="font-display font-black text-slate-800 text-xs uppercase tracking-tight">Struktur Organisasi Perpustakaan</span>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={content.strukturPerpustakaanImageUrl || ''}
                      onChange={e => updateContentField('strukturPerpustakaanImageUrl', e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 text-slate-600 rounded-xl focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                      placeholder="Contoh: https://i.ibb.co/xyz/bagan_pustaka.jpg"
                    />
                    {content.strukturPerpustakaanImageUrl && (
                      <div className="relative group w-48 aspect-video overflow-hidden rounded-lg border border-slate-200 mt-1">
                        <img src={content.strukturPerpustakaanImageUrl} alt="Pratinjau Struktur Perpustakaan" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <a href={content.strukturPerpustakaanImageUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-white/90 rounded-full text-slate-800 text-xs font-bold hover:bg-white flex items-center gap-1">
                            <ImageIcon className="h-3 w-3 text-brand-primary" />
                            <span>Buka</span>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 5. Struktur Ekstrakurikuler */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="h-8 w-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-500">
                      <Users className="h-4.5 w-4.5" />
                    </div>
                    <span className="font-display font-black text-slate-800 text-xs uppercase tracking-tight">Struktur Organisasi Ekstrakurikuler</span>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={content.strukturEkskulImageUrl || ''}
                      onChange={e => updateContentField('strukturEkskulImageUrl', e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 text-slate-600 rounded-xl focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                      placeholder="Contoh: https://i.ibb.co/xyz/bagan_ekskul.jpg"
                    />
                    {content.strukturEkskulImageUrl && (
                      <div className="relative group w-48 aspect-video overflow-hidden rounded-lg border border-slate-200 mt-1">
                        <img src={content.strukturEkskulImageUrl} alt="Pratinjau Struktur Ekstrakurikuler" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <a href={content.strukturEkskulImageUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-white/90 rounded-full text-slate-800 text-xs font-bold hover:bg-white flex items-center gap-1">
                            <ImageIcon className="h-3 w-3 text-brand-primary" />
                            <span>Buka</span>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Instructions Box */}
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start space-x-2.5 text-amber-800 text-xs">
                <HelpCircle className="h-4.5 w-4.5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <h5 className="font-bold uppercase tracking-wider">Petunjuk Link Gambar:</h5>
                  <ul className="list-disc pl-4 space-y-1 text-amber-700 font-medium">
                    <li>Upload gambar bagan Anda ke situs gratis seperti <a href="https://imgbb.com/" target="_blank" rel="noreferrer" className="underline font-bold hover:text-amber-900 font-bold">ImgBB</a> atau <a href="https://postimages.org/" target="_blank" rel="noreferrer" className="underline font-bold hover:text-amber-900 font-bold">Postimages</a>.</li>
                    <li>Gunakan <strong>Direct Link / Link Langsung</strong> yang berakhiran dengan ekstensi gambar (misal <code>.jpg</code>, <code>.png</code>).</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 13: CONTACT */}
          {activeSection === 'contact' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 block font-bold">Nomor Telepon Sekretariat</label>
                  <input
                    type="text"
                    value={content.contact.telepon || ''}
                    onChange={e => updateContentField('contact', { ...content.contact, telepon: e.target.value })}
                    className="w-full px-4 py-3 text-sm bg-white border border-slate-200 text-slate-900 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 block font-bold">Email Resmi Sekolah</label>
                  <input
                    type="email"
                    value={content.contact.email || ''}
                    onChange={e => updateContentField('contact', { ...content.contact, email: e.target.value })}
                    className="w-full px-4 py-3 text-sm bg-white border border-slate-200 text-slate-900 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 block font-bold">Alamat Fisik Sekolah</label>
                <textarea
                  value={content.contact.alamat || ''}
                  onChange={e => updateContentField('contact', { ...content.contact, alamat: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 text-sm bg-white border border-slate-200 text-slate-900 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 block font-bold">Jam Operasional</label>
                <input
                  type="text"
                  value={content.contact.jamOperasional || ''}
                  onChange={e => updateContentField('contact', { ...content.contact, jamOperasional: e.target.value })}
                  className="w-full px-4 py-3 text-sm bg-white border border-slate-200 text-slate-900 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 block font-bold">Google Maps Embed URL</label>
                <input
                  type="text"
                  value={content.contact.mapsEmbedUrl || ''}
                  onChange={e => updateContentField('contact', { ...content.contact, mapsEmbedUrl: e.target.value })}
                  className="w-full px-4 py-3 text-xs bg-white border border-slate-200 font-mono text-slate-500 rounded-xl"
                />
              </div>

              {/* Medsos URLs */}
              <div className="border-t border-slate-200 pt-5 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Tautan Media Sosial</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold block">Instagram</label>
                    <input
                      type="text"
                      value={content.contact.socials?.instagram || ''}
                      onChange={e => updateContentField('contact', { 
                        ...content.contact, 
                        socials: { ...content.contact.socials, instagram: e.target.value } 
                      })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold block">YouTube</label>
                    <input
                      type="text"
                      value={content.contact.socials?.youtube || ''}
                      onChange={e => updateContentField('contact', { 
                        ...content.contact, 
                        socials: { ...content.contact.socials, youtube: e.target.value } 
                      })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold block">TikTok</label>
                    <input
                      type="text"
                      value={content.contact.socials?.tiktok || ''}
                      onChange={e => updateContentField('contact', { 
                        ...content.contact, 
                        socials: { ...content.contact.socials, tiktok: e.target.value } 
                      })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold block">Facebook</label>
                    <input
                      type="text"
                      value={content.contact.socials?.facebook || ''}
                      onChange={e => updateContentField('contact', { 
                        ...content.contact, 
                        socials: { ...content.contact.socials, facebook: e.target.value } 
                      })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-slate-100 border-t border-slate-200 flex flex-col space-y-3">
          {errorText && (
            <div className="text-xs bg-red-100 text-red-700 font-bold px-4 py-2 rounded-xl border border-red-200 animate-pulse">
              ⚠️ {errorText}
            </div>
          )}
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Perubahan langsung tampil di web!</p>
            <div className="flex space-x-3">
              <button
                onClick={handleClose}
                className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
              >
                Tutup
              </button>
              <button
                onClick={async () => {
                  try {
                    setErrorText(null);
                    await saveChanges();
                    handleClose();
                  } catch (err: any) {
                    setErrorText('Gagal menyimpan ke server: ' + (err.message || err));
                  }
                }}
                disabled={isSaving}
                className="px-5 py-2.5 bg-brand-primary text-white hover:bg-brand-primary/90 text-xs font-bold rounded-xl shadow-md shadow-brand-primary/20 transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{isSaving ? 'Menyimpan...' : 'Simpan & Tutup'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
