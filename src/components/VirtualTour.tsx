import React, { useState } from 'react';
import { Eye, Map, Compass, RotateCcw, Sparkles } from 'lucide-react';

interface TourLocation {
  id: string;
  name: string;
  desc: string;
  embedUrl: string;
  photoUrl: string;
}

const locations: TourLocation[] = [
  {
    id: "loc_1",
    name: "Halaman Utama & Lapangan Adiwiyata",
    desc: "Area lapangan olahraga dan upacara yang dikelilingi oleh pepohonan rindang nan asri Desa Remen.",
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15843.43577363409!2d112.00164825!3d-6.8526543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e77bfd0f39fbdb7%3A0xbc2a69074092bbf1!2sRemen%2C%20Jenu%2C%20Tuban%20Regency%2C%20East%20Java!5e0!3m2!1sen!2sid!4v1719600000000!5m2!1sen!2sid",
    photoUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1200"
  },
  {
    id: "loc_2",
    name: "Ruang Smart Classroom Kelas 5",
    desc: "Pembelajaran berbasis IT terpadu dilengkapi papan tulis interaktif (Interactive Flat Panel) & tablet murid.",
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15843.43577363409!2d112.00164825!3d-6.8526543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e77bfd0f39fbdb7%3A0xbc2a69074092bbf1!2sRemen%2C%20Jenu%2C%20Tuban%20Regency%2C%20East%20Java!5e0!3m2!1sen!2sid!4v1719600000000!5m2!1sen!2sid",
    photoUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1200"
  },
  {
    id: "loc_3",
    name: "Laboratorium Komputer & Coding Club",
    desc: "Pusat kreasi pemrograman Scratch, dasar robotik, dan pembelajaran literasi-numerasi digital siswa.",
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15843.43577363409!2d112.00164825!3d-6.8526543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e77bfd0f39fbdb7%3A0xbc2a69074092bbf1!2sRemen%2C%20Jenu%2C%20Tuban%20Regency%2C%20East%20Java!5e0!3m2!1sen!2sid!4v1719600000000!5m2!1sen!2sid",
    photoUrl: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=1200"
  }
];

export default function VirtualTour({ lang }: { lang: 'id' | 'en' }) {
  const [activeLoc, setActiveLoc] = useState<TourLocation>(locations[0]);
  const [isPanoramicMode, setIsPanoramicMode] = useState(false);

  return (
    <section id="virtual-tour" className="py-24 bg-white dark:bg-slate-950 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full">
            {lang === 'id' ? 'Tur Sekolah 360°' : 'Virtual Exploration'}
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-800 dark:text-white tracking-tight">
            {lang === 'id' ? 'Jelajahi Sudut Sekolah Melalui Virtual Tour 360°' : 'Explore Our School Corners in 360° Panorama'}
          </h2>
          <div className="h-1 w-20 bg-brand-orange mx-auto rounded-full" />
          <p className="text-sm text-slate-500 dark:text-slate-400 font-light max-w-xl mx-auto">
            {lang === 'id'
              ? 'Melihat langsung fasilitas kami secara imersif 360 derajat di mana saja Anda berada.'
              : 'Take a fully-immersive 360 virtual stroll through our classrooms and yards from anywhere.'
            }
          </p>
        </div>

        {/* Tour Viewer Window Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Main Viewer Column */}
          <div className="lg:col-span-8 space-y-4 flex flex-col justify-between">
            <div className="relative aspect-video bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex-grow group">
              
              {/* If panoramic mode toggle is on, show simulation screen, else show Map Street view embed */}
              {isPanoramicMode ? (
                <div className="absolute inset-0 w-full h-full">
                  <img
                    src={activeLoc.photoUrl}
                    alt={activeLoc.name}
                    className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-[10s] ease-linear group-hover:scale-110"
                    style={{ transformOrigin: 'center' }}
                  />
                  {/* Panoramic overlay indicator */}
                  <div className="absolute inset-0 bg-slate-950/20 flex flex-col justify-between p-6">
                    <div className="flex justify-between items-center">
                      <span className="bg-brand-orange text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full flex items-center">
                        <Compass className="h-3.5 w-3.5 mr-1 animate-spin" />
                        360° Pan-Simulation Mode
                      </span>
                    </div>
                    
                    <div className="flex justify-center space-x-2 text-slate-200">
                      <span className="text-xs bg-slate-900/80 px-3.5 py-1.5 rounded-full backdrop-blur-sm shadow-md flex items-center">
                        ↔ {lang === 'id' ? 'Arahkan kursor ke gambar untuk zoom sensorik' : 'Hover images for sensory zoom effect'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Google Streetview / Map Embed iframe */
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={activeLoc.embedUrl}
                  title={activeLoc.name}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              )}

              {/* Central crosshair pointer */}
              {isPanoramicMode && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="h-10 w-10 border-2 border-dashed border-white/50 rounded-full flex items-center justify-center">
                    <div className="h-1 w-1 bg-white rounded-full" />
                  </div>
                </div>
              )}
            </div>

            {/* Viewer Bottom bar controls */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h4 className="text-xs text-brand-orange font-bold uppercase tracking-widest leading-none">Viewpoint:</h4>
                <h3 className="font-display font-bold text-slate-800 dark:text-white mt-1 text-sm sm:text-base leading-tight">
                  {activeLoc.name}
                </h3>
                <p className="text-xs text-slate-400 font-light mt-1 max-w-md leading-relaxed">{activeLoc.desc}</p>
              </div>

              {/* View mode toggle */}
              <button
                onClick={() => setIsPanoramicMode(!isPanoramicMode)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center cursor-pointer ${
                  isPanoramicMode
                    ? 'bg-brand-orange text-white shadow-md shadow-brand-orange/20'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-brand-orange hover:text-white'
                }`}
              >
                <Compass className="h-4 w-4 mr-1.5" />
                <span>{isPanoramicMode ? 'Street Map Mode' : 'Panoramic Mode'}</span>
              </button>
            </div>
          </div>

          {/* Location Selector Sidebar Column */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="font-display font-semibold text-xs uppercase tracking-widest text-slate-400 flex items-center space-x-2">
              <Map className="h-4.5 w-4.5 text-brand-orange" />
              <span>{lang === 'id' ? 'Pilih Ruang & Lokasi' : 'Choose Campus Point'}</span>
            </h3>

            <div className="space-y-3">
              {locations.map((loc) => {
                const isActive = activeLoc.id === loc.id;
                return (
                  <div
                    key={loc.id}
                    onClick={() => setActiveLoc(loc)}
                    className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'bg-brand-orange/10 border-brand-orange shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850 border-slate-100 dark:border-slate-800'
                    }`}
                  >
                    <div className="space-y-1">
                      <h4 className={`text-sm font-bold leading-tight ${
                        isActive ? 'text-brand-orange' : 'text-slate-800 dark:text-slate-200'
                      }`}>
                        {loc.name}
                      </h4>
                      <p className="text-xs text-slate-400 font-light line-clamp-2 leading-relaxed">
                        {loc.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
