import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Profile from '../components/Profile';
import VirtualTour from '../components/VirtualTour';
import { SchoolContent } from '../types';
import { motion } from 'motion/react';
import EditSectionOverlay from '../components/EditSectionOverlay';
import DocumentTable from '../components/DocumentTable';

interface ProfilProps {
  content: SchoolContent;
  lang: 'id' | 'en';
}

export default function ProfilSekolah({ content, lang }: ProfilProps) {
  const location = useLocation();

  useEffect(() => {
    if (location.state && (location.state as any).scrollTo) {
      const targetId = (location.state as any).scrollTo;
      const timer = setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          const offset = 80;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = el.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [location]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-20"
    >
      <div className="relative">
        <Profile 
          headmasterName={content.headmasterName}
          headmasterTitle={content.headmasterTitle}
          headmasterSpeech={content.headmasterSpeech}
          headmasterPhoto={content.headmasterPhoto}
          timeline={content.historyTimeline}
          lang={lang}
          visi={content.visi}
          misi={content.misi}
          tujuan={content.tujuan}
        />
        <EditSectionOverlay section="profil" />
      </div>
      <VirtualTour lang={lang} />
      
      <div className="px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto pb-16">
        <DocumentTable dokumen={content.dokumen} title={lang === 'id' ? 'Dokumen Profil Sekolah' : 'School Profile Documents'} />
      </div>
    </motion.div>
  );
}
