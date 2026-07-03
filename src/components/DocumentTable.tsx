import React from 'react';
import { Eye, Download } from 'lucide-react';
import { Dokumen } from '../types';

interface Props {
  dokumen?: Dokumen[];
  title: string;
}

export default function DocumentTable({ dokumen = [], title }: Props) {
  const hasDocuments = dokumen && dokumen.length > 0;

  return (
    <div className="space-y-6 mt-16 animate-in fade-in duration-300">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-950 dark:text-white uppercase tracking-tight">
          {title}
        </h2>
        <div className="h-1.5 w-16 bg-brand-primary rounded-full mx-auto mt-3"></div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/60 overflow-hidden">
          <thead>
            <tr className="text-xs text-slate-500 uppercase font-bold tracking-wider border-b border-slate-200 dark:border-slate-700">
              <th className="py-4 px-6 w-16">No</th>
              <th className="py-4 px-6">Judul Dokumen</th>
              <th className="py-4 px-6 w-32">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {!hasDocuments ? (
              <tr>
                <td colSpan={3} className="py-12 px-6 text-center text-slate-400 dark:text-slate-500 font-medium text-sm">
                  Belum ada dokumen yang tersedia untuk bagian ini.
                </td>
              </tr>
            ) : (
              dokumen.map((doc, idx) => (
                <tr key={doc.id} className="text-sm hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-4 px-6 text-slate-500">{idx + 1}</td>
                  <td className="py-4 px-6 text-slate-900 dark:text-slate-200 font-bold">{doc.title}</td>
                  <td className="py-4 px-6 flex space-x-2">
                    <a 
                      href={doc.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                      title="Lihat Dokumen"
                    >
                      <Eye className="h-4 w-4" />
                    </a>
                    <a 
                      href={doc.url} 
                      download 
                      className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
                      title="Unduh Dokumen"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
