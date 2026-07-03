import React from 'react';
import Programs from '../components/Programs';
import Guru from '../components/Guru';
import { SchoolContent } from '../types';
import { motion } from 'motion/react';
import EditSectionOverlay from '../components/EditSectionOverlay';
import DocumentTable from '../components/DocumentTable';

interface AkademikProps {
  content: SchoolContent;
  lang: 'id' | 'en';
}

export default function Akademik({ content, lang }: AkademikProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-20"
    >
      <div className="relative">
        <Programs programs={content.programs} lang={lang} />
        <EditSectionOverlay section="programs" />
      </div>

      <div className="relative">
        <Guru items={content.guru} lang={lang} />
        <EditSectionOverlay section="guru" />
      </div>
      
      <div className="px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto pb-16">
        <DocumentTable dokumen={content.dokumen} title={lang === 'id' ? 'Dokumen Akademik' : 'Academic Documents'} />
      </div>
    </motion.div>
  );
}
