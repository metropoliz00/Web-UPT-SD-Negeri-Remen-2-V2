import React from 'react';
import { SchoolContent } from '../types';
import { motion } from 'motion/react';
import EditSectionOverlay from '../components/EditSectionOverlay';
import * as Icons from 'lucide-react';
import DocumentTable from '../components/DocumentTable';
import NumberCounter from '../components/NumberCounter';

interface PerpustakaanProps {
  content: SchoolContent;
  lang: 'id' | 'en';
}

const getIcon = (name: string) => {
  const IconComponent = (Icons as any)[name];
  return IconComponent ? <IconComponent className="h-6 w-6 text-brand-primary" /> : <Icons.BookOpen className="h-6 w-6 text-brand-primary" />;
};

export default function HalamanPerpustakaan({ content, lang }: PerpustakaanProps) {
  const library = content.perpustakaan || {
    deskripsi: "Perpustakaan 'Widya Pustaka' UPT SD Negeri Remen 2 adalah pusat literasi dan sumber belajar modern yang nyaman bagi seluruh peserta didik. Dengan koleksi lebih dari 2.500 buku cetak, ensiklopedia, dan ribuan akses e-book digital, kami berkomitmen menumbuhkan minat baca anak sejak usia dini dalam mendukung gerakan literasi nasional.",
    foto: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=1200",
    stats: [
      { label: "Total Koleksi Buku", value: "2.500+" },
      { label: "E-Book Terintegrasi", value: "1.200+" },
      { label: "Pengunjung / Bulan", value: "450+ Siswa" },
      { label: "Komputer OPAC & Digital", value: "4 Unit" }
    ],
    fasilitas: [
      { id: "f_lib_1", nama: "Ruang Baca Ber-AC", deskripsi: "Area membaca lesehan yang nyaman, bersih, dingin, dan tenang untuk fokus membaca.", iconName: "Wind" },
      { id: "f_lib_2", nama: "Pojok Literasi Digital", deskripsi: "Akses komputer pencarian buku (OPAC) dan pembacaan e-book secara gratis.", iconName: "Monitor" },
      { id: "f_lib_3", nama: "Area Dongeng & Audio", deskripsi: "Panggung kecil tempat guru mendongeng dan memutar audio-book edukasi.", iconName: "Volume2" },
      { id: "f_lib_4", nama: "Katalog Sistem Digital", deskripsi: "Peminjaman dan pengembalian buku yang cepat dan akurat menggunakan barcode.", iconName: "QrCode" }
    ],
    program: [
      { id: "p_lib_1", nama: "Kunjungan Literasi Kelas", deskripsi: "Jadwal rutin mingguan setiap kelas untuk membaca bersama dan meminjam buku didampingi guru.", jadwal: "Setiap Senin s.d Sabtu" },
      { id: "p_lib_2", nama: "Tantangan Duta Literasi", deskripsi: "Pemilihan siswa pembaca buku terbanyak setiap semester dengan apresiasi piala bintang literasi.", jadwal: "Setiap Akhir Semester" },
      { id: "p_lib_3", nama: "Gerakan Donasi Buku", deskripsi: "Program sukarela dari alumni dan wali murid untuk memperkaya khazanah pustaka sekolah.", jadwal: "Sepanjang Tahun" }
    ]
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-24 pb-16 min-h-screen bg-slate-50 dark:bg-slate-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <EditSectionOverlay section="perpustakaan" />

        {/* Hero Section */}
        <div className="text-center mb-12">
          <span className="px-4 py-1.5 bg-brand-primary/10 dark:bg-brand-primary/20 text-brand-primary rounded-full text-xs font-black uppercase tracking-widest inline-block mb-3">
            {lang === 'id' ? 'Fasilitas Literasi' : 'Literacy Facilities'}
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-brand-navy dark:text-white tracking-tight uppercase leading-tight mb-4">
            {lang === 'id' ? 'Perpustakaan Widya Pustaka' : 'Widya Pustaka Library'}
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium">
            {lang === 'id' 
              ? 'Menumbuhkan budaya membaca dan eksplorasi ilmu pengetahuan tanpa batas melalui ekosistem literasi fisik dan digital.' 
              : 'Fostering a culture of reading and boundless scientific exploration through physical and digital literacy ecosystems.'}
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-700/60 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Image */}
            <div className="h-64 sm:h-96 lg:h-full min-h-[320px] relative">
              <img 
                src={library.foto} 
                alt="Perpustakaan" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent"></div>
            </div>

            {/* Right Details */}
            <div className="p-8 sm:p-10 flex flex-col justify-center space-y-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-slate-950 dark:text-white mb-4">
                  {lang === 'id' ? 'Tentang Widya Pustaka' : 'About Widya Pustaka'}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {library.deskripsi}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                {library.stats.map((stat, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100/60 dark:border-slate-700/40">
                    <span className="block text-2xl font-black text-brand-primary tracking-tight">
                      <NumberCounter value={stat.value} />
                    </span>
                    <span className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Perpustakaan Structure Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-950 dark:text-white uppercase tracking-tight">
              {lang === 'id' ? 'Struktur Organisasi Perpustakaan' : 'Library Organization Structure'}
            </h2>
            <div className="h-1.5 w-16 bg-brand-primary rounded-full mx-auto mt-3"></div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg p-6 border border-slate-100 dark:border-slate-700/60">
             <img 
              src={content.strukturPerpustakaanImageUrl || 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1200'}
              alt="Struktur Perpustakaan"
              className="w-full rounded-2xl object-contain"
              referrerPolicy="no-referrer"
             />
          </div>
        </div>

        {/* Facilities Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-950 dark:text-white uppercase tracking-tight">
              {lang === 'id' ? 'Fasilitas & Sarana' : 'Facilities & Resources'}
            </h2>
            <div className="h-1.5 w-16 bg-brand-primary rounded-full mx-auto mt-3"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {library.fasilitas.map((f) => (
              <div key={f.id} className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-all">
                <div className="p-3 bg-brand-primary/10 dark:bg-brand-primary/20 rounded-xl w-fit mb-4">
                  {getIcon(f.iconName)}
                </div>
                <h4 className="text-base font-bold text-slate-950 dark:text-white mb-2">{f.nama}</h4>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{f.deskripsi}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Programs / Agenda Section */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-950 dark:text-white uppercase tracking-tight">
              {lang === 'id' ? 'Program Kerja & Kegiatan' : 'Work Programs & Activities'}
            </h2>
            <div className="h-1.5 w-16 bg-brand-primary rounded-full mx-auto mt-3"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {library.program.map((p, idx) => (
              <div key={p.id} className="relative p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="absolute top-6 right-6 text-4xl font-black text-brand-primary/10">0{idx + 1}</span>
                  <span className="px-2.5 py-1 bg-brand-orange/10 text-brand-orange rounded-lg text-[10px] font-black uppercase tracking-wider block w-fit mb-4">
                    {p.jadwal}
                  </span>
                  <h4 className="text-lg font-bold text-slate-950 dark:text-white mb-2">{p.nama}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">{p.deskripsi}</p>
                </div>
                <div className="border-t border-slate-50 dark:border-slate-700/40 pt-4 flex items-center text-xs font-bold text-brand-primary">
                  <Icons.Calendar className="h-4 w-4 mr-2" />
                  <span>{lang === 'id' ? 'Terjadwal rutin' : 'Regularly scheduled'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DocumentTable dokumen={content.perpustakaan?.dokumen} title={lang === 'id' ? 'Dokumen Perpustakaan' : 'Library Documents'} />

      </div>
    </motion.div>
  );
}
