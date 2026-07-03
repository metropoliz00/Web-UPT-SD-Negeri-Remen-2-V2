import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface PopupBannerProps {
  imageUrl?: string;
  onClose: () => void;
}

export default function PopupBanner({ imageUrl, onClose }: PopupBannerProps) {
  if (!imageUrl) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>
        <img src={imageUrl} alt="Popup Banner" className="w-full h-auto" />
      </div>
    </div>
  );
}
