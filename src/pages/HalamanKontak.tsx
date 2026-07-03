import React from 'react';
import Kontak from '../components/Kontak';
import { SchoolContent } from '../types';
import { motion } from 'motion/react';
import EditSectionOverlay from '../components/EditSectionOverlay';

interface KontakProps {
  content: SchoolContent;
  lang: 'id' | 'en';
}

export default function HalamanKontak({ content, lang }: KontakProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-20"
    >
      <div className="relative">
        <Kontak info={content.contact} lang={lang} />
        <EditSectionOverlay section="contact" />
      </div>
    </motion.div>
  );
}
