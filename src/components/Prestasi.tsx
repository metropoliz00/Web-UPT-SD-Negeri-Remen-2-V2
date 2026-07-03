import React, { useState } from 'react';
import { PrestasiItem } from '../types';
import { Search, Trophy, Calendar, Award, ZoomIn, SlidersHorizontal } from 'lucide-react';

interface PrestasiProps {
  items: PrestasiItem[];
  lang: 'id' | 'en';
  defaultCategory?: 'Semua' | 'Siswa' | 'Guru' | 'Sekolah';
}

export default function Prestasi({ items, lang, defaultCategory = 'Semua' }: PrestasiProps) {
  const [selectedCategory, setSelectedCategory] = useState<'Semua' | 'Siswa' | 'Guru' | 'Sekolah'>(defaultCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [lightboxItem, setLightboxItem] = useState<PrestasiItem | null>(null);

  // Filtering Logic
  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.achievement.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="prestasi" className="py-24 bg-white dark:bg-slate-950 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full">
            {lang === 'id' ? 'Galeri Juara' : 'Hall of Fame'}
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-brand-navy dark:text-white tracking-tight">
            {lang === 'id' ? 'Prestasi' : 'Achievements'}
          </h2>
          <div className="h-1 w-20 bg-brand-orange mx-auto rounded-full" />
        </div>

        {/* Filters and Search Bar Row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 bg-slate-50 dark:bg-slate-900 rounded-3xl p-4 border border-slate-100 dark:border-slate-800/80">
          {/* Category Tabs */}
          <div className="flex items-center space-x-1.5 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            {(['Semua', 'Siswa', 'Guru', 'Sekolah'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-2xl transition-all duration-300 whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-brand-orange text-white shadow-md shadow-brand-orange/25'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full max-w-xs flex-shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'id' ? 'Cari prestasi...' : 'Search achievements...'}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-2xl bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
          </div>
        </div>

        {/* Achievements Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setLightboxItem(item)}
                className="group relative bg-white/40 dark:bg-slate-900 border border-white/60 dark:border-white/10 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:bg-white dark:hover:bg-slate-900/95 transition-all duration-500 cursor-pointer flex flex-col sm:flex-row"
              >
                {/* Photo portion */}
                <div className="relative w-full sm:w-1/2 aspect-video sm:aspect-square md:aspect-auto overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Category Pill Tag */}
                  <span className={`absolute top-4 left-4 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md text-white ${
                    item.category === 'Siswa' ? 'bg-brand-primary' : item.category === 'Guru' ? 'bg-emerald-500' : 'bg-brand-orange'
                  }`}>
                    {item.category}
                  </span>
                </div>

                {/* Info portion */}
                <div className="p-6 sm:p-8 sm:w-1/2 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-1.5 text-xs text-slate-400 dark:text-slate-500">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{item.date}</span>
                    </div>

                    <h3 className="font-display font-bold text-base text-brand-navy dark:text-white leading-snug group-hover:text-brand-orange transition-colors">
                      {item.title}
                    </h3>

                    <div className="inline-flex items-center space-x-1 text-xs font-bold text-brand-orange bg-brand-orange/10 px-2.5 py-1 rounded-md">
                      <Trophy className="h-3.5 w-3.5 mr-1" />
                      <span>{item.achievement}</span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 font-light line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center space-x-1 text-xs font-bold text-slate-400 group-hover:text-brand-orange transition-all uppercase tracking-wider">
                    <ZoomIn className="h-4 w-4" />
                    <span>{lang === 'id' ? 'Perbesar Info' : 'Zoom Details'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {lang === 'id' ? 'Tidak ada prestasi yang sesuai kriteria.' : 'No achievements match your search criteria.'}
            </p>
          </div>
        )}
      </div>

      {/* Modern Lightbox Modal Container */}
      {lightboxItem && (
        <div className="fixed inset-0 bg-slate-950/95 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setLightboxItem(null)}
              className="absolute top-4 right-4 bg-slate-950/60 hover:bg-slate-950/90 text-white rounded-full p-2.5 text-sm font-bold z-30 transition-colors"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12">
              {/* Image Col */}
              <div className="md:col-span-6 relative aspect-video md:aspect-auto md:min-h-[400px]">
                <img
                  src={lightboxItem.image}
                  alt={lightboxItem.title}
                  className="w-full h-full object-cover"
                />
                <span className={`absolute top-4 left-4 text-xs font-extrabold uppercase tracking-widest px-3 py-1 text-white rounded-md ${
                  lightboxItem.category === 'Siswa' ? 'bg-brand-primary' : lightboxItem.category === 'Guru' ? 'bg-emerald-500' : 'bg-brand-orange'
                }`}>
                  {lightboxItem.category}
                </span>
              </div>

              {/* Data Content Col */}
              <div className="md:col-span-6 p-6 sm:p-8 space-y-4 flex flex-col justify-center">
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <Calendar className="h-4 w-4" />
                  <span>{lightboxItem.date}</span>
                </div>

                <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-800 dark:text-white leading-tight">
                  {lightboxItem.title}
                </h3>

                <div className="inline-flex items-center space-x-1.5 text-sm font-bold text-brand-orange bg-brand-orange/10 px-3 py-1.5 rounded-lg w-max">
                  <Trophy className="h-4.5 w-4.5 mr-1" />
                  <span>{lightboxItem.achievement}</span>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Deskripsi Prestasi:</h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-light leading-relaxed">
                    {lightboxItem.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setLightboxItem(null)}
                    className="px-6 py-2.5 bg-brand-orange text-white font-semibold text-xs rounded-xl uppercase tracking-wider transition-all shadow-md hover:bg-brand-orange/90 w-full"
                  >
                    {lang === 'id' ? 'Selesai' : 'Close'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
