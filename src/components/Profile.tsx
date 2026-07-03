import React, { useState } from 'react';
import { Calendar, Award, BookOpen, Clock, Heart, Users, CheckCircle } from 'lucide-react';
import { TimelineEvent } from '../types';

interface ProfileProps {
  headmasterName: string;
  headmasterTitle: string;
  headmasterSpeech: string;
  headmasterPhoto: string;
  timeline: TimelineEvent[];
  lang: 'id' | 'en';
  visi: string;
  misi: string;
  tujuan: string;
}

export default function Profile({ headmasterName, headmasterTitle, headmasterSpeech, headmasterPhoto, timeline, lang, visi, misi, tujuan }: ProfileProps) {
  const [isSpeechExpanded, setIsSpeechExpanded] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Split speech into paragraphs
  const paragraphs = headmasterSpeech.split('\n\n');
  const initialParagraphs = paragraphs.slice(0, 2);
  const remainingParagraphs = paragraphs.slice(2);

  return (
    <section id="profil" className="py-24 bg-slate-50 dark:bg-slate-900/30 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full inline-block mb-1">
            {lang === 'id' ? 'Profil Sekolah' : 'School Profile'}
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-brand-navy dark:text-white tracking-tight">
            {lang === 'id' ? 'Selayang Pandang UPT SD Negeri Remen 2' : 'Overview of UPT SD Negeri Remen 2'}
          </h2>
          
          <div className="flex justify-center mt-2 pb-2">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-bold rounded-full shadow-sm">
              <Award className="h-4.5 w-4.5" />
              {lang === 'id' ? 'Akreditasi: BAIK (B)' : 'Accreditation: GOOD (B)'}
            </span>
          </div>

          <div className="h-1 w-20 bg-brand-primary mx-auto rounded-full" />
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Interactive School Video Thumbnail & History Timeline */}
          <div className="lg:col-span-6 space-y-8">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group cursor-pointer aspect-video" onClick={() => setShowVideoModal(true)}>
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200"
                alt="Siswa SD Negeri Remen 2"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent flex items-center justify-center" />
              
              {/* Play Button Widget */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-20 w-20 bg-brand-primary/90 text-white rounded-full flex items-center justify-center shadow-2xl group-hover:bg-brand-primary transition-all duration-300 group-hover:scale-110">
                  <span className="block border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[18px] border-l-white ml-1.5" />
                </div>
              </div>

              {/* Bottom tag */}
              <div className="absolute bottom-4 left-6">
                <span className="text-xs font-extrabold tracking-widest uppercase bg-brand-orange text-white px-3 py-1 rounded-md">
                  {lang === 'id' ? 'Video Profil 2026' : 'School Profile Video'}
                </span>
                <p className="text-xs text-slate-200 mt-1 font-semibold">{lang === 'id' ? 'Saksikan sekilas lingkungan belajar kami' : 'Take a glimpse at our school environment'}</p>
              </div>
            </div>

            {/* School History Timeline Section */}
            <div className="space-y-6">
              <h3 className="font-display font-semibold text-xl text-slate-800 dark:text-white flex items-center space-x-2">
                <Clock className="h-5.5 w-5.5 text-brand-primary" />
                <span>{lang === 'id' ? 'Linimasa Sejarah Sekolah' : 'Historical Timeline'}</span>
              </h3>

              {/* Vertical Timeline Tree */}
              <div className="relative pl-6 border-l border-brand-primary/30 space-y-6">
                {timeline.map((item, idx) => (
                  <div key={item.id} className="relative group">
                    {/* Circle Node indicator */}
                    <div className="absolute -left-[31px] top-1 h-4.5 w-4.5 rounded-full bg-white dark:bg-slate-900 border-2 border-brand-primary group-hover:bg-brand-primary transition-all duration-300 shadow-md flex items-center justify-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-brand-primary group-hover:bg-white" />
                    </div>
                    <div>
                      <span className="inline-block text-xs font-extrabold text-brand-primary bg-brand-primary/10 rounded px-2 py-0.5 mb-1 tracking-wider">
                        {item.year}
                      </span>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-white leading-tight">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed font-light">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Headmaster Welcoming Message (Sambutan) */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="h-48 w-32 rounded-2xl overflow-hidden shadow-md flex-shrink-0 border-2 border-brand-primary">
                <img
                  src={headmasterPhoto}
                  alt={headmasterName}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div>
                <p className="text-xs text-brand-orange font-bold tracking-widest uppercase mb-1">
                  {headmasterTitle}
                </p>
                <h3 className="font-display font-black text-xl text-brand-navy dark:text-white">
                  {headmasterName}
                </h3>
              </div>
            </div>

            {/* Welcoming Speech Content */}
            <div className="space-y-4 text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-light">
              {/* Initial static text */}
              {initialParagraphs.map((p, idx) => (
                <p key={idx} className="whitespace-pre-line">{p}</p>
              ))}

              {/* Expander Container */}
              <div className={`transition-all duration-700 ease-in-out overflow-hidden ${
                isSpeechExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="space-y-4 pt-4">
                  {remainingParagraphs.map((p, idx) => (
                    <p key={idx} className="whitespace-pre-line">{p}</p>
                  ))}
                </div>
              </div>

              {/* Expand Toggle Trigger Button */}
              <button
                onClick={() => setIsSpeechExpanded(!isSpeechExpanded)}
                className="mt-2 text-xs font-bold uppercase tracking-wider text-brand-primary hover:text-brand-orange flex items-center space-x-1 cursor-pointer transition-colors"
              >
                <span>{isSpeechExpanded ? (lang === 'id' ? 'Tutup Selengkapnya' : 'Read Less') : (lang === 'id' ? 'Baca Sambutan Lengkap' : 'Read Full Speech')}</span>
                <span className="text-lg leading-none">{isSpeechExpanded ? '↑' : '↓'}</span>
              </button>
            </div>

            {/* Quote of the School */}
            <div className="p-4 bg-brand-cream/40 dark:bg-slate-800/50 rounded-2xl border-l-4 border-brand-orange">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-orange block mb-1">
                {lang === 'id' ? 'Motto Sekolah' : 'School Motto'}
              </span>
              <p className="font-display font-medium text-slate-800 dark:text-white italic text-xs sm:text-sm">
                "{lang === 'id' 
                  ? 'Menyemai Karakter Mulia, Membuka Jendela Dunia Berbasis Literasi Digital, untuk Hari Esok yang Gemilang.' 
                  : 'Sowing Noble Character, Opening the World Windows via Digital Literacy, for a Glorious Tomorrow.'
                }"
              </p>
            </div>
          </div>
        </div>

        {/* Vision, Mission, & Goals Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Visi */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="h-14 w-14 bg-brand-primary/10 rounded-2xl flex items-center justify-center mb-6">
              <Award className="h-8 w-8 text-brand-primary" />
            </div>
            <h3 className="font-display font-black text-2xl text-brand-navy dark:text-white mb-4">
              {lang === 'id' ? 'Visi Sekolah' : 'School Vision'}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium italic">
              "{visi}"
            </p>
          </div>

          {/* Misi */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="h-14 w-14 bg-brand-orange/10 rounded-2xl flex items-center justify-center mb-6">
              <CheckCircle className="h-8 w-8 text-brand-orange" />
            </div>
            <h3 className="font-display font-black text-2xl text-brand-navy dark:text-white mb-4">
              {lang === 'id' ? 'Misi Sekolah' : 'School Mission'}
            </h3>
            <ol className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed space-y-3 list-decimal pl-5">
              {misi.split('\n').filter(line => line.trim()).map((line, idx) => (
                <li key={idx} className="pl-1">
                  {line.replace(/^\d+[\.\)]\s*/, '')}
                </li>
              ))}
            </ol>
          </div>

          {/* Tujuan */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="h-14 w-14 bg-brand-navy/10 dark:bg-white/10 rounded-2xl flex items-center justify-center mb-6">
              <BookOpen className="h-8 w-8 text-brand-navy dark:text-white" />
            </div>
            <h3 className="font-display font-black text-2xl text-brand-navy dark:text-white mb-4">
              {lang === 'id' ? 'Tujuan Sekolah' : 'School Goals'}
            </h3>
            <ol className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed space-y-3 list-decimal pl-5">
              {tujuan.split('\n').filter(line => line.trim()).map((line, idx) => (
                <li key={idx} className="pl-1">
                  {line.replace(/^\d+[\.\)]\s*/, '')}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* Profile Video Modal Container */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-slate-950/90 flex items-center justify-center p-4 z-50">
          <div className="relative w-full max-w-4xl bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute top-4 right-4 text-white hover:text-brand-primary text-xl font-bold p-2 z-50"
            >
              ✕
            </button>
            <div className="aspect-video w-full">
              {/* Responsive embed video placeholder */}
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="Video Profil Sekolah"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
