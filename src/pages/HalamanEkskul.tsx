import React from 'react';
import Ekstrakurikuler from '../components/Ekstrakurikuler';
import { SchoolContent } from '../types';
import { motion } from 'motion/react';
import EditSectionOverlay from '../components/EditSectionOverlay';

interface Props {
  content: SchoolContent;
  lang: 'id' | 'en';
}

export default function HalamanEkskul({ content, lang }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-20"
    >
      <div className="relative">
        <Ekstrakurikuler items={content.ekstrakurikuler} lang={lang} />
        {/* Ekstrakurikuler Structure Section */}
        <div className="pb-16 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-950 dark:text-white uppercase tracking-tight">
              {lang === 'id' ? 'Struktur Organisasi Ekstrakurikuler' : 'Extracurricular Organization Structure'}
            </h2>
            <div className="h-1.5 w-16 bg-brand-orange rounded-full mx-auto mt-3"></div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg p-6 border border-slate-100 dark:border-slate-700/60">
             <img 
              src={content.strukturEkskulImageUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200'}
              alt="Struktur Ekstrakurikuler"
              className="w-full rounded-2xl object-contain"
              referrerPolicy="no-referrer"
             />
          </div>
        </div>
        <EditSectionOverlay section="ekskul" />
      </div>
    </motion.div>
  );
}
