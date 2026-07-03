import React, { useState } from 'react';
import { BeritaItem } from '../types';
import { Calendar, Search, ArrowRight, User, Tag, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

interface BeritaProps {
  items: BeritaItem[];
  lang: 'id' | 'en';
}

export default function Berita({ items, lang }: BeritaProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeArticle, setActiveArticle] = useState<BeritaItem | null>(null);

  const ITEMS_PER_PAGE = 3;

  // Extract unique categories
  const categories = ['Semua', ...Array.from(new Set(items.map((i) => i.category)))];

  // Filter logic
  const filteredBerita = items.filter((berita) => {
    const matchesCategory = selectedCategory === 'Semua' || berita.category === selectedCategory;
    const matchesSearch = berita.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          berita.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          berita.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredBerita.length / ITEMS_PER_PAGE) || 1;
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredBerita.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <section id="berita" className="py-24 bg-white dark:bg-slate-950 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full">
            {lang === 'id' ? 'Kabar Sekolah' : 'News & Blog'}
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-brand-navy dark:text-white tracking-tight">
            {lang === 'id' ? 'Berita & Pengumuman Terbaru Kami' : 'Latest News & Official Announcements'}
          </h2>
          <div className="h-1 w-20 bg-brand-primary mx-auto rounded-full" />
          <p className="text-sm text-slate-500 dark:text-slate-400 font-light max-w-xl mx-auto">
            {lang === 'id'
              ? 'Ikuti perkembangan kegiatan belajar, peluncuran prasarana, serta pencapaian prestasi terhangat.'
              : 'Keep up with learning activities, campus launches, and local achievement highlights.'
            }
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-start">
          
          {/* Main Filter Tab list */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`px-4.5 py-2 text-xs sm:text-sm font-semibold rounded-2xl transition-all duration-300 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-brand-primary text-slate-950 shadow-md shadow-brand-primary/20'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Search */}
          <div className="lg:col-span-4 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={lang === 'id' ? 'Cari artikel berita...' : 'Search news articles...'}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
        </div>

        {/* News Grid Column Cards */}
        {currentItems.length > 0 ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentItems.map((article) => (
                <div
                  key={article.id}
                  className="group bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col justify-between"
                >
                  {/* Thumbnail header */}
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={article.thumbnail}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <span className="absolute top-4 left-4 bg-brand-primary text-slate-950 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md">
                      {article.category}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 sm:p-8 flex-grow flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-1.5 text-xs text-slate-400 dark:text-slate-500">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{article.date}</span>
                        <span className="mx-1">•</span>
                        <User className="h-3.5 w-3.5" />
                        <span>Admin</span>
                      </div>

                      <h3 className="font-display font-bold text-base sm:text-lg text-slate-800 dark:text-white leading-snug group-hover:text-brand-primary transition-colors line-clamp-2">
                        {article.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-light leading-relaxed line-clamp-3">
                        {article.summary}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                      <button
                        onClick={() => setActiveArticle(article)}
                        className="text-xs font-bold uppercase tracking-wider text-brand-primary group-hover:text-brand-orange transition-colors flex items-center space-x-1 cursor-pointer"
                      >
                        <span>{lang === 'id' ? 'Baca Selengkapnya' : 'Read Full Story'}</span>
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 pt-6">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-brand-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                </button>
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePageChange(idx + 1)}
                    className={`h-10 w-10 font-bold text-xs rounded-2xl transition-all ${
                      currentPage === idx + 1
                        ? 'bg-brand-primary text-slate-950 shadow-md shadow-brand-primary/20'
                        : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-brand-primary border border-transparent'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-brand-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {lang === 'id' ? 'Tidak ada berita yang cocok.' : 'No matching news updates found.'}
            </p>
          </div>
        )}
      </div>

      {/* Article Detail Full Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 bg-slate-950/85 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            {/* Thumbnail banner */}
            <div className="relative aspect-video">
              <img
                src={activeArticle.thumbnail}
                alt={activeArticle.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setActiveArticle(null)}
                className="absolute top-4 right-4 bg-slate-950/50 hover:bg-slate-950/85 text-white hover:text-brand-primary rounded-full p-2.5 text-sm font-bold z-10 transition-colors"
              >
                ✕
              </button>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent flex items-end p-6">
                <span className="bg-brand-primary text-slate-950 text-xs font-extrabold px-3 py-1.5 rounded-md uppercase tracking-widest">
                  {activeArticle.category}
                </span>
              </div>
            </div>

            {/* Read Content */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center space-x-3 text-xs text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-4">
                <Calendar className="h-4 w-4" />
                <span>{activeArticle.date}</span>
                <span className="mx-1">•</span>
                <User className="h-4 w-4" />
                <span>Ditulis oleh: Administrator</span>
              </div>

              <h3 className="font-display font-bold text-2xl sm:text-3xl text-slate-800 dark:text-white leading-tight">
                {activeArticle.title}
              </h3>

              {/* News Body Paragraphs */}
              <div className="space-y-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-light whitespace-pre-line">
                {activeArticle.content}
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setActiveArticle(null)}
                  className="px-6 py-2.5 bg-brand-primary text-white font-semibold text-xs rounded-xl uppercase tracking-wider transition-all"
                >
                  {lang === 'id' ? 'Selesai Membaca' : 'Close Reader'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
