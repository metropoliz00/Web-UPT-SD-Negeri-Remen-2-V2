import React, { useState, useEffect } from 'react';
import { Play, Tv, Video, Sparkles, MonitorPlay } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { VideoItem } from '../types';

interface VideoSekolahProps {
  lang: 'id' | 'en';
}

export default function VideoSekolah({ lang }: VideoSekolahProps) {
  const { content } = useCMS();
  const videosList: VideoItem[] = content.videos || [];

  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  // Initialize or handle dynamic videosList changes
  useEffect(() => {
    if (videosList.length > 0) {
      // If there is no active video or the active video is no longer in the list, set to the first one
      if (!activeVideo || !videosList.some(v => v.id === activeVideo.id)) {
        setActiveVideo(videosList[0]);
      }
    } else {
      setActiveVideo(null);
    }
  }, [videosList, activeVideo]);

  return (
    <section id="video-sekolah" className="py-24 bg-slate-50 dark:bg-slate-900/25 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full">
            {lang === 'id' ? 'Video Hub' : 'Video Channel'}
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-800 dark:text-white tracking-tight">
            {lang === 'id' ? 'Kanal Video Pembelajaran & Kegiatan' : 'Our Official Video Hub'}
          </h2>
          <div className="h-1 w-20 bg-brand-primary mx-auto rounded-full" />
          <p className="text-sm text-slate-500 dark:text-slate-400 font-light max-w-xl mx-auto">
            {lang === 'id'
              ? 'Saksikan secara audio visual program pembelajaran digital, proyek pameran, dan kreativitas siswa kami.'
              : 'Witness through audio-visual our digital programs, project exhibitions, and student achievements.'
            }
          </p>
        </div>

        {videosList.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <MonitorPlay className="h-12 w-12 text-slate-300 mx-auto mb-3 animate-pulse" />
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              {lang === 'id' ? 'Belum ada video pembelajaran yang ditambahkan.' : 'No videos added yet.'}
            </p>
          </div>
        ) : (
          /* Video Player Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Main Central Embed Video Player */}
            <div className="lg:col-span-8 space-y-4">
              {activeVideo && (
                <>
                  <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black border border-slate-200 dark:border-slate-800">
                    {/* Responsive Iframe embed */}
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${activeVideo.youtubeId}`}
                      title={activeVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  
                  {/* Playing Title and Category */}
                  <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-primary bg-brand-primary/10 px-2.5 py-1 rounded-md">
                        {activeVideo.category}
                      </span>
                      <h3 className="font-display font-bold text-base sm:text-lg text-slate-800 dark:text-white">
                        {activeVideo.title}
                      </h3>
                    </div>
                    <div className="flex-shrink-0 text-xs text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700 font-mono">
                      Duration: {activeVideo.duration} mins
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Sidebar Clickable Video Thumbnails */}
            <div className="lg:col-span-4 space-y-4">
              <h3 className="font-display font-semibold text-xs uppercase tracking-widest text-slate-400 flex items-center space-x-2">
                <MonitorPlay className="h-4.5 w-4.5 text-brand-primary" />
                <span>{lang === 'id' ? 'Daftar Putar Video' : 'Video Playlist'}</span>
              </h3>

              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
                {videosList.map((video) => {
                  const isActive = activeVideo?.id === video.id;
                  return (
                    <div
                      key={video.id}
                      onClick={() => setActiveVideo(video)}
                      className={`flex items-start space-x-3.5 p-3 rounded-2xl border transition-all duration-300 cursor-pointer ${
                        isActive
                          ? 'bg-brand-primary/10 border-brand-primary shadow-sm'
                          : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 border-slate-100 dark:border-slate-800'
                      }`}
                    >
                      {/* Thumbnail representation */}
                      <div className="relative h-16 w-24 rounded-xl overflow-hidden bg-slate-200 flex-shrink-0">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <div className="h-7 w-7 bg-white/95 rounded-full flex items-center justify-center shadow-md">
                            <Play className="h-3 w-3 fill-slate-900 text-slate-900 ml-0.5" />
                          </div>
                        </div>
                      </div>

                      {/* Text Details */}
                      <div className="space-y-1 flex-grow">
                        <span className="text-[9px] font-extrabold uppercase tracking-widest text-brand-primary block leading-none">
                          {video.category}
                        </span>
                        <h4 className={`text-xs font-bold leading-snug line-clamp-2 ${
                          isActive ? 'text-brand-primary' : 'text-slate-800 dark:text-slate-200'
                        }`}>
                          {video.title}
                        </h4>
                        <span className="text-[10px] font-medium text-slate-400 block leading-none">
                          ⏱ {video.duration} mins
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
