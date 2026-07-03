import React from 'react';
import Berita from '../components/Berita';
import { SchoolContent } from '../types';
import { motion } from 'motion/react';
import EditSectionOverlay from '../components/EditSectionOverlay';

interface BeritaProps {
  content: SchoolContent;
  lang: 'id' | 'en';
}

export default function HalamanBerita({ content, lang }: BeritaProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-20"
    >
      <div className="relative">
        <Berita items={content.berita} lang={lang} />
        <EditSectionOverlay section="berita" />
      </div>
    </motion.div>
  );
}
