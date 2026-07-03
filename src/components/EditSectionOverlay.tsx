import React from 'react';
import { useCMS } from '../context/CMSContext';
import { Edit3 } from 'lucide-react';

interface EditSectionOverlayProps {
  section: string;
}

export default function EditSectionOverlay({ section }: EditSectionOverlayProps) {
  const { isLoggedIn, editMode, setActiveSection } = useCMS();

  if (!isLoggedIn || !editMode) return null;

  return (
    <div className="absolute inset-0 border-2 border-dashed border-brand-primary/40 pointer-events-none z-30 rounded-[2rem] transition-colors duration-300 hover:border-brand-primary/80">
      <div className="absolute top-4 right-4 pointer-events-auto z-40">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setActiveSection(section);
          }}
          className="flex items-center space-x-1 px-3 py-1.5 bg-brand-primary text-slate-900 font-sans text-[10px] font-black uppercase rounded-xl shadow-xl hover:scale-105 hover:bg-brand-orange hover:text-white transition-all cursor-pointer"
        >
          <Edit3 className="h-3 w-3" />
          <span>Sunting</span>
        </button>
      </div>
    </div>
  );
}
