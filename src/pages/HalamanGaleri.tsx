import React from 'react';
import Galeri from '../components/Galeri';
import VideoSekolah from '../components/VideoSekolah';
import { SchoolContent } from '../types';
import { motion } from 'motion/react';
import EditSectionOverlay from '../components/EditSectionOverlay';

interface GaleriProps {
  content: SchoolContent;
  lang: 'id' | 'en';
}

export default function HalamanGaleri({ content, lang }: GaleriProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-20"
    >
      <div className="relative">
        <Galeri items={content.galeri} lang={lang} />
        <EditSectionOverlay section="galeri" />
      </div>
      <div className="relative">
        <VideoSekolah lang={lang} />
        <EditSectionOverlay section="videos" />
      </div>
    </motion.div>
  );
}
