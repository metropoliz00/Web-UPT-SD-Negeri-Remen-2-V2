import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, GraduationCap, ChevronDown, ChevronUp } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

interface HeaderProps {
  lang: 'id' | 'en';
  setLang: (val: 'id' | 'en') => void;
  schoolName: string;
  logoUrl: string;
}

export default function Header({ lang, setLang, schoolName, logoUrl }: HeaderProps) {
  const { isLoggedIn } = useCMS();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [expandedMobileMenus, setExpandedMobileMenus] = useState<Set<string>>(new Set());
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  interface MenuItem {
    path: string;
    labelId: string;
    labelEn: string;
    isExternal?: boolean;
    children?: {
      path: string;
      labelId: string;
      labelEn: string;
      isExternal?: boolean;
    }[];
  }

  const menuItems: MenuItem[] = [
    { path: '/beranda', labelId: 'Beranda', labelEn: 'Home' },
    { 
      path: '/profil', 
      labelId: 'Profil', 
      labelEn: 'Profile',
      children: [
        { path: '/profil', labelId: 'Profil Sekolah', labelEn: 'School Profile' },
        { path: '/profil/struktur', labelId: 'Struktur Organisasi', labelEn: 'Structure' },
        { path: '/profil/guru', labelId: 'GTK', labelEn: 'GTK' },
        { path: '/profil/perpustakaan', labelId: 'Perpustakaan', labelEn: 'Library' },
        { path: '/profil/uks', labelId: 'UKS', labelEn: 'UKS' },
        { path: '/profil/sarana', labelId: 'Sarana dan Prasarana', labelEn: 'Facilities' },
      ]
    },
    { 
      path: '/akademik', 
      labelId: 'Akademik', 
      labelEn: 'Academic',
      children: [
        { path: '/akademik', labelId: 'Program Akademik', labelEn: 'Academic Program' },
        { path: '/akademik/ekstrakurikuler', labelId: 'Ekstrakurikuler', labelEn: 'Extracurricular' },
        { path: '/akademik/kalender', labelId: 'Agenda Sekolah', labelEn: 'School Agenda' },
      ]
    },
    { 
      path: '/administrasi', 
      labelId: 'Administrasi', 
      labelEn: 'Administration',
      children: [
        { path: '/profil/dokumen', labelId: 'Dokumen', labelEn: 'Documents' },
        { path: 'https://sagara.uptsdnremen2.sch.id', labelId: 'Sagara', labelEn: 'Sagara', isExternal: true },
      ]
    },
    { 
      path: '/prestasi', 
      labelId: 'Prestasi', 
      labelEn: 'Achievements',
      children: [
        { path: '/prestasi/siswa', labelId: 'Prestasi Siswa', labelEn: 'Student Achievements' },
        { path: '/prestasi/guru', labelId: 'Prestasi Guru', labelEn: 'Teacher Achievements' },
        { path: '/prestasi/sekolah', labelId: 'Prestasi Sekolah', labelEn: 'School Achievements' },
      ]
    },
    { path: '/galeri', labelId: 'Galeri', labelEn: 'Gallery' },
    { path: '/spmb', labelId: 'SPMB', labelEn: 'Admissions' },
    { path: '/berita', labelId: 'Berita', labelEn: 'News' },
    { path: '/faq', labelId: 'FAQ', labelEn: 'FAQ' },
    { path: '/kontak', labelId: 'Kontak', labelEn: 'Contact' },
  ];

  return (
    <header
      id="main-header"
      className={`fixed ${isLoggedIn ? 'top-14' : 'top-0'} left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/75 dark:bg-slate-950/75 backdrop-blur-xl shadow-lg border-b border-white/40 dark:border-white/10 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo / Brand */}
          <Link 
            to="/beranda"
            onClick={() => setIsOpen(false)}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="h-12 w-12 bg-white rounded-xl shadow-md p-1.5 flex items-center justify-center group-hover:scale-105 transition-all duration-300 border border-slate-100">
              <img src={logoUrl} alt="Logo" className="h-full w-full object-contain" />
            </div>
            <div>
              <span className="font-display font-black text-sm sm:text-base text-brand-navy dark:text-white tracking-tight uppercase leading-tight block">
                {schoolName}
              </span>
              <span className="block text-xs font-bold text-brand-primary tracking-widest uppercase">
                20504759
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path || (item.children && item.children.some(child => child.path === location.pathname));
              if (item.isExternal) {
                return (
                  <a
                    key={item.path}
                    href={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 hover:text-brand-primary transition-colors duration-300"
                  >
                    {lang === 'id' ? item.labelId : item.labelEn}
                  </a>
                );
              }
              if (item.children) {
                return (
                  <div key={item.path} className="relative group">
                    <button
                      className={`relative px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors duration-300 flex items-center ${
                        isActive
                          ? 'text-brand-primary border-b-2 border-brand-primary'
                          : 'text-slate-600 dark:text-slate-300 hover:text-brand-primary'
                      }`}
                    >
                      {lang === 'id' ? item.labelId : item.labelEn}
                      <ChevronDown className="h-3 w-3 ml-1" />
                    </button>
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-slate-800 shadow-xl rounded-xl border border-slate-100 dark:border-slate-700 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                      {item.children.map(child => {
                        if (child.isExternal) {
                          return (
                            <a
                              key={child.path}
                              href={child.path}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block px-4 py-2 text-xs font-bold uppercase text-slate-600 dark:text-slate-300 hover:text-brand-primary hover:bg-slate-50 dark:hover:bg-slate-700"
                            >
                              {lang === 'id' ? child.labelId : child.labelEn}
                            </a>
                          );
                        }
                        return (
                          <Link
                            key={child.path}
                            to={child.path}
                            className="block px-4 py-2 text-xs font-bold uppercase text-slate-600 dark:text-slate-300 hover:text-brand-primary hover:bg-slate-50 dark:hover:bg-slate-700"
                          >
                            {lang === 'id' ? child.labelId : child.labelEn}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              }
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
                    isActive
                      ? 'text-brand-primary border-b-2 border-brand-primary'
                      : 'text-slate-600 dark:text-slate-300 hover:text-brand-primary'
                  }`}
                >
                  {lang === 'id' ? item.labelId : item.labelEn}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Widgets */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Multi Language */}
            <button
              onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={lang === 'id' ? 'Switch to English' : 'Ubah ke Bahasa Indonesia'}
            >
              <div className="flex items-center space-x-1 text-xs font-semibold">
                <Globe className="h-4 w-4 text-brand-primary" />
                <span className="uppercase">{lang}</span>
              </div>
            </button>
          </div>

          {/* Mobile Menu Trigger & Options */}
          <div className="xl:hidden flex items-center space-x-2">
            <button
              onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300"
            >
              <Globe className="h-5 w-5 text-brand-primary" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`xl:hidden fixed top-[64px] left-0 w-full bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 transition-all duration-300 shadow-xl overflow-hidden ${
          isOpen ? 'max-h-[500px] py-4 px-6 border-b' : 'max-h-0'
        }`}
      >
        <div className="flex flex-col space-y-3">
          {menuItems.map((item) => {
            if (item.isExternal) {
              return (
                <a
                  key={item.path}
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="text-left py-2 text-base font-medium text-slate-600 dark:text-slate-300 hover:text-brand-primary transition-colors"
                >
                  {lang === 'id' ? item.labelId : item.labelEn}
                </a>
              );
            }
            if (item.children) {
              const isExpanded = expandedMobileMenus.has(item.path);
              return (
                <div key={item.path} className="flex flex-col">
                  <button 
                    onClick={() => {
                        const next = new Set(expandedMobileMenus);
                        if (isExpanded) next.delete(item.path);
                        else next.add(item.path);
                        setExpandedMobileMenus(next);
                    }}
                    className="flex justify-between items-center text-left py-2 text-base font-bold text-slate-800 dark:text-white"
                  >
                    <span>{lang === 'id' ? item.labelId : item.labelEn}</span>
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  {isExpanded && (
                    <div className="flex flex-col pl-4 border-l-2 border-slate-200 dark:border-slate-700 ml-1 space-y-2 animate-in slide-in-from-top-2">
                        {item.children.map(child => {
                          if (child.isExternal) {
                            return (
                              <a
                                key={child.path}
                                href={child.path}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setIsOpen(false)}
                                className="text-left py-1 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-primary"
                              >
                                {lang === 'id' ? child.labelId : child.labelEn}
                              </a>
                            );
                          }
                          return (
                            <Link
                              key={child.path}
                              to={child.path}
                              onClick={() => setIsOpen(false)}
                              className={`text-left py-1 text-sm font-medium ${
                                location.pathname === child.path
                                  ? 'text-brand-primary'
                                  : 'text-slate-600 dark:text-slate-300 hover:text-brand-primary'
                              }`}
                            >
                              {lang === 'id' ? child.labelId : child.labelEn}
                            </Link>
                          );
                        })}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`text-left py-2 text-base font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'text-brand-primary pl-2 border-l-2 border-brand-primary'
                    : 'text-slate-600 dark:text-slate-300 hover:text-brand-primary'
                }`}
              >
                {lang === 'id' ? item.labelId : item.labelEn}
              </Link>
            );
          })}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-center gap-3">
          </div>
        </div>
      </div>
    </header>
  );
}

