import React from 'react';
import * as Icons from 'lucide-react';
import { EkstrakurikulerItem } from '../types';

interface EkstrakurikulerProps {
  items: EkstrakurikulerItem[];
  lang: 'id' | 'en';
}

export default function Ekstrakurikuler({ items, lang }: EkstrakurikulerProps) {
  // Map icons
  const renderIcon = (name: string) => {
    const IconComponent = (Icons as any)[name] || Icons.Sparkles;
    return <IconComponent className="h-7 w-7 text-brand-orange group-hover:text-white transition-colors duration-300" />;
  };

  return (
    <section id="ekstra" className="py-24 bg-white dark:bg-slate-950 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full">
            {lang === 'id' ? 'Pengembangan Diri' : 'Extracurriculars'}
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-800 dark:text-white tracking-tight">
            {lang === 'id' ? 'Ekstrakurikuler Guna Mengasah Karakter Unggul' : 'Our Rich & Diverse Extracurricular Activities'}
          </h2>
          <div className="h-1 w-20 bg-brand-orange mx-auto rounded-full" />
          <p className="text-sm text-slate-500 dark:text-slate-400 font-light max-w-xl mx-auto">
            {lang === 'id'
              ? 'Membekali kepemimpinan, sportivitas, daya kreativitas, dan rasa kemanusiaan siswa di luar jam akademik.'
              : 'Equipping leadership, sportsmanship, creativity, and humanitarian values in students beyond class hours.'
            }
          </p>
        </div>

        {/* Extracurricular grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-brand-orange/10 cursor-pointer overflow-hidden flex flex-col justify-between min-h-[180px]"
            >
              {/* Soft Orange Glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div className="space-y-4">
                {/* Icon wrapper */}
                <div className="h-12 w-12 rounded-xl bg-white dark:bg-slate-850 flex items-center justify-center shadow-md border border-slate-100 dark:border-slate-800 group-hover:bg-brand-orange group-hover:border-brand-orange transition-all duration-300 flex-shrink-0">
                  {renderIcon(item.iconName)}
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-display font-bold text-base sm:text-lg text-slate-800 dark:text-white group-hover:text-brand-orange transition-colors duration-300">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                    {item.description}
                  </p>
                  <div className="pt-2 text-[11px] space-y-1">
                    <p className="text-slate-700 dark:text-slate-300 font-medium">Pembina: {item.pembina}</p>
                    <p className="text-brand-orange font-bold">Waktu: {item.waktu}</p>
                  </div>
                </div>
              </div>

              {/* Bottom decorative arrow */}
              <div className="pt-2 text-[10px] font-bold text-brand-orange tracking-widest uppercase opacity-0 group-hover:opacity-100 translate-x-[-8px] group-hover:translate-x-0 transition-all duration-300">
                {lang === 'id' ? 'Gabung Klub' : 'Join Club'} →
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
