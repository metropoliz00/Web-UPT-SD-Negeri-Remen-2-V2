import React from 'react';
import { Mail, Instagram, Facebook, GraduationCap } from 'lucide-react';
import { GuruItem } from '../types';

interface GuruProps {
  items: GuruItem[];
  lang: 'id' | 'en';
}

export default function Guru({ items, lang }: GuruProps) {
  return (
    <section id="guru" className="py-24 bg-brand-bg/50 dark:bg-slate-950/20 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full">
            {lang === 'id' ? 'Guru dan Tenaga Kependidikan' : 'Our Educators'}
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-brand-navy dark:text-white tracking-tight">
            {lang === 'id' ? 'Dewan Guru & Tenaga Kependidikan Profesional' : 'Our Highly Certified & Caring Educators'}
          </h2>
          <div className="h-1 w-20 bg-brand-primary mx-auto rounded-full" />
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto">
            {lang === 'id'
              ? 'Dipimpin oleh figur berdedikasi tinggi serta guru wali kelas bersertifikasi kompetensi unggul.'
              : 'Led by dedicated administrators and teachers with specialized credentials.'
            }
          </p>
        </div>

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {items.map((guru) => (
            <div
              key={guru.id}
              className="group relative bg-white/40 dark:bg-slate-900 border border-white/60 dark:border-white/10 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:bg-white dark:hover:bg-slate-900/95 transition-all duration-500 cursor-pointer flex flex-col justify-between"
            >
              {/* Photo Area */}
              <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={guru.photo}
                  alt={guru.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                {/* Visual shade overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-85 transition-opacity" />

                {/* Hovering social tray overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-slate-900/90 backdrop-blur-sm flex justify-center space-x-3.5 z-10">
                  {guru.socials?.instagram && (
                    <a
                      href={`https://instagram.com/${guru.socials.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-white hover:text-brand-primary transition-colors"
                      title="Instagram"
                    >
                      <Instagram className="h-4.5 w-4.5" />
                    </a>
                  )}
                  {guru.socials?.facebook && (
                    <a
                      href={`https://facebook.com`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-white hover:text-brand-primary transition-colors"
                      title="Facebook"
                    >
                      <Facebook className="h-4.5 w-4.5" />
                    </a>
                  )}
                  {guru.socials?.email && (
                    <a
                      href={`mailto:${guru.socials.email}`}
                      className="p-1.5 text-white hover:text-brand-primary transition-colors"
                      title="Kirim Email"
                    >
                      <Mail className="h-4.5 w-4.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Text Card details */}
              <div className="p-5 flex-grow flex flex-col justify-between space-y-2">
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-sm sm:text-base text-brand-navy dark:text-white leading-tight group-hover:text-brand-primary transition-colors">
                    {guru.name}
                  </h3>
                  <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 px-1.5 py-0.5 rounded inline-block">
                    NIP. {guru.nip || '-'}
                  </p>
                  <p className="text-[11px] font-bold text-brand-orange uppercase tracking-widest leading-none pt-0.5">
                    {guru.role}
                  </p>
                </div>

                <div className="flex items-center space-x-1.5 pt-2 border-t border-slate-50 dark:border-slate-800 text-[10px] text-slate-400 dark:text-slate-500">
                  <GraduationCap className="h-3.5 w-3.5 text-slate-400" />
                  <span className="truncate font-light italic">{guru.subject}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
