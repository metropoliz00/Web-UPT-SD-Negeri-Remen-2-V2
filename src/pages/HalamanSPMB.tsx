import React from 'react';
import SPMB from '../components/SPMB';
import { SchoolContent } from '../types';
import { motion } from 'motion/react';
import EditSectionOverlay from '../components/EditSectionOverlay';

interface SPMBPageProps {
  content: SchoolContent;
  lang: 'id' | 'en';
}

export default function HalamanSPMB({ content, lang }: SPMBPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-20"
    >
      <div className="relative">
        <SPMB config={content.ppdb} lang={lang} />
        <EditSectionOverlay section="ppdb" />
      </div>
    </motion.div>
  );
}
