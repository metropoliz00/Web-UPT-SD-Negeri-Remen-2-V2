import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCMS } from '../context/CMSContext';
import { ZoomIn, Eye, Download, AlertCircle, FileImage } from 'lucide-react';

export default function StrukturOrganisasi() {
  const { content } = useCMS();
  const [activeStructure, setActiveStructure] = useState<'sekolah' | 'komite'>('sekolah');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const imageUrl = activeStructure === 'sekolah'
    ? content.strukturSekolahImageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200'
    : content.strukturKomiteImageUrl || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1200';

  const titleText = activeStructure === 'sekolah' ? 'Struktur Organisasi Sekolah' : 'Struktur Komite Sekolah';

  return (
    <div id="halaman-struktur-organisasi" className="pt-20 pb-16 min-h-screen bg-brand-bg dark:bg-slate-950">
      {/* Cover / Hero Banner Section - super compact */}
      <div className="relative bg-gradient-to-r from-brand-navy to-slate-900 text-white overflow-hidden py-6 px-4 md:px-6 mb-8 rounded-b-[2rem] shadow-lg">
        {/* Floating circles decorative backdrop */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-40 h-40 bg-brand-primary/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-40 h-40 bg-brand-orange/10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-display font-black tracking-tight"
          >
            STRUKTUR ORGANISASI
          </motion.h1>
          <p className="text-sm md:text-lg font-medium text-slate-200 mt-2 max-w-md">
            UPT SD Negeri Remen 2
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Structure Switcher */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setActiveStructure('sekolah')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black tracking-widest uppercase transition-all duration-300 cursor-pointer ${
                activeStructure === 'sekolah'
                  ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              Struktur Sekolah
            </button>
            <button
              onClick={() => setActiveStructure('komite')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black tracking-widest uppercase transition-all duration-300 cursor-pointer ${
                activeStructure === 'komite'
                  ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/20'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              Struktur Komite
            </button>
          </div>
        </div>

        {/* Image Display Card */}
        <motion.div
          layoutId="structure-image-card"
          className="w-full border border-slate-200/80 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 shadow-xl overflow-hidden relative group p-4 sm:p-6"
        >
          <div className="flex flex-col items-center">
            {/* Header / Info inside card */}
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="text-center sm:text-left">
                <h2 className="text-lg font-display font-black text-slate-800 dark:text-white uppercase tracking-tight">
                  {titleText}
                </h2>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFullscreen(true)}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                >
                  <ZoomIn className="h-4 w-4 text-brand-primary" />
                </button>
                <a
                  href={imageUrl}
                  target="_blank"
                  rel="noreferrer"
                  download={activeStructure === 'sekolah' ? 'struktur_sekolah.jpg' : 'struktur_komite.jpg'}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                >
                  <Download className="h-4 w-4 text-brand-orange" />
                </a>
              </div>
            </div>

            {/* Interactive Image Display */}
            <div 
              onClick={() => setIsFullscreen(true)}
              className="w-full relative rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 cursor-zoom-in group/image flex justify-center items-center min-h-[300px] sm:min-h-[450px]"
            >
              <img
                src={imageUrl}
                alt={titleText}
                referrerPolicy="no-referrer"
                className="max-h-[600px] object-contain transition-transform duration-500 group-hover/image:scale-[1.01]"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200';
                }}
              />
              
              {/* Floating Overlay on Hover */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="px-5 py-2.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl text-slate-800 dark:text-white text-xs font-bold shadow-lg flex items-center gap-2">
                  <Eye className="h-4 w-4 text-brand-primary" />
                  <span>Klik untuk Melihat Ukuran Penuh</span>
                </div>
              </div>
            </div>

            {/* Decorative Legend/Footer */}
            <div className="w-full mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            </div>
          </div>
        </motion.div>
      </div>

      {/* Lightbox / Zoom Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6"
            onClick={() => setIsFullscreen(false)}
          >
            {/* Top Bar inside Modal */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 text-white">
              <span className="text-sm font-bold bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 uppercase tracking-widest">
                {titleText}
              </span>
              <button
                onClick={() => setIsFullscreen(false)}
                className="h-10 w-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer border border-white/10"
              >
                <span className="text-xl font-black">&times;</span>
              </button>
            </div>

            {/* Image Container with Zoom support or scroll */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="max-w-7xl max-h-[85vh] w-full h-full flex items-center justify-center relative p-4"
              onClick={(e) => e.stopPropagation()} // Prevent close on clicking image container
            >
              <img
                src={imageUrl}
                alt={titleText}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-full object-contain rounded-xl shadow-2xl border border-white/5"
              />
            </motion.div>

            {/* Hint at the bottom */}
            <div className="absolute bottom-6 text-center text-white/50 text-[10px] font-bold uppercase tracking-widest pointer-events-none bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/5">
              Klik area di luar gambar untuk menutup
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
