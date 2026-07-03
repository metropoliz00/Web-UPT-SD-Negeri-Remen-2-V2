import React from 'react';
import { SchoolContent } from '../types';
import { motion } from 'motion/react';
import EditSectionOverlay from '../components/EditSectionOverlay';
import * as Icons from 'lucide-react';
import DocumentTable from '../components/DocumentTable';
import NumberCounter from '../components/NumberCounter';

interface UKSProps {
  content: SchoolContent;
  lang: 'id' | 'en';
}

const getIcon = (name: string) => {
  const IconComponent = (Icons as any)[name];
  return IconComponent ? <IconComponent className="h-6 w-6 text-brand-orange" /> : <Icons.Heart className="h-6 w-6 text-brand-orange" />;
};

export default function HalamanUKS({ content, lang }: UKSProps) {
  const clinic = content.uks || {
    deskripsi: "Unit Kesehatan Sekolah (UKS) UPT SD Negeri Remen 2 merupakan pusat layanan kesehatan pertama, pencegahan penyakit, dan pendidikan pola hidup bersih dan sehat (PHBS) di lingkungan sekolah. Bekerja sama dengan Puskesmas Jenu, UKS kami senantiasa siap siaga menjaga kesehatan fisik serta mental siswa selama jam sekolah.",
    foto: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=1200",
    stats: [
      { label: "Kader Dokter Kecil", value: "24 Siswa" },
      { label: "Kapasitas Bed Tidur", value: "4 Bed" },
      { label: "Pemeriksaan Berkala", value: "2x / Tahun" },
      { label: "Kotak P3K Kelas", value: "18 Unit" }
    ],
    fasilitas: [
      { id: "f_uks_1", nama: "Bed Pasien Nyaman", deskripsi: "Ruang istirahat terpisah antara siswa laki-laki dan perempuan dengan standar kebersihan tinggi.", iconName: "Bed" },
      { id: "f_uks_2", nama: "Peralatan Diagnostik Dasar", deskripsi: "Timbangan berat badan digital, alat ukur tinggi badan, tensimeter, termometer infra-merah, dan snellen chart.", iconName: "Activity" },
      { id: "f_uks_3", nama: "Apotek Hidup & Obat Dasar", deskripsi: "Taman obat tradisional (TOGA) di samping ruang UKS serta obat-obatan darurat bersertifikasi BPOM.", iconName: "Shield" },
      { id: "f_uks_4", nama: "Wastafel Higienis", deskripsi: "Fasilitas cuci tangan dengan sabun antiseptik di depan pintu masuk ruang UKS.", iconName: "Sparkles" }
    ],
    program: [
      { id: "p_uks_1", nama: "Pemeriksaan Berkala Siswa", deskripsi: "Skrining kesehatan mata, telinga, kuku, gigi, dan mulut seluruh siswa bekerja sama dengan Puskesmas.", jadwal: "Setiap Awal Semester" },
      { id: "p_uks_2", nama: "Pelatihan Dokter Kecil", deskripsi: "Pendidikan kader kesehatan sekolah dari perwakilan siswa kelas 4 dan 5 tentang P3K dasar.", jadwal: "Bulan Agustus Tahunan" },
      { id: "p_uks_3", nama: "Imunisasi Anak Sekolah (BIAS)", deskripsi: "Pemberian vaksin imunisasi dasar untuk meningkatkan imunitas tubuh anak dari penyakit infeksi.", jadwal: "Sesuai Jadwal Kemenkes" }
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
        <EditSectionOverlay section="uks" />

        {/* Hero Section */}
        <div className="text-center mb-12">
          <span className="px-4 py-1.5 bg-brand-orange/10 dark:bg-brand-orange/20 text-brand-orange rounded-full text-xs font-black uppercase tracking-widest inline-block mb-3">
            {lang === 'id' ? 'Layanan Kesehatan' : 'Health Services'}
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-brand-navy dark:text-white tracking-tight uppercase leading-tight mb-4">
            {lang === 'id' ? 'Unit Kesehatan Sekolah (UKS)' : 'School Health Clinic (UKS)'}
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium">
            {lang === 'id' 
              ? 'Menjaga kesehatan fisik, kesiapan belajar, dan membiasakan pola hidup sehat di lingkungan sekolah yang higienis.' 
              : 'Maintaining physical health, study readiness, and habituating healthy lifestyles in hygienic school environments.'}
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-700/60 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Image */}
            <div className="h-64 sm:h-96 lg:h-full min-h-[320px] relative">
              <img 
                src={clinic.foto} 
                alt="UKS" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent"></div>
            </div>

            {/* Right Details */}
            <div className="p-8 sm:p-10 flex flex-col justify-center space-y-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-slate-950 dark:text-white mb-4">
                  {lang === 'id' ? 'Tentang UKS Kami' : 'About Our UKS'}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {clinic.deskripsi}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                {clinic.stats.map((stat, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100/60 dark:border-slate-700/40">
                    <span className="block text-2xl font-black text-brand-orange tracking-tight">
                      <NumberCounter value={stat.value} />
                    </span>
                    <span className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* UKS Structure Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-950 dark:text-white uppercase tracking-tight">
              {lang === 'id' ? 'Struktur Organisasi UKS' : 'UKS Organization Structure'}
            </h2>
            <div className="h-1.5 w-16 bg-brand-orange rounded-full mx-auto mt-3"></div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg p-6 border border-slate-100 dark:border-slate-700/60">
             <img 
              src={content.strukturUKSImageUrl || 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=1200'}
              alt="Struktur UKS"
              className="w-full rounded-2xl object-contain"
              referrerPolicy="no-referrer"
             />
          </div>
        </div>

        {/* Facilities Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-950 dark:text-white uppercase tracking-tight">
              {lang === 'id' ? 'Fasilitas & Inventaris Medis' : 'Medical Facilities & Inventory'}
            </h2>
            <div className="h-1.5 w-16 bg-brand-orange rounded-full mx-auto mt-3"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {clinic.fasilitas.map((f) => (
              <div key={f.id} className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-all">
                <div className="p-3 bg-brand-orange/10 dark:bg-brand-orange/20 rounded-xl w-fit mb-4">
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
              {lang === 'id' ? 'Program Kerja & Promosi Kesehatan' : 'Work Programs & Health Promotion'}
            </h2>
            <div className="h-1.5 w-16 bg-brand-orange rounded-full mx-auto mt-3"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {clinic.program.map((p, idx) => (
              <div key={p.id} className="relative p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="absolute top-6 right-6 text-4xl font-black text-brand-orange/10">0{idx + 1}</span>
                  <span className="px-2.5 py-1 bg-brand-primary/10 text-brand-primary rounded-lg text-[10px] font-black uppercase tracking-wider block w-fit mb-4">
                    {p.jadwal}
                  </span>
                  <h4 className="text-lg font-bold text-slate-950 dark:text-white mb-2">{p.nama}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">{p.deskripsi}</p>
                </div>
                <div className="border-t border-slate-50 dark:border-slate-700/40 pt-4 flex items-center text-xs font-bold text-brand-orange">
                  <Icons.Heart className="h-4 w-4 mr-2" />
                  <span>{lang === 'id' ? 'Kolaborasi Puskesmas' : 'Puskesmas Collaboration'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DocumentTable dokumen={content.uks?.dokumen} title={lang === 'id' ? 'Dokumen UKS' : 'UKS Documents'} />

      </div>
    </motion.div>
  );
}
