import React from 'react';
import { useCMS } from '../context/CMSContext';
import { motion } from 'motion/react';
import DocumentTable from '../components/DocumentTable';

export default function HalamanDokumen({ lang }: { lang: 'id' | 'en' }) {
  const { content } = useCMS();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-24 pb-16 min-h-screen bg-slate-50 dark:bg-slate-950"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <DocumentTable dokumen={content.dokumen} title={lang === 'id' ? 'Dokumen Sekolah' : 'School Documents'} />
      </div>
    </motion.div>
  );
}
