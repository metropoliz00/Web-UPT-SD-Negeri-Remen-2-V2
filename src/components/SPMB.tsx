import React, { useState, useEffect } from 'react';
import { Calendar, FileText, CheckCircle, Clock, Send, Sparkles, Award, Trash2, Edit2, Save, X, Search, GraduationCap, RefreshCw } from 'lucide-react';
import { PPDBConfig } from '../types';
import Toast, { ToastType } from './Toast';
import { useCMS } from '../context/CMSContext';
import { getRegistrants, addRegistrant, updateRegistrant, deleteRegistrant } from '../supabase';

interface SPMBProps {
  config: PPDBConfig;
  lang: 'id' | 'en';
}

interface Registrant {
  id: string;
  studentName: string;
  nisn?: string;
  nik: string;
  birthPlace: string;
  birthDate: string;
  parentName: string;
  whatsapp: string;
  track: string;
  prevSchool?: string;
  status: 'Diterima' | 'Tidak Diterima' | 'Pending';
  createdAt?: any;
}

export default function SPMBOnline({ config, lang }: SPMBProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showRegForm, setShowRegForm] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  const [regDetails, setRegDetails] = useState({
    studentName: '',
    nisn: '',
    nik: '',
    birthPlace: '',
    birthDate: '',
    parentName: '',
    whatsapp: '',
    track: 'Zonasi',
    prevSchool: ''
  });

  const [toast, setToast] = useState<{ message: string, type: ToastType, isVisible: boolean }>({
    message: '',
    type: 'success',
    isVisible: false
  });

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type, isVisible: true });
  };

  // Calculate live countdown timer
  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(config.countdownDate) - +new Date();
      let remaining = { days: 0, hours: 0, minutes: 0, seconds: 0 };

      if (difference > 0) {
        remaining = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      }
      setTimeLeft(remaining);
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [config.countdownDate]);

  const { updateContentField, saveChanges, editMode } = useCMS();
  const [registrants, setRegistrants] = useState<Registrant[]>([]);
  const [loadingRegistrants, setLoadingRegistrants] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Registrant>>({});
  const [searchQuery, setSearchQuery] = useState('');

  const fetchRegistrants = async () => {
    try {
      const dataList = await getRegistrants();
      const fetched: Registrant[] = dataList.map((data: any) => ({
        id: data.id,
        studentName: data.studentName || '',
        nisn: data.nisn || '',
        nik: data.nik || '',
        birthPlace: data.birthPlace || '',
        birthDate: data.birthDate || '',
        parentName: data.parentName || '',
        whatsapp: data.whatsapp || '',
        track: data.track || 'Zonasi',
        prevSchool: data.prevSchool || '',
        status: data.status || 'Diterima',
        createdAt: data.createdAt
      }));
      setRegistrants(fetched);

      // Re-calculate and synchronize kuotaTerisi automatically
      const acceptedCount = fetched.filter(r => r.status === 'Diterima').length;
      if (acceptedCount !== config.kuotaTerisi) {
        updateContentField('ppdb', { ...config, kuotaTerisi: acceptedCount });
      }
    } catch (err) {
      console.error("Gagal memuat data pendaftaran:", err);
    } finally {
      setLoadingRegistrants(false);
    }
  };

  useEffect(() => {
    fetchRegistrants();
  }, []);

  const percentage = Math.round((config.kuotaTerisi / config.kuota) * 100);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRegDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regDetails.studentName || !regDetails.nik || !regDetails.birthPlace || !regDetails.birthDate || !regDetails.whatsapp || !regDetails.parentName) {
      showToast(lang === 'id' ? 'Silakan lengkapi kolom bertanda bintang (*)' : 'Please fill all mandatory fields (*)', 'error');
      return;
    }

    // Determine status: "Tidak Diterima" if count of already accepted exceeds/equals total quota
    const currentAcceptedCount = registrants.filter(r => r.status === 'Diterima').length;
    const kuotaLimit = config.kuota || 120;
    const status = currentAcceptedCount >= kuotaLimit ? 'Tidak Diterima' : 'Diterima';

    try {
      const newRegistrantData = {
        studentName: regDetails.studentName,
        nisn: regDetails.nisn || '',
        nik: regDetails.nik,
        birthPlace: regDetails.birthPlace,
        birthDate: regDetails.birthDate,
        parentName: regDetails.parentName,
        whatsapp: regDetails.whatsapp,
        track: regDetails.track,
        prevSchool: regDetails.prevSchool || '',
        status: status
      };

      const result = await addRegistrant(newRegistrantData);
      
      const addedItem: Registrant = {
        id: result?.id || 'temp_' + Date.now(),
        ...newRegistrantData,
        status: status as 'Diterima' | 'Tidak Diterima' | 'Pending',
        createdAt: result?.createdAt || new Date().toISOString()
      };

      // Add to local state list
      const updatedList = [...registrants, addedItem];
      setRegistrants(updatedList);

      // Dynamically update kuotaTerisi in CMS config and save
      const newAcceptedCount = updatedList.filter(r => r.status === 'Diterima').length;
      updateContentField('ppdb', { ...config, kuotaTerisi: newAcceptedCount });
      await saveChanges();

      setRegSuccess(true);
      if (status === 'Tidak Diterima') {
        showToast(
          lang === 'id' 
            ? 'Pendaftaran berhasil dikirim. Namun, kuota kelas 1 telah penuh sehingga status ananda saat ini: Tidak Diterima.' 
            : 'Registration submitted. However, the quota is full so the status is: Not Accepted.', 
          'error'
        );
      } else {
        showToast(lang === 'id' ? 'Pendaftaran online berhasil diterima!' : 'Registration submitted and accepted!', 'success');
      }
    } catch (err) {
      console.error(err);
      showToast(lang === 'id' ? 'Gagal memproses pendaftaran online' : 'Failed to process online registration', 'error');
    }
  };

  const handleDeleteRegistrant = async (id: string) => {
    if (!window.confirm(lang === 'id' ? 'Apakah Anda yakin ingin menghapus data siswa ini?' : 'Are you sure you want to delete this student data?')) {
      return;
    }
    try {
      await deleteRegistrant(id);
      
      const updated = registrants.filter(r => r.id !== id);
      setRegistrants(updated);

      // Re-calculate and update kuotaTerisi
      const acceptedCount = updated.filter(r => r.status === 'Diterima').length;
      updateContentField('ppdb', { ...config, kuotaTerisi: acceptedCount });
      await saveChanges();

      showToast(lang === 'id' ? 'Siswa berhasil dihapus dari daftar!' : 'Student deleted successfully!', 'success');
    } catch (err) {
      console.error(err);
      showToast(lang === 'id' ? 'Gagal menghapus data siswa' : 'Failed to delete student', 'error');
    }
  };

  const handleStartEdit = (registrant: Registrant) => {
    setEditingId(registrant.id);
    setEditForm(registrant);
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editForm.studentName || !editForm.nik) return;
    try {
      const updateData = {
        studentName: editForm.studentName,
        nisn: editForm.nisn || '',
        nik: editForm.nik,
        birthPlace: editForm.birthPlace || '',
        birthDate: editForm.birthDate || '',
        parentName: editForm.parentName || '',
        whatsapp: editForm.whatsapp || '',
        track: editForm.track || 'Zonasi',
        prevSchool: editForm.prevSchool || '',
        status: editForm.status || 'Diterima'
      };
      
      await updateRegistrant(editingId, updateData);
      
      const updated = registrants.map(r => r.id === editingId ? { ...r, ...updateData } : r);
      setRegistrants(updated);

      // Re-calculate and update kuotaTerisi
      const acceptedCount = updated.filter(r => r.status === 'Diterima').length;
      updateContentField('ppdb', { ...config, kuotaTerisi: acceptedCount });
      await saveChanges();

      setEditingId(null);
      showToast(lang === 'id' ? 'Perubahan data siswa disimpan!' : 'Student changes saved!', 'success');
    } catch (err) {
      console.error(err);
      showToast(lang === 'id' ? 'Gagal menyimpan perubahan' : 'Failed to save changes', 'error');
    }
  };

  return (
    <section id="spmb" className="py-24 bg-brand-bg/50 dark:bg-slate-950/20 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full">
            {lang === 'id' ? 'Penerimaan Siswa Baru' : 'Admissions Portal'}
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-brand-navy dark:text-white tracking-tight">
            {lang === 'id' ? (
              <>
                SPMB Online<br />
                UPT SD Negeri Remen 2
              </>
            ) : 'Admissions SPMB Online 2026/2027'}
          </h2>
          <div className="h-1 w-20 bg-brand-primary mx-auto rounded-full" />
        </div>

        {/* Highlight row: Live Counter and Countdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-stretch">
          
          {/* Quota Counter Card */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{lang === 'id' ? 'Status Penerimaan' : 'Quota Intake Status'}</span>
                {config.status?.toLowerCase() === 'open' ? (
                  <span className="bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider animate-pulse">
                    {lang === 'id' ? 'Dibuka / Aktif' : 'Active / Open'}
                  </span>
                ) : (
                  <span className="bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                    {lang === 'id' ? 'Ditutup / Selesai' : 'Closed / Inactive'}
                  </span>
                )}
              </div>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-800 dark:text-white">
                {lang === 'id' ? 'Kuota Siswa Kelas 1 Baru' : 'New First Grade Quota'}
              </h3>
              
              <div className="space-y-2 pt-4">
                <div className="flex justify-between text-xs sm:text-sm font-semibold text-slate-500">
                  <span>{config.kuotaTerisi} {lang === 'id' ? 'Terdaftar' : 'Registered'}</span>
                  <span>{config.kuota} {lang === 'id' ? 'Total Kursi' : 'Total Intake'}</span>
                </div>
                {/* Visual Bar */}
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-primary to-brand-light rounded-full transition-all duration-1000"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>{percentage}% {lang === 'id' ? 'Kuota Terpakai' : 'Filled'}</span>
                  <span>{config.kuota - config.kuotaTerisi} {lang === 'id' ? 'Kursi Sisa' : 'Intakes Remaining'}</span>
                </div>
              </div>
            </div>

            {config.status?.toLowerCase() === 'open' ? (
              <button
                onClick={() => {
                  setRegSuccess(false);
                  setShowRegForm(true);
                }}
                className="mt-8 w-full text-center py-4 bg-brand-primary hover:bg-brand-primary/95 text-white font-bold rounded-2xl shadow-lg hover:shadow-brand-primary/20 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
              >
                {lang === 'id' ? 'Daftar Online Sekarang' : 'Enroll Online Now'}
              </button>
            ) : (
              <button
                disabled
                className="mt-8 w-full text-center py-4 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-bold rounded-2xl cursor-not-allowed border border-slate-200/50 dark:border-slate-700/50"
              >
                {lang === 'id' ? 'Pendaftaran Ditutup' : 'Admissions Closed'}
              </button>
            )}
          </div>

          {/* SPMB Closure Countdown Clock */}
          <div className="lg:col-span-6 bg-brand-navy text-white shadow-xl rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,#FF914910,transparent_50%)] pointer-events-none" />
            
            <div className="space-y-2">
              <div className="flex items-center space-x-1.5 text-xs text-brand-orange font-bold uppercase tracking-widest">
                <Clock className="h-4 w-4 text-brand-orange animate-spin" />
                <span>{lang === 'id' ? 'Batas Akhir Gelombang 1' : 'Registration Deadline Wave 1'}</span>
              </div>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-white text-glow">
                {lang === 'id' ? 'Hitung Mundur Penutupan' : 'Admission Closes In'}
              </h3>
            </div>

            {/* Countdown Grid boxes */}
            <div className="grid grid-cols-4 gap-4 py-6">
              {[
                { label: lang === 'id' ? 'Hari' : 'Days', val: timeLeft.days },
                { label: lang === 'id' ? 'Jam' : 'Hours', val: timeLeft.hours },
                { label: lang === 'id' ? 'Menit' : 'Mins', val: timeLeft.minutes },
                { label: lang === 'id' ? 'Detik' : 'Secs', val: timeLeft.seconds }
              ].map((time, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                  <div className="font-display font-extrabold text-xl sm:text-3xl text-brand-orange">
                    {String(time.val).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-1">
                    {time.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-xs text-slate-300 font-light border-t border-white/10 pt-4 flex justify-between items-center">
              <span>{lang === 'id' ? 'Tanggal Batas Akhir:' : 'Admission End Date:'}</span>
              <span className="font-semibold text-brand-orange">20 Juli 2026, 23:59 WIB</span>
            </div>
          </div>
        </div>

        {/* Requirements and Process Tree layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-8">
          
          {/* Left Column: Requirements & Deadlines Table */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm">
              <h3 className="font-display font-bold text-lg sm:text-xl mb-6 text-slate-800 dark:text-white flex items-center space-x-2">
                <FileText className="h-5.5 w-5.5 text-brand-primary" />
                <span>{lang === 'id' ? 'Dokumen & Syarat Pendaftaran' : 'Admissions Requirements'}</span>
              </h3>
              
              <ul className="space-y-3.5">
                {config.persyaratan.map((req, idx) => (
                  <li key={idx} className="flex items-start space-x-3 text-slate-600 dark:text-slate-300 text-sm font-light">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Waves Calendar table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm">
              <h3 className="font-display font-bold text-lg sm:text-xl mb-6 text-slate-800 dark:text-white flex items-center space-x-2">
                <Calendar className="h-5.5 w-5.5 text-brand-primary" />
                <span>{lang === 'id' ? 'Jadwal Penting SPMB' : 'Admissions Schedule Timeline'}</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase">
                      <th className="pb-3">{lang === 'id' ? 'Tahapan / Jalur' : 'Phase'}</th>
                      <th className="pb-3 text-right">{lang === 'id' ? 'Waktu Pelaksanaan' : 'Date'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                    {config.jadwal.map((j, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">{j.phase}</td>
                        <td className="py-3 text-right text-brand-primary font-bold">{j.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Flow process steps (Alur Pendaftaran) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
            <h3 className="font-display font-bold text-lg sm:text-xl text-slate-800 dark:text-white flex items-center space-x-2">
              <Sparkles className="h-5.5 w-5.5 text-brand-primary" />
              <span>{lang === 'id' ? 'Alur & Prosedur Pendaftaran' : 'Steps to Register'}</span>
            </h3>

            <div className="space-y-6 relative pl-4">
              {/* Line */}
              <div className="absolute left-[29px] top-4 bottom-4 w-px bg-slate-100 dark:bg-slate-800" />
              
              {config.alur.map((a) => (
                <div key={a.step} className="flex items-start space-x-4 relative">
                  <div className="h-8 w-8 rounded-full bg-brand-primary text-slate-950 font-bold text-xs flex items-center justify-center shadow-md border-2 border-white dark:border-slate-900 flex-shrink-0">
                    {a.step}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white">{a.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-light">{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Table of Registered and Accepted Students */}
        <div id="daftar-siswa-diterima" className="mt-16 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-100 dark:border-slate-800 gap-4">
            <div>
              <h3 className="font-display font-bold text-xl text-slate-800 dark:text-white flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-brand-primary" />
                <span>{lang === 'id' ? 'Daftar Calon Siswa Terdaftar & Diterima' : 'Registered & Accepted Candidate Students'}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {lang === 'id' 
                  ? 'Siswa yang mendaftar online akan muncul secara otomatis di tabel ini. Jika melebihi kuota maka statusnya tidak diterima.' 
                  : 'Students registered online will appear here automatically. If the quota is exceeded, the status will be Not Accepted.'}
              </p>
            </div>
            
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder={lang === 'id' ? 'Cari nama calon siswa...' : 'Search student name...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all w-full sm:w-64"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div className="overflow-x-auto mt-6">
            {loadingRegistrants ? (
              <div className="text-center py-12 text-slate-400 text-sm flex items-center justify-center gap-2">
                <RefreshCw className="h-5 w-5 animate-spin text-brand-primary" />
                <span>{lang === 'id' ? 'Memuat daftar pendaftar...' : 'Loading candidate list...'}</span>
              </div>
            ) : registrants.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">
                {lang === 'id' ? 'Belum ada siswa yang mendaftar.' : 'No candidate students registered yet.'}
              </div>
            ) : (
              <table className="w-full text-left text-xs sm:text-sm text-slate-600 dark:text-slate-300 min-w-[800px]">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase bg-slate-50/50 dark:bg-slate-800/30">
                    <th className="py-4 px-4">No</th>
                    <th className="py-4 px-4">{lang === 'id' ? 'Nama Siswa' : 'Student Name'}</th>
                    <th className="py-4 px-4">NISN</th>
                    <th className="py-4 px-4">NIK</th>
                    <th className="py-4 px-4">{lang === 'id' ? 'Jalur' : 'Track'}</th>
                    <th className="py-4 px-4">{lang === 'id' ? 'Asal Sekolah' : 'Prev School'}</th>
                    <th className="py-4 px-4">WhatsApp</th>
                    <th className="py-4 px-4">Status</th>
                    {editMode && <th className="py-4 px-4 text-right">{lang === 'id' ? 'Aksi' : 'Actions'}</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/30">
                  {registrants
                    .filter(r => r.studentName.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((r, idx) => {
                      const isEditing = editingId === r.id;
                      return (
                        <tr key={r.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-all">
                          <td className="py-4 px-4 font-bold text-slate-400">{idx + 1}</td>
                          <td className="py-4 px-4 font-bold text-slate-800 dark:text-slate-100">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editForm.studentName || ''}
                                onChange={(e) => setEditForm({ ...editForm, studentName: e.target.value })}
                                className="px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-xs font-bold w-full"
                              />
                            ) : (
                              r.studentName
                            )}
                          </td>
                          <td className="py-4 px-4 font-mono">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editForm.nisn || ''}
                                onChange={(e) => setEditForm({ ...editForm, nisn: e.target.value })}
                                className="px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-xs font-mono w-full"
                                placeholder="NISN"
                              />
                            ) : (
                              r.nisn || '-'
                            )}
                          </td>
                          <td className="py-4 px-4 font-mono tracking-wider">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editForm.nik || ''}
                                onChange={(e) => setEditForm({ ...editForm, nik: e.target.value })}
                                className="px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-xs font-mono w-full"
                              />
                            ) : (
                              r.nik.length === 16 
                                ? `${r.nik.substring(0, 6)}******${r.nik.substring(12)}`
                                : r.nik
                            )}
                          </td>
                          <td className="py-4 px-4">
                            {isEditing ? (
                              <select
                                value={editForm.track || 'Zonasi'}
                                onChange={(e) => setEditForm({ ...editForm, track: e.target.value })}
                                className="px-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-950 dark:text-white rounded-lg text-xs font-bold"
                              >
                                <option value="Zonasi">Zonasi</option>
                                <option value="Afirmasi">Afirmasi</option>
                                <option value="Prestasi">Prestasi</option>
                                <option value="Mutasi">Mutasi</option>
                              </select>
                            ) : (
                              <span className="px-2.5 py-1 bg-brand-primary/10 text-brand-primary rounded-lg text-[10px] font-bold">
                                {r.track}
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-xs font-light text-slate-500">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editForm.prevSchool || ''}
                                onChange={(e) => setEditForm({ ...editForm, prevSchool: e.target.value })}
                                className="px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-xs w-full"
                              />
                            ) : (
                              r.prevSchool || '-'
                            )}
                          </td>
                          <td className="py-4 px-4 text-xs font-mono">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editForm.whatsapp || ''}
                                onChange={(e) => setEditForm({ ...editForm, whatsapp: e.target.value })}
                                className="px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-xs w-full"
                              />
                            ) : (
                              r.whatsapp
                            )}
                          </td>
                          <td className="py-4 px-4">
                            {isEditing ? (
                              <select
                                value={editForm.status || 'Diterima'}
                                onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                                className="px-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-950 dark:text-white rounded-lg text-xs font-bold"
                              >
                                <option value="Diterima">{lang === 'id' ? 'Diterima' : 'Accepted'}</option>
                                <option value="Tidak Diterima">{lang === 'id' ? 'Tidak Diterima' : 'Not Accepted'}</option>
                              </select>
                            ) : (
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                                r.status === 'Diterima'
                                  ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                                  : 'bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
                              }`}>
                                {r.status === 'Diterima' ? (lang === 'id' ? 'Diterima' : 'Accepted') : (lang === 'id' ? 'Tidak Diterima' : 'Not Accepted')}
                              </span>
                            )}
                          </td>
                          {editMode && (
                            <td className="py-4 px-4 text-right">
                              {isEditing ? (
                                <div className="flex items-center justify-end space-x-2">
                                  <button
                                    onClick={handleSaveEdit}
                                    title={lang === 'id' ? 'Simpan' : 'Save'}
                                    className="p-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg cursor-pointer transition-colors"
                                  >
                                    <Save className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setEditingId(null)}
                                    title={lang === 'id' ? 'Batal' : 'Cancel'}
                                    className="p-1.5 bg-slate-400 hover:bg-slate-500 text-white rounded-lg cursor-pointer transition-colors"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center justify-end space-x-2">
                                  <button
                                    onClick={() => handleStartEdit(r)}
                                    title={lang === 'id' ? 'Ubah' : 'Edit'}
                                    className="p-1.5 bg-brand-primary hover:bg-brand-primary/95 text-slate-950 rounded-lg cursor-pointer transition-colors"
                                  >
                                    <Edit2 className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteRegistrant(r.id)}
                                    title={lang === 'id' ? 'Hapus' : 'Delete'}
                                    className="p-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg cursor-pointer transition-colors"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              )}
                            </td>
                          )}
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Online Registration Form Modal Container */}
      {showRegForm && (
        <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            {/* Close */}
            <button
              onClick={() => setShowRegForm(false)}
              className="absolute top-4 right-4 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full p-2.5 text-sm font-bold transition-all z-20"
            >
              ✕
            </button>

            {/* Registration State Switch */}
            {!regSuccess ? (
              <form onSubmit={handleFormSubmit} className="p-6 sm:p-8 space-y-5">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-brand-primary uppercase tracking-widest block">SPMB Online Form</span>
                  <h3 className="font-display font-extrabold text-xl sm:text-2xl text-slate-800 dark:text-white">
                    {lang === 'id' ? 'Formulir Siswa Baru' : 'Student Enrollment Form'}
                  </h3>
                  <p className="text-xs text-slate-400">{lang === 'id' ? 'Lengkapi kolom di bawah untuk memproses verifikasi awal' : 'Fill in the information for early review'}</p>
                </div>

                <div className="space-y-4">
                  {/* NISN Siswa */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block">{lang === 'id' ? 'NISN Siswa (Opsional)' : 'Student National ID (NISN - Optional)'}</label>
                    <input
                      type="text"
                      name="nisn"
                      maxLength={10}
                      pattern="[0-9]{10}"
                      value={regDetails.nisn}
                      onChange={handleInputChange}
                      placeholder={lang === 'id' ? 'Masukkan 10 digit NISN Siswa jika ada' : 'Enter 10-digit Student NISN if any'}
                      className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-primary text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  {/* Student Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block">{lang === 'id' ? 'Nama Lengkap Calon Siswa *' : 'Full Name of Student *'}</label>
                    <input
                      type="text"
                      name="studentName"
                      required
                      value={regDetails.studentName}
                      onChange={handleInputChange}
                      placeholder={lang === 'id' ? 'Masukkan Nama Lengkap Calon Siswa' : 'Enter Full Name of Student'}
                      className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-primary text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  {/* NIK Siswa */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block">{lang === 'id' ? 'NIK Siswa *' : 'Student National ID (NIK) *'}</label>
                    <input
                      type="text"
                      name="nik"
                      required
                      maxLength={16}
                      pattern="[0-9]{16}"
                      value={regDetails.nik}
                      onChange={handleInputChange}
                      placeholder={lang === 'id' ? 'Masukkan NIK Siswa' : 'Enter Student NIK'}
                      className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-primary text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  {/* Tempat Tanggal Lahir Picker */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block">{lang === 'id' ? 'Tempat Lahir *' : 'Place of Birth *'}</label>
                      <input
                        type="text"
                        name="birthPlace"
                        required
                        value={regDetails.birthPlace}
                        onChange={handleInputChange}
                        placeholder={lang === 'id' ? 'Masukkan Tempat Lahir' : 'Enter Place of Birth'}
                        className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-primary text-slate-800 dark:text-slate-100"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block">{lang === 'id' ? 'Tanggal Lahir *' : 'Date of Birth *'}</label>
                      <input
                        type="date"
                        name="birthDate"
                        required
                        value={regDetails.birthDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-primary text-slate-800 dark:text-slate-100"
                      />
                    </div>
                  </div>

                  {/* Parent Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block">{lang === 'id' ? 'Nama Orang Tua / Wali *' : 'Parent / Guardian Name *'}</label>
                    <input
                      type="text"
                      name="parentName"
                      required
                      value={regDetails.parentName}
                      onChange={handleInputChange}
                      placeholder={lang === 'id' ? 'Masukkan Nama Orang Tua / Wali' : 'Enter Parent / Guardian Name'}
                      className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-primary text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone WhatsApp */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block">{lang === 'id' ? 'Nomor WhatsApp *' : 'WhatsApp Phone *'}</label>
                      <input
                        type="tel"
                        name="whatsapp"
                        required
                        value={regDetails.whatsapp}
                        onChange={handleInputChange}
                        placeholder={lang === 'id' ? 'Masukkan Nomor WhatsApp' : 'Enter WhatsApp Phone'}
                        className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-primary text-slate-800 dark:text-slate-100"
                      />
                    </div>

                    {/* Track selection */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block">{lang === 'id' ? 'Jalur Pendaftaran *' : 'Admission Track *'}</label>
                      <select
                        name="track"
                        value={regDetails.track}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-primary text-slate-800 dark:text-slate-100"
                      >
                        <option value="Zonasi">{lang === 'id' ? 'Zonasi (Desa Remen & Sekitar)' : 'Zonasi (Remen Village & Vicinity)'}</option>
                        <option value="Afirmasi">{lang === 'id' ? 'Afirmasi (Keluarga Harapan/Tidak Mampu)' : 'Afirmasi (Underprivileged)'}</option>
                        <option value="Prestasi">{lang === 'id' ? 'Prestasi (Akademik / Non-Akademik)' : 'Prestasi (Academic / Non-Academic)'}</option>
                        <option value="Mutasi">{lang === 'id' ? 'Mutasi (Pindahan Tugas Orang Tua)' : 'Mutasi (Parent Relocation)'}</option>
                      </select>
                    </div>
                  </div>

                  {/* Previous school TK */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block">{lang === 'id' ? 'Asal Sekolah (TK/RA) - Opsional' : 'Previous School (Kindergarten) - Optional'}</label>
                    <input
                      type="text"
                      name="prevSchool"
                      value={regDetails.prevSchool}
                      onChange={handleInputChange}
                      placeholder={lang === 'id' ? 'Masukkan Asal Sekolah (TK/RA) - Opsional' : 'Enter Previous School (Kindergarten) - Optional'}
                      className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-primary text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div className="flex items-start space-x-2 text-xs text-slate-400">
                  <input type="checkbox" required className="mt-0.5" />
                  <span>{lang === 'id' ? 'Saya menyatakan seluruh data dan dokumen yang diserahkan adalah asli, sah, dan dapat dipertanggungjawabkan.' : 'I declare that all submitted information is authentic and correct.'}</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-brand-primary hover:bg-brand-primary/95 text-white font-bold rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <Send className="h-4.5 w-4.5" />
                  <span>{lang === 'id' ? 'Kirim Pendaftaran' : 'Submit Registration'}</span>
                </button>
              </form>
            ) : (
              // Success printable card block
              <div className="p-8 space-y-6 text-center">
                <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle className="h-10 w-10" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-display font-extrabold text-2xl text-slate-800 dark:text-white">Pendaftaran Berhasil!</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Terima kasih, berkas pendaftaran online ananda telah kami terima secara instan.</p>
                </div>

                {/* Printable receipt ticket badge */}
                <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-dashed border-slate-200 dark:border-slate-700 text-left space-y-4">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                    <span>BUKTI PRA-REGISTRASI</span>
                    <span className="text-brand-orange">REF: SPMB-2026-{Math.floor(1000 + Math.random() * 9000)}</span>
                  </div>
                  
                  <div className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Nama Calon Siswa:</span>
                      <strong className="font-semibold text-slate-800 dark:text-slate-100">{regDetails.studentName}</strong>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">NISN Siswa:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-100">{regDetails.nisn || '-'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">NIK Siswa:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-100">{regDetails.nik}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">TTL:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-100">{regDetails.birthPlace}, {regDetails.birthDate}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Nama Orang Tua:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-100">{regDetails.parentName}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">No. WhatsApp:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-100">{regDetails.whatsapp}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Jalur Masuk:</span>
                        <span className="font-semibold text-brand-primary">{regDetails.track}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 dark:border-slate-700 pt-3 text-[10px] text-slate-400 text-center italic font-light">
                    *Simpan screenshot bukti ini. Panitia kami akan menghubungi Anda via WhatsApp dalam 1x24 jam kerja untuk penjadwalan verifikasi berkas asli di UPT SD Negeri Remen 2.
                  </div>
                </div>

                <button
                  onClick={() => setShowRegForm(false)}
                  className="px-6 py-2.5 bg-brand-navy hover:bg-brand-orange text-white font-semibold text-xs rounded-xl uppercase tracking-wider transition-all shadow-md w-full"
                >
                  {lang === 'id' ? 'Selesai' : 'Close'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
    </section>
  );
}
