import React, { useState } from 'react';
import { ProgramItem } from '../types';
import { Search, Sparkles, BookOpen, Cpu, Globe, GraduationCap } from 'lucide-react';

interface ProgramsProps {
  programs: ProgramItem[];
  lang: 'id' | 'en';
}

export default function Programs({ programs, lang }: ProgramsProps) {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalProgram, setActiveModalProgram] = useState<ProgramItem | null>(null);

  // Extract unique categories
  const categories = ['Semua', ...Array.from(new Set(programs.map((p) => p.category)))];

  // Filtering Logic
  const filteredPrograms = programs.filter((p) => {
    const matchesCategory = selectedCategory === 'Semua' || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="program" className="py-24 bg-white dark:bg-slate-950/40 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full">
            {lang === 'id' ? 'Program Unggulan' : 'Featured Programs'}
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-brand-navy dark:text-white tracking-tight">
            {lang === 'id' ? 'Program Unggulan' : 'Featured Programs'}
          </h2>
          <div className="h-1 w-20 bg-brand-primary mx-auto rounded-full" />
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto">
            {lang === 'id'
              ? 'Menyiapkan keterampilan siswa menyongsong masa depan cerah melalui pembekalan komputasional, literasi global, dan keagamaan.'
              : 'Preparing students with future-ready skills through computational learning, global literacy, and spiritual development.'
            }
          </p>
        </div>

        {/* Filters and Search Bar Row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-300 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800 hover:border-brand-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'id' ? 'Cari program...' : 'Search program...'}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-full bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
        </div>

        {/* Programs Grid */}
        {filteredPrograms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrograms.map((program) => (
              <div
                key={program.id}
                className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col justify-between"
              >
                {/* Photo Header */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Category overlay */}
                  <span className="absolute top-4 left-4 bg-slate-900/80 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md backdrop-blur-sm">
                    {program.category}
                  </span>
                </div>

                {/* Card Info Content */}
                <div className="p-6 sm:p-8 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-display font-bold text-base sm:text-lg text-brand-navy dark:text-white group-hover:text-brand-primary transition-colors duration-300">
                      {program.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed line-clamp-3">
                      {program.description}
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveModalProgram(program)}
                    className="w-full text-center py-3 bg-slate-50 hover:bg-brand-primary/10 dark:bg-slate-800/50 dark:hover:bg-brand-primary/20 text-slate-700 dark:text-slate-200 hover:text-brand-primary font-semibold text-xs rounded-2xl tracking-wider uppercase transition-all cursor-pointer"
                  >
                    {lang === 'id' ? 'Detail Program' : 'Program Detail'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {lang === 'id' ? 'Tidak ada program yang cocok.' : 'No programs matched your search.'}
            </p>
          </div>
        )}
      </div>

      {/* Program Detail Modal */}
      {activeModalProgram && (
        <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="relative aspect-video">
              <img
                src={activeModalProgram.image}
                alt={activeModalProgram.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setActiveModalProgram(null)}
                className="absolute top-4 right-4 bg-slate-950/50 hover:bg-slate-950/85 text-white hover:text-brand-primary rounded-full p-2 text-sm font-bold z-10 transition-colors"
              >
                ✕
              </button>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent flex items-end p-6">
                <span className="bg-brand-primary text-slate-950 text-xs font-extrabold px-3 py-1 rounded-md uppercase tracking-widest">
                  {activeModalProgram.category}
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-4">
              <h3 className="font-display font-bold text-2xl text-slate-800 dark:text-white">
                {activeModalProgram.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                {activeModalProgram.description}
              </p>
              
              {/* Detailed Mock Curriculum Highlights inside modal */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800/50 space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Target & Kompetensi Lulusan:</h4>
                <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1.5 list-disc pl-4 font-light">
                  <li>Mengasah pola pikir analitis dan pemecahan masalah (Computational Thinking).</li>
                  <li>Kepercayaan diri penuh dalam melahirkan karya/projek inovatif.</li>
                  <li>Keseimbangan budi pekerti, integritas diri, dan kecakapan sosial.</li>
                  <li>Siap bersaing di jenjang sekolah menengah lanjutan berstandar internasional.</li>
                </ul>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setActiveModalProgram(null)}
                  className="px-6 py-2.5 bg-brand-primary text-white font-semibold text-xs rounded-xl uppercase tracking-wider transition-all"
                >
                  {lang === 'id' ? 'Selesai' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
