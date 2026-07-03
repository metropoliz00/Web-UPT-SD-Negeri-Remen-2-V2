import React from 'react';
import * as Icons from 'lucide-react';
import { KeunggulanItem } from '../types';

interface KeunggulanProps {
  items: KeunggulanItem[];
  lang: 'id' | 'en';
}

export default function Keunggulan({ items, lang }: KeunggulanProps) {
  // Dynamically resolve lucide icons
  const renderIcon = (name: string) => {
    // Fallback to Sparkles if not found
    const IconComponent = (Icons as any)[name] || Icons.Sparkles;
    return <IconComponent className="h-6 w-6 text-brand-primary group-hover:text-white transition-colors duration-300" />;
  };

  return (
    <section id="keunggulan" className="py-24 bg-brand-bg/50 dark:bg-slate-950/20 relative overflow-hidden">
      {/* Decorative vector assets */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-light/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-cream/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full">
            {lang === 'id' ? 'Mengapa Memilih Kami' : 'Why Choose Us'}
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-brand-navy dark:text-white tracking-tight">
            {lang === 'id' ? (
              <>
                Keunggulan Pembelajaran<br />
                UPT SD Negeri Remen 2
              </>
            ) : 'Our Premier Learning Advantages'}
          </h2>
          <div className="h-1 w-20 bg-brand-orange mx-auto rounded-full" />
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto">
            {lang === 'id' 
              ? 'Kami berkomitmen menyelaraskan sarana modern dengan keteladanan budi pekerti guna mencetak generasi tangguh.'
              : 'Our commitment is syncing modern learning tools with character building for a resilient generation.'
            }
          </p>
        </div>

        {/* 6 Grid Interactive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white/40 dark:bg-slate-900/60 backdrop-blur border border-white/60 dark:border-white/10 rounded-3xl p-6 sm:p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:bg-white dark:hover:bg-slate-900/95 cursor-pointer overflow-hidden flex flex-col justify-between"
            >
              {/* Colored Glow overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              <div className="space-y-4">
                {/* Icon Circle */}
                <div className="h-12 h-12 w-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-md border border-slate-100 dark:border-slate-700 group-hover:bg-brand-primary group-hover:border-brand-primary transition-all duration-300">
                  <div className="group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                    {renderIcon(item.iconName)}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-display font-bold text-base sm:text-lg text-brand-navy dark:text-white group-hover:text-brand-primary transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Bottom decorative arrow */}
              <div className="pt-4 flex items-center space-x-1.5 text-brand-primary text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                <span>{lang === 'id' ? 'Info Detail' : 'More Detail'}</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
