import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare, Send, CheckCircle, Smartphone, Loader2 } from 'lucide-react';
import { ContactInfo } from '../types';
import Toast, { ToastType } from './Toast';

interface KontakProps {
  info: ContactInfo;
  lang: 'id' | 'en';
}

export default function Kontak({ info, lang }: KontakProps) {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const [toast, setToast] = useState<{ message: string, type: ToastType, isVisible: boolean }>({
    message: '',
    type: 'success',
    isVisible: false
  });

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type, isVisible: true });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) {
      showToast(lang === 'id' ? 'Silakan lengkapi seluruh kolom.' : 'Please fill all fields.', 'error');
      return;
    }
    
    setIsSending(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setIsSubmitted(true);
        showToast(lang === 'id' ? 'Pesan berhasil dikirim!' : 'Message sent successfully!', 'success');
      } else {
        showToast(data.error || (lang === 'id' ? 'Gagal mengirim pesan.' : 'Failed to send message.'), 'error');
      }
    } catch (err) {
      showToast(lang === 'id' ? 'Koneksi server terganggu.' : 'Server connection error.', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const handleWhatsAppRedirect = () => {
    const text = encodeURIComponent(`Halo Admin UPT SD Negeri Remen 2 Tuban,\n\nNama saya *${formState.name || 'Wali Murid'}*.\nEmail: ${formState.email || '-'}\n\nPesan:\n_${formState.message || 'Saya ingin menanyakan info pendaftaran sekolah...'}_`);
    
    // Convert 08... or +62... to 62... format for WhatsApp
    let waPhone = info.telepon.replace(/\D/g, '');
    if (waPhone === '6281234567890' || waPhone === '81234567890') {
      waPhone = '6285604431706'; // override default if not changed in CMS yet
    } else if (waPhone.startsWith('0')) {
      waPhone = '62' + waPhone.substring(1);
    }
    window.open(`https://wa.me/${waPhone}?text=${text}`, '_blank');
  };

  return (
    <section id="kontak" className="py-24 bg-white dark:bg-slate-950 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full">
            {lang === 'id' ? 'Hubungi Kami' : 'Get In Touch'}
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-800 dark:text-white tracking-tight">
            {lang === 'id' ? 'Hubungi Sekretariat Administrasi Sekolah' : 'Contact Our Admissions & Admin Office'}
          </h2>
          <div className="h-1 w-20 bg-brand-orange mx-auto rounded-full" />
        </div>

        {/* Top Section: Info & Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Left: Contact Info details */}
          <div className="space-y-6 flex flex-col">
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6 flex-grow">
              <h3 className="font-display font-bold text-lg text-slate-800 dark:text-white mb-2">{lang === 'id' ? 'Informasi Kontak Resmi' : 'Official Office Contact'}</h3>

              {/* Alamat */}
              <div className="flex items-start space-x-3.5">
                <div className="h-10 w-10 rounded-xl bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-brand-orange" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Alamat Lengkap</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-light leading-relaxed mt-0.5">{info.alamat}</p>
                </div>
              </div>

              {/* Telepon */}
              <div className="flex items-start space-x-3.5">
                <div className="h-10 w-10 rounded-xl bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-brand-orange" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Nomor Telepon / HP</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-light mt-0.5">{info.telepon}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-3.5">
                <div className="h-10 w-10 rounded-xl bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-brand-orange" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Surat Elektronik (Email)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-light mt-0.5">{info.email}</p>
                </div>
              </div>

              {/* Jam */}
              <div className="flex items-start space-x-3.5">
                <div className="h-10 w-10 rounded-xl bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 text-brand-orange" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Jam Operasional Kantor</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-light mt-0.5">{info.jamOperasional}</p>
                </div>
              </div>
            </div>

            {/* Instant Messaging Hotlines */}
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 rounded-3xl flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                <Smartphone className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-white leading-tight">{lang === 'id' ? 'Layanan Live WhatsApp' : 'Live Helpdesk WhatsApp'}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">{lang === 'id' ? 'Respons instan pada jam operasional sekolah.' : 'Instant reply during active working hours.'}</p>
                <button
                  onClick={handleWhatsAppRedirect}
                  className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 hover:underline mt-1.5 flex items-center cursor-pointer"
                >
                  {lang === 'id' ? 'Kirim Pesan WA Baru' : 'Send WA Message'} →
                </button>
              </div>
            </div>
          </div>

          {/* Right: Google Map */}
          <div className="relative rounded-3xl overflow-hidden h-full min-h-[400px] shadow-lg border border-slate-100 dark:border-slate-800">
            <iframe
              className="absolute inset-0 w-full h-full border-0"
              src={info.mapsEmbedUrl}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer"
              title="Lokasi Sekolah"
            />
          </div>
        </div>

        {/* Bottom Section: Contact Form */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 sm:p-10 rounded-3xl max-w-4xl mx-auto">
          {!isSubmitted ? (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="space-y-1 text-center">
                <h3 className="font-display font-bold text-2xl text-slate-800 dark:text-white">{lang === 'id' ? 'Kirim Pesan Anda' : 'Send Us a Message'}</h3>
                <p className="text-sm text-slate-400">{lang === 'id' ? 'Sampaikan keluhan, pertanyaan, saran, atau aduan langsung melalui formulir di bawah ini' : 'Leave your concerns, questions, or suggestions directly via the form below'}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nama */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">{lang === 'id' ? 'Nama Lengkap Anda' : 'Your Full Name'}</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formState.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Setiawan"
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-orange text-slate-800 dark:text-slate-100 transition-all"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">{lang === 'id' ? 'Alamat Email Anda' : 'Your Email Address'}</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formState.email}
                    onChange={handleInputChange}
                    placeholder="e.g. setiawan@gmail.com"
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-orange text-slate-800 dark:text-slate-100 transition-all"
                  />
                </div>
              </div>

              {/* Pesan */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">{lang === 'id' ? 'Isi Pesan Anda' : 'Message details'}</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={formState.message}
                  onChange={handleInputChange}
                  placeholder={lang === 'id' ? 'Tuliskan pesan atau pertanyaan Anda di sini...' : 'Type your inquiries here...'}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-orange text-slate-800 dark:text-slate-100 transition-all resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  type="submit"
                  disabled={isSending}
                  className="flex-grow py-4 bg-brand-orange hover:bg-brand-navy text-white font-black rounded-xl text-sm tracking-widest uppercase transition-all flex items-center justify-center space-x-3 cursor-pointer shadow-lg disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {isSending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  )}
                  <span>{isSending ? (lang === 'id' ? 'Mengirim...' : 'Sending...') : (lang === 'id' ? 'Kirim Surel Sekarang' : 'Send Email Now')}</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppRedirect}
                  disabled={isSending}
                  className="py-4 px-8 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl text-sm tracking-widest uppercase transition-all flex items-center justify-center space-x-3 cursor-pointer shadow-lg disabled:opacity-70 group"
                >
                  <MessageSquare className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </form>
          ) : (
            // Submission receipt confirmation
            <div className="text-center py-12 px-6 space-y-6">
              <div className="h-20 w-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="h-12 w-12" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-extrabold text-3xl text-slate-800 dark:text-white">Pesan Terkirim!</h3>
                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-light max-w-lg mx-auto">
                  Terima kasih, Bapak/Ibu <strong>{formState.name}</strong>. Tim administrasi kami akan merespons pesan Anda sesegera mungkin ke email <strong>{formState.email}</strong>.
                </p>
              </div>
              <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-8 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-xl uppercase tracking-wider transition-all hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  Kirim Pesan Baru
                </button>
                <button
                  onClick={handleWhatsAppRedirect}
                  className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-md"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>Kirim ke WhatsApp</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
    </section>
  );
}
