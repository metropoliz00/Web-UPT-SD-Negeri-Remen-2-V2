import React from 'react';
import FAQ from '../components/FAQ';
import { SchoolContent } from '../types';
import { motion } from 'motion/react';
import EditSectionOverlay from '../components/EditSectionOverlay';

interface FAQPageProps {
  content: SchoolContent;
  lang: 'id' | 'en';
}

export default function HalamanFAQ({ content, lang }: FAQPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-20"
    >
      <div className="relative">
        <FAQ items={content.faq} lang={lang} />
        <EditSectionOverlay section="faq" />
      </div>
    </motion.div>
  );
}
