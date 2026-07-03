import React from 'react';
import { SchoolContent } from '../types';
import { motion } from 'motion/react';
import EditSectionOverlay from '../components/EditSectionOverlay';

interface Props {
  content: SchoolContent;
  lang: 'id' | 'en';
}

export default function HalamanSarana({ content, lang }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-20"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-display font-black text-slate-950 dark:text-white uppercase tracking-tight mb-12 text-center">
          {lang === 'id' ? 'Sarana dan Prasarana' : 'Facilities and Infrastructure'}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.sarana.map((item) => (
            <div key={item.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-md overflow-hidden border border-slate-100 dark:border-slate-700">
              <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{item.name}</h3>
                <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <EditSectionOverlay section="sarana" />
    </motion.div>
  );
}
