import React from 'react';
import Hero from '../components/Hero';
import Keunggulan from '../components/Keunggulan';
import Berita from '../components/Berita';
import Testimoni from '../components/Testimoni';
import SPMB from '../components/SPMB';
import { SchoolContent } from '../types';
import { motion } from 'motion/react';
import EditSectionOverlay from '../components/EditSectionOverlay';

interface HomeProps {
  content: SchoolContent;
  lang: 'id' | 'en';
}

export default function Home({ content, lang }: HomeProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <Hero 
          heroTitle={content.heroTitle} 
          heroSubtitle={content.heroSubtitle} 
          heroVideoUrlOrImage={content.heroVideoUrlOrImage}
          heroCarousel={content.heroCarousel}
          motto={content.motto}
          visionStatement={content.visionStatement}
          stats={content.stats} 
          lang={lang} 
          runningText={content.runningText}
          runningTextSpeed={content.runningTextSpeed}
        />
        <EditSectionOverlay section="hero" />
      </div>

      <div className="relative">
        <Keunggulan items={content.keunggulan} lang={lang} />
        <EditSectionOverlay section="keunggulan" />
      </div>

      <div className="relative">
        <Berita items={content.berita.slice(0, 3)} lang={lang} />
        <EditSectionOverlay section="berita" />
      </div>

      <div className="relative">
        <Testimoni items={content.testimoni} lang={lang} />
        <EditSectionOverlay section="testimoni" />
      </div>

      <div className="relative">
        <SPMB config={content.ppdb} lang={lang} />
        <EditSectionOverlay section="ppdb" />
      </div>
    </motion.div>
  );
}
