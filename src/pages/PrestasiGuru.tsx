import React from 'react';
import Prestasi from '../components/Prestasi';
import { SchoolContent } from '../types';
import { motion } from 'motion/react';
import EditSectionOverlay from '../components/EditSectionOverlay';

interface Props {
  content: SchoolContent;
  lang: 'id' | 'en';
}

export default function PrestasiGuru({ content, lang }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-20"
    >
      <div className="relative">
        <Prestasi items={content.prestasi} lang={lang} defaultCategory="Guru" />
        <EditSectionOverlay section="prestasi" />
      </div>
    </motion.div>
  );
}
