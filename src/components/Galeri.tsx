import React, { useState } from 'react';
import { GaleriItem } from '../types';
import { Search, Image as ImageIcon, Filter, ZoomIn, Eye } from 'lucide-react';

interface GaleriProps {
  items: GaleriItem[];
  lang: 'id' | 'en';
}

export default function Galeri({ items, lang }: GaleriProps) {
  const [selectedCategory, setSelectedCategory] = useState<'Semua' | 'Kegiatan' | 'Prestasi' | 'Pembelajaran' | 'Sarana'>('Semua');
  const [activePhoto, setActivePhoto] = useState<GaleriItem | null>(null);

  // Filter photos
  const filteredPhotos = items.filter((photo) => {
    return selectedCategory === 'Semua' || photo.category === selectedCategory;
  });

  return (
    <section id="galeri" className="py-24 bg-white dark:bg-slate-950 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full">
            {lang === 'id' ? 'Galeri Foto' : 'Media Gallery'}
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-brand-navy dark:text-white tracking-tight">
            {lang === 'id' ? 'Dokumentasi Kegiatan Sekolah' : 'Take a Look inside Our School Activities'}
          </h2>
          <div className="h-1 w-20 bg-brand-orange mx-auto rounded-full" />
          <p className="text-sm text-slate-500 dark:text-slate-400 font-light max-w-xl mx-auto">
            {lang === 'id'
              ? 'Melihat keseharian belajar-mengajar, kebersamaan murid, dan ketersediaan sarana penunjang.'
              : 'Witnessing day-to-day teaching, student friendship, and modern teaching infrastructures.'
            }
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {(['Semua', 'Kegiatan', 'Prestasi', 'Pembelajaran', 'Sarana'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-2xl transition-all duration-300 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/20'
                  : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800 hover:border-brand-orange'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Photo Grid - Modern bento masonry mock */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setActivePhoto(photo)}
              className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800/80 shadow-md hover:shadow-xl transition-all duration-300 cursor-zoom-in flex flex-col"
            >
              {/* Image container */}
              <div className="relative overflow-hidden aspect-video">
                <img
                  src={photo.url}
                  alt={photo.title}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-slate-950/10 group-hover:bg-slate-950/20 transition-colors" />
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-950/80 backdrop-blur-sm p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ZoomIn className="h-4 w-4 text-brand-orange" />
                </div>
              </div>
              
              {/* Info section - Always visible labeling */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <span className="inline-block text-[10px] font-black uppercase tracking-widest bg-brand-orange/10 dark:bg-brand-orange/25 text-brand-orange px-2.5 py-1 rounded-md">
                    {photo.category}
                  </span>
                  <h3 className="font-display font-extrabold text-sm sm:text-base text-slate-950 dark:text-white group-hover:text-brand-orange transition-colors duration-300 line-clamp-2">
                    {photo.title}
                  </h3>
                </div>
                <div className="flex items-center text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pt-2 border-t border-slate-50 dark:border-slate-800/60">
                  <Eye className="h-3.5 w-3.5 mr-1 text-brand-orange" />
                  <span>{lang === 'id' ? 'Lihat Dokumentasi' : 'View Documentation'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox zoom modal */}
      {activePhoto && (
        <div className="fixed inset-0 bg-slate-950/90 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
            {/* Close button */}
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 bg-slate-950/50 hover:bg-slate-950/85 text-white hover:text-brand-primary rounded-full p-2.5 text-sm font-bold z-10 transition-colors"
            >
              ✕
            </button>
            <div className="aspect-video sm:aspect-auto sm:max-h-[75vh]">
              <img
                src={activePhoto.url}
                alt={activePhoto.title}
                className="w-full h-full object-contain mx-auto"
              />
            </div>
            
            {/* Description footer inside modal */}
            <div className="p-6 bg-slate-950/95 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded">
                  {activePhoto.category}
                </span>
                <h4 className="text-white font-display font-bold text-sm sm:text-base">{activePhoto.title}</h4>
              </div>
              <button
                onClick={() => setActivePhoto(null)}
                className="px-5 py-2.5 bg-brand-primary text-slate-950 text-xs font-bold rounded-xl tracking-wider uppercase transition-all"
              >
                {lang === 'id' ? 'Selesai' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
