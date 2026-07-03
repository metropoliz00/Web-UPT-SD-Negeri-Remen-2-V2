import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, School, BookOpen, Image, Phone } from 'lucide-react';

interface BottomNavProps {
  lang: 'id' | 'en';
}

export default function BottomNav({ lang }: BottomNavProps) {
  const location = useLocation();

  const navItems = [
    {
      path: '/beranda',
      labelId: 'Beranda',
      labelEn: 'Home',
      icon: Home
    },
    {
      path: '/profil',
      labelId: 'Profil',
      labelEn: 'Profile',
      icon: School
    },
    {
      path: '/akademik',
      labelId: 'Akademik',
      labelEn: 'Academic',
      icon: BookOpen
    },
    {
      path: '/galeri',
      labelId: 'Galeri',
      labelEn: 'Gallery',
      icon: Image
    },
    {
      path: '/kontak',
      labelId: 'Kontak',
      labelEn: 'Contact',
      icon: Phone
    }
  ];

  return (
    <div id="mobile-bottom-nav" className="xl:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/60 dark:border-slate-800/60 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] z-[40] transition-transform duration-300">
      <div className="max-w-md mx-auto px-6 py-2.5 flex justify-between items-center">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          const label = lang === 'id' ? item.labelId : item.labelEn;

          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center space-y-1 py-1 px-3 rounded-2xl transition-all duration-300 relative group"
            >
              <div 
                className={`p-1.5 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-brand-primary/10 dark:bg-brand-primary/20 text-brand-primary scale-110' 
                    : 'text-slate-500 dark:text-slate-400 group-hover:text-brand-primary/80'
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span 
                className={`text-[10px] font-bold tracking-tight transition-colors duration-300 ${
                  isActive 
                    ? 'text-brand-primary font-black' 
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {label}
              </span>
              {isActive && (
                <span className="absolute -top-1 h-1 w-4 bg-brand-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
