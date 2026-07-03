import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, Facebook, Instagram, Youtube, HelpCircle, GraduationCap, ArrowRight, ShieldCheck, Globe, Music, ShieldAlert } from 'lucide-react';
import { isSupabaseConfigured } from '../supabase';

interface FooterProps {
  schoolName: string;
  npsn: string;
  alamat: string;
  telepon: string;
  email: string;
  lang: 'id' | 'en';
  logoUrl: string;
  socials: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    youtube?: string;
    website?: string;
  };
  onAdminClick?: () => void;
}

export default function Footer({ schoolName, npsn, alamat, telepon, email, lang, logoUrl, socials, onAdminClick }: FooterProps) {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const checkScrollTop = () => {
      if (!showScroll && window.scrollY > 400) {
        setShowScroll(true);
      } else if (showScroll && window.scrollY <= 400) {
        setShowScroll(false);
      }
    };

    window.addEventListener('scroll', checkScrollTop);
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, [showScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-b from-white via-brand-bg/40 to-brand-bg/80 dark:from-slate-900 dark:via-slate-950/40 dark:to-slate-950 text-slate-600 dark:text-slate-300 pt-16 pb-8 border-t border-brand-light/30 dark:border-white/5 relative z-10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top footer row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-16">
          
          {/* Col 1: Profil Singkat (4 span) */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/beranda" className="flex items-center space-x-3 cursor-pointer">
              <div className="h-14 w-14 bg-white rounded-xl p-2 shadow-sm border border-slate-100 flex items-center justify-center">
                <img src={logoUrl} alt="Logo" className="h-full w-full object-contain" />
              </div>
              <span className="font-display font-extrabold text-lg sm:text-xl text-brand-navy dark:text-white tracking-tight">
                {schoolName}
              </span>
            </Link>
            
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-light leading-relaxed">
              {lang === 'id'
                ? 'UPT SD Negeri Remen 2 Tuban berkomitmen mengintegrasikan pengajaran karakter dengan sarana prasarana digital demi mencetak generasi emas masa depan.'
                : 'UPT SD Negeri Remen 2 Tuban is committed to integrating characters with digital platforms to raise outstanding students.'
              }
            </p>

            {/* Social media icons */}
            <div className="flex items-center space-x-3.5 pt-2">
              {socials.website && (
                <a
                  href={socials.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center text-slate-500 dark:text-slate-400 hover:scale-105"
                  title="Website Sekolah"
                >
                  <Globe className="h-5 w-5" />
                </a>
              )}
              {socials.instagram && (
                <a
                  href={socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:text-white transition-all flex items-center justify-center text-slate-500 dark:text-slate-400 hover:scale-105"
                  title="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {socials.youtube && (
                <a
                  href={socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-[#FF0000] hover:text-white transition-all flex items-center justify-center text-slate-500 dark:text-slate-400 hover:scale-105"
                  title="YouTube"
                >
                  <Youtube className="h-5 w-5" />
                </a>
              )}
              {socials.tiktok && (
                <a
                  href={socials.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-black hover:text-white transition-all flex items-center justify-center text-slate-500 dark:text-slate-400 hover:scale-105"
                  title="TikTok"
                >
                  <Music className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Link Cepat (2 span) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-display font-bold text-sm text-brand-navy dark:text-white uppercase tracking-wider border-b border-brand-primary/20 dark:border-white/10 pb-2">
              {lang === 'id' ? 'Tautan Cepat' : 'Quick Navigation'}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-light">
              {[
                { path: '/beranda', label: lang === 'id' ? 'Beranda' : 'Home' },
                { path: '/profil', label: lang === 'id' ? 'Profil Sekolah' : 'School Profile' },
                { path: '/akademik', label: lang === 'id' ? 'Akademik' : 'Academic' },
                { path: '/prestasi', label: lang === 'id' ? 'Prestasi' : 'Achievements' },
                { path: '/spmb', label: lang === 'id' ? 'Pendaftaran' : 'Admissions' }
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="hover:text-brand-primary hover:translate-x-1 transition-all flex items-center space-x-2 cursor-pointer text-left w-full"
                  >
                    <span className="text-brand-primary font-bold">&rsaquo;</span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Layanan Digital (3 span) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-display font-bold text-sm text-brand-navy dark:text-white uppercase tracking-wider border-b border-brand-primary/20 dark:border-white/10 pb-2">
              {lang === 'id' ? 'Layanan Akademik' : 'Digital Services'}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-light">
              {[
                { label: 'Smart Classroom Hub', path: '/akademik' },
                { label: 'E-Learning Portal', path: '#' },
                { label: 'E-Raport Digital', path: '#' },
                { label: 'Perpustakaan Digital', path: '/akademik' },
                { label: 'Absensi Online', path: '#' },
                { label: 'Download Center', path: '#' }
              ].map((serv, idx) => (
                <li key={idx}>
                  <Link
                    to={serv.path}
                    className="hover:text-brand-primary hover:translate-x-1 transition-all flex items-center space-x-1"
                  >
                    <span>&rsaquo;</span>
                    <span>{serv.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Informasi Kontak (3 span) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-display font-bold text-sm text-brand-navy dark:text-white uppercase tracking-wider border-b border-brand-primary/20 dark:border-white/10 pb-2">
              {lang === 'id' ? 'Lokasi' : 'Contact Info'}
            </h4>
            <div className="flex flex-col gap-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-light leading-relaxed">
              <p className="flex flex-row items-start gap-2">
                <strong className="flex-none text-brand-navy dark:text-white text-[10px] uppercase font-bold tracking-wider">Alamat:</strong>
                <span className="flex-1">{alamat}</span>
              </p>
              <p className="flex flex-row items-start gap-2">
                <strong className="flex-none text-brand-navy dark:text-white text-[10px] uppercase font-bold tracking-wider">Telepon:</strong>
                <span className="flex-1">{telepon}</span>
              </p>
              <p className="flex flex-row items-start gap-2">
                <strong className="flex-none text-brand-navy dark:text-white text-[10px] uppercase font-bold tracking-wider">E-mail:</strong>
                <span className="flex-1">{email}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright footer bar */}
        <div className="pt-8 border-t border-brand-light/40 dark:border-white/5 flex flex-col items-center justify-center text-xs text-slate-400 dark:text-slate-500 font-light gap-4">
          <div className="space-y-1 text-center">
            <p>&copy; {new Date().getFullYear()} {schoolName}. All Rights Reserved.</p>
          </div>
          
          <div className="text-center flex flex-col items-center space-y-2">
            {!isSupabaseConfigured && (
              <div className="flex items-center space-x-1.5 px-2 py-0.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 rounded-full text-[9px] font-black text-amber-600 dark:text-amber-500 uppercase tracking-tighter">
                <ShieldAlert className="h-2.5 w-2.5" />
                <span>DB Offline</span>
              </div>
            )}
            <button
              onClick={() => onAdminClick && onAdminClick()}
              className="text-xs font-bold text-brand-navy dark:text-brand-light tracking-wide hover:text-brand-primary transition-colors cursor-pointer flex items-center space-x-1"
            >
              <ShieldCheck className="h-3 w-3" />
              <span>Dev | MeyGa</span>
            </button>
          </div>
        </div>
      </div>

      {/* Back To Top Floating button */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 h-12 w-12 bg-brand-primary text-slate-950 hover:bg-brand-orange hover:text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:-translate-y-1 cursor-pointer z-40 animate-bounce"
          title="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </footer>
  );
}

