import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Play, Users, Award, Monitor, BookOpen, Volume2, Eye, GraduationCap, Home, Trophy } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { StatItem } from '../types';
import NumberCounter from './NumberCounter';
import { RollingCounter } from './RollingCounter';
import ClockWidget from './ClockWidget';
import WeatherWidget from './WeatherWidget';

export function formatIndonesianDate(dateStr: string): string {
  if (!dateStr) return '';
  const regex = /^(\d{4})-(\d{2})-(\d{2})$/;
  const match = dateStr.match(regex);
  if (match) {
    const year = match[1];
    const monthIndex = parseInt(match[2], 10) - 1;
    const day = parseInt(match[3], 10);
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    if (monthIndex >= 0 && monthIndex < 12) {
      return `${day} ${months[monthIndex]} ${year}`;
    }
  }
  return dateStr;
}

interface HeroProps {
  heroTitle: string;
  heroSubtitle: string;
  heroVideoUrlOrImage: string;
  heroCarousel: string[];
  motto: string;
  visionStatement: string;
  stats: StatItem[];
  lang: 'id' | 'en';
  runningText: string;
  runningTextSpeed: number;
}

export default function Hero({ 
  heroTitle, 
  heroSubtitle, 
  heroVideoUrlOrImage, 
  heroCarousel, 
  motto, 
  visionStatement, 
  stats, 
  lang,
  runningText,
  runningTextSpeed
}: HeroProps) {
  const navigate = useNavigate();
  const { visitorCount, content } = useCMS();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Combine single image and carousel images, filtering out empty strings
  const allImages = [
    ...(heroCarousel && heroCarousel.length > 0 ? heroCarousel : [heroVideoUrlOrImage])
  ].filter(img => img && img.trim() !== '');

  // Auto Slider
  useEffect(() => {
    if (allImages.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % allImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [allImages.length]);

  // Cycling Typing Effect
  useEffect(() => {
    const phrases = lang === 'id' ? [
      visionStatement || "Mewujudkan Generasi Cerdas, Berkarakter dan Berprestasi",
      motto || "RAMAH | Religius - Aktif - Maju - Aman - Humanis"
    ] : [
      "Molding Smart, Characterful & Highly Achieving Generations",
      "RAMAH | Religious - Active - Progressive - Safe - Humanist"
    ];

    const currentPhrase = phrases[phraseIdx];
    let timer: NodeJS.Timeout;

    if (isDeleting) {
      // Deleting character
      timer = setTimeout(() => {
        setTypedText((prev) => prev.slice(0, -1));
      }, 25);
    } else {
      // Typing character
      timer = setTimeout(() => {
        setTypedText(currentPhrase.slice(0, typedText.length + 1));
      }, 50);
    }

    // Logic to switch states
    if (!isDeleting && typedText === currentPhrase) {
      // Fully typed, pause then start deleting
      timer = setTimeout(() => setIsDeleting(true), 3500);
    } else if (isDeleting && typedText === '') {
      // Fully deleted, move to next phrase
      setIsDeleting(false);
      setPhraseIdx((prev) => (prev + 1) % phrases.length);
    }

    return () => clearTimeout(timer);
  }, [typedText, isDeleting, phraseIdx, lang]);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
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
  };

  // Map icon names
  const getStatIcon = (index: number) => {
    switch (index) {
      case 0: return <GraduationCap className="h-4 w-4 sm:h-5 w-5 text-brand-primary" />;
      case 1: return <Users className="h-4 w-4 sm:h-5 w-5 text-brand-orange" />;
      case 2: return <Home className="h-4 w-4 sm:h-5 w-5 text-emerald-500" />;
      case 3: return <Trophy className="h-4 w-4 sm:h-5 w-5 text-yellow-500" />;
      default: return <BookOpen className="h-4 w-4 sm:h-5 w-5 text-brand-navy" />;
    }
  };

  return (
    <section id="beranda" className="relative min-h-screen flex flex-col justify-between pt-16 overflow-hidden">
      {/* Top right widgets */}
      <div className="absolute top-32 right-4 z-50 flex gap-2">
        <WeatherWidget lang={lang} />
        <ClockWidget />
      </div>
      {/* Top Announcement Marquee Bar (Placed directly under the navbar, colored with bright theme colors - highly transparent) */}
      <div className="w-full bg-white/30 dark:bg-slate-950/30 border-b border-white/20 dark:border-brand-primary/10 text-brand-navy dark:text-white py-2 px-4 z-30 shadow-sm relative backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto flex items-center overflow-hidden">
          <div className="flex-shrink-0 bg-gradient-to-r from-brand-primary to-brand-primary/80 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md tracking-wider mr-3 shadow-sm flex items-center">
            <Volume2 className="h-3.5 w-3.5 mr-1 text-white animate-bounce" />
            {lang === 'id' ? 'Pengumuman' : 'Notice'}
          </div>
          <div className="relative w-full overflow-hidden whitespace-nowrap">
            <div 
              className="inline-block pl-4 text-xs font-semibold tracking-wide"
              style={{ 
                animation: `marquee ${runningTextSpeed || 25}s linear infinite`
              }}
            >
              {runningText}
            </div>
          </div>
        </div>
      </div>

      {/* Background Image Slider */}
      <div className="absolute inset-0 z-0">
        {allImages.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              idx === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url('${img}')` }}
          />
        ))}
        {/* Bright & Light Overlays & Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-transparent dark:from-slate-950/90 dark:via-slate-900/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-transparent to-transparent dark:from-slate-950" />
      </div>

      {/* Floating Particle Orbs */}
      <div className="absolute top-1/4 left-10 w-48 h-48 bg-brand-primary/20 rounded-full blur-3xl animate-float-slow z-10 pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-brand-orange/15 rounded-full blur-3xl animate-float-medium z-10 pointer-events-none" />

      {/* Hero Core Content */}
      <div className="relative z-20 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex-grow flex items-center pt-16 md:pt-24 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8">
            {/* Welcome Greeting Banner */}
            <div className="space-y-1.5 border-l-4 border-brand-primary pl-4 py-1">
              <span className="block text-xl sm:text-2xl md:text-3xl font-display font-bold text-brand-primary tracking-widest uppercase">
                {lang === 'id' ? 'Selamat Datang' : 'Welcome To'}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-black tracking-tight uppercase leading-tight">
                {lang === 'id' ? (
                  <>
                    <span className="bg-clip-text text-transparent bg-gradient-to-b from-blue-400 to-blue-600">Di</span>{' '}
                    <span className="bg-clip-text text-transparent bg-gradient-to-b from-yellow-300 to-yellow-600">UPT</span>{' '}
                    <span className="bg-clip-text text-transparent bg-gradient-to-b from-red-400 to-red-700">SD</span>{' '}
                    <span className="bg-clip-text text-transparent bg-gradient-to-b from-sky-400 to-sky-600">Negeri</span>{' '}
                    <span className="bg-clip-text text-transparent bg-gradient-to-b from-gray-600 to-gray-900">Remen</span>{' '}
                    <span className="bg-clip-text text-transparent bg-gradient-to-b from-yellow-300 to-yellow-600">2</span>
                  </>
                ) : 'At UPT SD Negeri Remen 2'}
              </h2>
            </div>

            {/* Core Stats Counter Section */}
            <div className="relative z-30 w-full">
              <div className="grid grid-cols-4 gap-1 sm:gap-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg rounded-2xl p-2 sm:p-4 border border-white/50 dark:border-white/10">
                {stats.map((stat, idx) => (
                  <div key={stat.id} className="text-center space-y-1 relative group px-0.5 sm:px-2 flex flex-col items-center justify-center">
                    {idx > 0 && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-6 sm:h-8 bg-slate-200 dark:bg-slate-800" />
                    )}
                    <div className="flex justify-center mb-0.5 group-hover:scale-110 transition-transform duration-300">
                      {getStatIcon(idx)}
                    </div>
                    <div className="font-display font-black text-xs sm:text-lg md:text-xl text-brand-navy dark:text-white leading-none">
                      <NumberCounter value={stat.value} />
                      {stat.suffix && <span className="text-brand-primary">{stat.suffix}</span>}
                    </div>
                    <div className="text-[7px] sm:text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider sm:tracking-widest leading-tight whitespace-normal break-words max-w-full">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="inline-flex items-center space-x-2 bg-brand-light/50 dark:bg-brand-primary/15 border border-brand-primary/30 rounded-full px-4 py-1.5 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-brand-primary animate-ping" />
              <span className="text-xs sm:text-sm font-bold text-brand-navy dark:text-brand-light tracking-widest uppercase">
                {lang === 'id' ? 'Sekolah Ramah' : 'Sekolah Ramah'}
              </span>
            </div>

            <div className="space-y-4">
              <h2 className="text-sm font-black uppercase tracking-widest text-brand-orange">{heroTitle}</h2>
              <h1 className={`font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.1] text-glow ${phraseIdx === 1 ? 'text-brand-primary' : 'text-brand-navy dark:text-white'}`}>
                {typedText}
                <span className="inline-block w-1.5 h-10 ml-1 bg-brand-primary animate-pulse" />
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-slate-500 dark:text-slate-300 font-medium max-w-xl leading-relaxed">
                {lang === 'id' ? heroSubtitle : "Integrating global technology curriculum, outstanding character, Adiwiyata environment, and deep local heritage."}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => navigate('/spmb')}
                className="group flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-brand-navy to-brand-primary hover:from-brand-primary hover:to-brand-navy text-white font-bold rounded-2xl shadow-xl shadow-blue-200 dark:shadow-none hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <span>{lang === 'id' ? 'Daftar SPMB Online' : 'Apply Admissions'}</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => navigate('/profil', { state: { scrollTo: 'virtual-tour' } })}
                className="group flex items-center justify-center space-x-2 px-8 py-4 bg-white dark:bg-white/15 border border-blue-100 dark:border-white/20 hover:border-blue-200 text-brand-navy dark:text-white font-bold rounded-2xl shadow-sm hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="p-1 bg-brand-light/30 dark:bg-white/20 rounded-lg">
                  <Play className="h-4 w-4 fill-brand-navy dark:fill-white text-brand-navy dark:text-white" />
                </div>
                <span>{lang === 'id' ? 'Virtual Tour 360°' : '360° Virtual Tour'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Live Info Dashboard Card (Bento element) */}
          <div className="lg:col-span-5 w-full">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="rounded-3xl p-6 sm:p-8 shadow-2xl relative border border-white/60 dark:border-white/10 bg-white/80 dark:bg-slate-950/45 text-slate-800 dark:text-white overflow-hidden backdrop-blur-md"
            >
              {/* Card top banner */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-brand-primary">{lang === 'id' ? 'Info Terkini' : 'Latest Info'}</span>
                <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-300 bg-slate-100 dark:bg-white/10 rounded-full px-3 py-1">
                  <Eye className="h-3.5 w-3.5 text-brand-primary" />
                  <span>Visitor: <strong className="font-semibold"><RollingCounter value={visitorCount} /></strong></span>
                </div>
              </div>

              <h3 className="font-display font-bold text-lg sm:text-xl mb-4 text-brand-navy dark:text-white">
                {lang === 'id' ? 'Agenda & Kegiatan Pekan Ini' : 'This Week\'s Agenda'}
              </h3>

              {/* Agenda Mini Schedule */}
              <div className="space-y-4">
                {content && content.agenda && content.agenda.length > 0 ? (
                  content.agenda.map((item, idx) => {
                    // Dynamic colorful styles for the agenda date badge
                    const getBadgeStyles = (color?: string, index: number = 0) => {
                      const effectiveColor = color && color !== 'primary' ? color : ['primary', 'orange', 'green', 'purple', 'rose'][index % 5];
                      switch (effectiveColor) {
                        case 'orange':
                          return 'bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/30';
                        case 'green':
                          return 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/30';
                        case 'purple':
                          return 'bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200/50 dark:border-purple-900/30';
                        case 'rose':
                          return 'bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/30';
                        case 'light':
                          return 'bg-sky-100 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-200/50 dark:border-sky-900/30';
                        case 'primary':
                        default:
                          return 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-900/30';
                      }
                    };

                    return (
                      <div 
                        key={item.id || idx} 
                        className="flex flex-col sm:flex-row sm:items-start space-y-2 sm:space-y-0 sm:space-x-3 p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-all duration-300"
                      >
                        <div className="flex-shrink-0">
                          <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-black tracking-tight whitespace-nowrap ${getBadgeStyles(item.color, idx)}`}>
                            {formatIndonesianDate(item.date)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-brand-navy dark:text-white leading-snug break-words">{item.title}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-300 mt-1 break-words">{item.description}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-400 italic text-center py-4">Belum ada agenda pekan ini</p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Styled custom CSS for marquee */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </section>
  );
}
