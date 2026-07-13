import React, { useState } from 'react';
import { Upload, X, Link2, ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (val: string) => void;
  label: string;
  helperText?: string;
  className?: string;
}

export default function ImageUpload({ value, onChange, label, helperText, className = '' }: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      convertToBase64(file);
    }
  };

  const convertToBase64 = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange(reader.result);
      }
    };
    reader.onerror = (error) => {
      console.error('Gagal mengonversi berkas ke base64: ', error);
    };
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      convertToBase64(file);
    }
  };

  const isBase64OrUrl = value && value !== '#' && value !== '';

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-500 block">{label}</label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[10px] font-bold text-brand-primary hover:underline flex items-center space-x-1 cursor-pointer"
        >
          <Link2 className="h-3 w-3" />
          <span>{showUrlInput ? 'Gunakan Unggah Berkas' : 'Gunakan URL Foto'}</span>
        </button>
      </div>

      {showUrlInput ? (
        <input
          type="text"
          value={value === '#' ? '' : value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://contoh.com/foto.jpg"
          className="w-full px-4 py-2.5 text-xs bg-white border border-slate-200 text-slate-700 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all shadow-sm font-medium"
        />
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-4 transition-all flex flex-col items-center justify-center min-h-[110px] text-center ${
            isDragOver 
              ? 'border-brand-primary bg-brand-primary/5' 
              : isBase64OrUrl 
                ? 'border-slate-200 bg-white' 
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          {isBase64OrUrl ? (
            <div className="relative w-full flex items-center space-x-3 text-left">
              <div className="relative h-16 w-16 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0 flex items-center justify-center">
                <img
                  src={value}
                  alt="Pratinjau"
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=200';
                  }}
                />
              </div>
              <div className="flex-grow min-w-0">
                <p className="text-xs font-bold text-slate-700 truncate">
                  {value.startsWith('data:') ? 'Foto Terunggah (Base64)' : 'Tautan Foto'}
                </p>
                <p className="text-[10px] text-slate-400">
                  {value.startsWith('data:') ? `${Math.round((value.length * 3) / 4 / 1024)} KB` : 'Tautan eksternal'}
                </p>
                <div className="mt-2 flex items-center space-x-2">
                  <label className="text-[10px] bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-colors">
                    Ganti Foto
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => onChange('#')}
                    className="text-[10px] bg-rose-50 text-rose-500 hover:bg-rose-100 px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <label className="cursor-pointer w-full flex flex-col items-center justify-center space-y-1.5 py-3">
              <div className="p-2 bg-slate-100 text-slate-400 rounded-full group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-colors">
                <Upload className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold text-slate-700">Pilih berkas foto</span>
              <span className="text-[10px] text-slate-400">atau seret & taruh berkas di sini (PNG, JPG)</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
        </div>
      )}
      {helperText && <p className="text-[10px] text-slate-400 italic mt-0.5">{helperText}</p>}
    </div>
  );
}
