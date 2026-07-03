import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { SchoolContent } from './types';
import { defaultSchoolContent } from './data/defaultContent';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { useCMS } from './context/CMSContext';

// Component Imports
import Header from './components/Header';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import AdminCMS from './components/AdminCMS';
import AdminControlBar from './components/AdminControlBar';
import IntegratedCMSModal from './components/IntegratedCMSModal';
import BottomNav from './components/BottomNav';
import PopupBanner from './components/PopupBanner';
import TTSHandler from './components/TTSHandler';

// Page Imports
import Home from './pages/Home';
import ProfilSekolah from './pages/ProfilSekolah';
import StrukturOrganisasi from './pages/StrukturOrganisasi';
import Akademik from './pages/Akademik';
import Kalender from './pages/Kalender';
import HalamanGuru from './pages/HalamanGuru';
import PrestasiSiswa from './pages/PrestasiSiswa';
import PrestasiGuru from './pages/PrestasiGuru';
import PrestasiSekolah from './pages/PrestasiSekolah';
import HalamanGaleri from './pages/HalamanGaleri';
import HalamanBerita from './pages/HalamanBerita';
import HalamanSPMB from './pages/HalamanSPMB';
import HalamanKontak from './pages/HalamanKontak';
import HalamanFAQ from './pages/HalamanFAQ';
import HalamanPerpustakaan from './pages/HalamanPerpustakaan';
import HalamanUKS from './pages/HalamanUKS';
import HalamanDokumen from './pages/HalamanDokumen';
import HalamanEkskul from './pages/HalamanEkskul';
import HalamanSarana from './pages/HalamanSarana';

export default function App() {
  const { content, isLoggedIn, editMode } = useCMS();
  const [lang, setLang] = useState<'id' | 'en'>('id');
  const [showPopup, setShowPopup] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const isAdmin = location.pathname.startsWith('/admin');

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
    setShowPopup(false);
  }, [location.pathname]);

  const handleNavigateToAdmin = () => {
    navigate('/admin');
  };

  const handleBackToSite = () => {
    navigate('/beranda');
  };

  if (isAdmin) {
    if (isLoggedIn) {
      return <Navigate to="/beranda" replace />;
    }
    return (
      <AdminCMS 
        initialContent={content} 
        onBackToSite={handleBackToSite} 
      />
    );
  }

  return (
    <div className={`min-h-screen bg-brand-bg dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans selection:bg-brand-primary/30 selection:text-slate-900 overflow-x-hidden antialiased relative transition-all duration-300 pb-16 xl:pb-0 ${isLoggedIn ? 'pt-14' : ''}`}>
      <AdminControlBar />
      <Helmet>
        <title>{content.schoolName}</title>
        <meta name="description" content={content.heroSubtitle} />
      </Helmet>
      
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/20 dark:bg-brand-primary/5 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-orange/10 dark:bg-brand-orange/5 rounded-full blur-3xl pointer-events-none -z-10"></div>
      
      <Header 
        lang={lang} 
        setLang={setLang}
        schoolName={content.schoolName} 
        logoUrl={content.logoUrl}
      />

      <main className="relative">
        <AnimatePresence mode="wait">
          <Routes location={location}>
            <Route path="/" element={<Navigate to="/beranda" replace />} />
            <Route path="/beranda" element={<Home content={content} lang={lang} />} />
            <Route path="/profil" element={<ProfilSekolah content={content} lang={lang} />} />
            <Route path="/profil/struktur" element={<StrukturOrganisasi content={content} lang={lang} />} />
            <Route path="/profil/guru" element={<HalamanGuru content={content} lang={lang} />} />
            <Route path="/profil/perpustakaan" element={<HalamanPerpustakaan content={content} lang={lang} />} />
            <Route path="/profil/uks" element={<HalamanUKS content={content} lang={lang} />} />
            <Route path="/profil/dokumen" element={<HalamanDokumen lang={lang} />} />
            <Route path="/akademik" element={<Akademik content={content} lang={lang} />} />
            <Route path="/akademik/ekstrakurikuler" element={<HalamanEkskul content={content} lang={lang} />} />
            <Route path="/profil/sarana" element={<HalamanSarana content={content} lang={lang} />} />
            <Route path="/akademik/kalender" element={<Kalender content={content} lang={lang} />} />
            <Route path="/prestasi/siswa" element={<PrestasiSiswa content={content} lang={lang} />} />
            <Route path="/prestasi/guru" element={<PrestasiGuru content={content} lang={lang} />} />
            <Route path="/prestasi/sekolah" element={<PrestasiSekolah content={content} lang={lang} />} />
            <Route path="/galeri" element={<HalamanGaleri content={content} lang={lang} />} />
            <Route path="/berita" element={<HalamanBerita content={content} lang={lang} />} />
            <Route path="/spmb" element={<HalamanSPMB content={content} lang={lang} />} />
            <Route path="/kontak" element={<HalamanKontak content={content} lang={lang} />} />
            <Route path="/faq" element={<HalamanFAQ content={content} lang={lang} />} />
          </Routes>
        </AnimatePresence>
      </main>

      <Footer 
        schoolName={content.schoolName}
        npsn={content.npsn}
        alamat={content.contact.alamat}
        telepon={content.contact.telepon}
        email={content.contact.email}
        lang={lang}
        logoUrl={content.logoUrl}
        socials={content.contact.socials}
        onAdminClick={handleNavigateToAdmin}
      />

      <Chatbot lang={lang} />
      <BottomNav lang={lang} />
      <IntegratedCMSModal />
      <TTSHandler />
      {showPopup && content.popupBannerUrl && (
        <PopupBanner imageUrl={content.popupBannerUrl} onClose={() => setShowPopup(false)} />
      )}
    </div>
  );
}

