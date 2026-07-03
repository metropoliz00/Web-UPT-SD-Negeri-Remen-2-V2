import React, { useState } from 'react';
import { FAQItem } from '../types';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FAQProps {
  items: FAQItem[];
  lang: 'id' | 'en';
}

export default function FAQ({ items, lang }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 bg-slate-50 dark:bg-slate-900/35 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full">
            FAQ
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-800 dark:text-white tracking-tight text-glow">
            {lang === 'id' ? 'Pertanyaan yang Sering Diajukan' : 'Frequently Asked Questions'}
          </h2>
          <div className="h-1 w-20 bg-brand-primary mx-auto rounded-full" />
          <p className="text-sm text-slate-500 dark:text-slate-400 font-light max-w-xl mx-auto">
            {lang === 'id'
              ? 'Membantu memberikan jawaban praktis seputar registrasi SPMB, seragam, kurikulum, dan pembiayaan.'
              : 'Providing practical answers regarding admissions, uniforms, curriculum, and pricing.'
            }
          </p>
        </div>

        {/* Accordion Stack list */}
        <div className="space-y-4">
          {items.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.id}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden transition-all duration-300"
              >
                {/* Trigger Button bar */}
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between space-x-4 focus:outline-none cursor-pointer group"
                >
                  <div className="flex items-center space-x-3">
                    <HelpCircle className={`h-5 w-5 flex-shrink-0 transition-colors ${
                      isOpen ? 'text-brand-primary' : 'text-slate-400 group-hover:text-brand-primary'
                    }`} />
                    <span className={`text-sm sm:text-base font-bold transition-colors ${
                      isOpen ? 'text-brand-primary' : 'text-slate-700 dark:text-slate-200 group-hover:text-brand-primary'
                    }`}>
                      {faq.question}
                    </span>
                  </div>

                  <div className={`h-8 w-8 rounded-full flex items-center justify-center bg-slate-50 dark:bg-slate-800 group-hover:bg-brand-primary/15 transition-all flex-shrink-0 ${
                    isOpen ? 'rotate-180 bg-brand-primary/10 text-brand-primary' : 'text-slate-400'
                  }`}>
                    <ChevronDown className="h-4.5 w-4.5 transition-transform" />
                  </div>
                </button>

                {/* Collapsible content container with grid height animation */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100 border-t border-slate-50 dark:border-slate-800/80' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="p-5 sm:p-6 text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-light leading-relaxed whitespace-pre-line">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
