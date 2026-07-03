import React from 'react';
import CalendarComponent from '../components/CalendarComponent';
import { SchoolContent } from '../types';
import { motion } from 'motion/react';

interface KalenderProps {
  content: SchoolContent;
  lang: 'id' | 'en';
}

export default function Kalender({ content, lang }: KalenderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-24 pb-12 px-4"
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-brand-navy dark:text-white">
          {lang === 'id' ? 'Kalender Agenda Sekolah' : 'School Agenda Calendar'}
        </h1>
        <CalendarComponent lang={lang} agenda={content.agenda} />
      </div>
    </motion.div>
  );
}
