import React from 'react';
import Guru from '../components/Guru';
import { SchoolContent } from '../types';
import { motion } from 'motion/react';

interface HalamanGuruProps {
  content: SchoolContent;
  lang: 'id' | 'en';
}

export default function HalamanGuru({ content, lang }: HalamanGuruProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-24"
    >
      <Guru items={content.guru} lang={lang} />
    </motion.div>
  );
}
