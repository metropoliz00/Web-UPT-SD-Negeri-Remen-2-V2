import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, Sparkles, User, RefreshCw } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

export default function Chatbot({ lang }: { lang: 'id' | 'en' }) {
  const { content } = useCMS();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: lang === 'id' 
        ? "Halo! Saya Asisten Otomatis UPT SD Negeri Remen 2 Tuban. Silakan tanyakan informasi seputar sekolah kami!" 
        : "Hello! I am the automated assistant of UPT SD Negeri Remen 2 Tuban. Please ask any information regarding our school!"
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const getBotResponse = (msg: string): string => {
    const cleanMsg = msg.toLowerCase().trim();

    // 1. FAQ Matching
    if (content.faq && Array.isArray(content.faq)) {
      const matchedFaq = content.faq.find((f: any) => {
        const q = f.question.toLowerCase();
        return cleanMsg.includes(q) || q.includes(cleanMsg);
      });
      if (matchedFaq) {
        return matchedFaq.answer;
      }

      // Try word overlap for FAQ
      for (const faq of content.faq) {
        const qWords = faq.question.toLowerCase().split(/\s+/).filter(w => w.length > 3);
        const matchCount = qWords.filter(w => cleanMsg.includes(w)).length;
        if (matchCount >= 2 || (qWords.length === 1 && matchCount === 1)) {
          return faq.answer;
        }
      }
    }

    // 2. SPMB / Admission
    if (
      cleanMsg.includes('spmb') || 
      cleanMsg.includes('daftar') || 
      cleanMsg.includes('pendaftaran') || 
      cleanMsg.includes('masuk') || 
      cleanMsg.includes('persyaratan') || 
      cleanMsg.includes('syarat') || 
      cleanMsg.includes('kuota')
    ) {
      const status = content.ppdb?.status || 'Buka';
      const kuota = content.ppdb?.kuota || 28;
      const terisi = content.ppdb?.kuotaTerisi || 0;
      const sisa = Math.max(0, kuota - terisi);
      const syarat = content.ppdb?.persyaratan && Array.isArray(content.ppdb.persyaratan)
        ? content.ppdb.persyaratan.map((s: string) => `• ${s}`).join('\n')
        : '';
      
      let res = `📋 Informasi Pendaftaran Siswa Baru (SPMB):\n`;
      res += `• Status: ${status === 'Buka' || status === 'buka' ? '🟢 Terbuka / Sedang Buka' : '🔴 Ditutup'}\n`;
      res += `• Kuota: ${kuota} kursi (Terisi: ${terisi} kursi, Sisa: ${sisa} kursi)\n`;
      if (syarat) {
        res += `\nPersyaratan Berkas:\n${syarat}\n`;
      }
      res += `\nSilakan kunjungi menu "SPMB" di menu navigasi untuk pendaftaran online atau informasi selengkapnya!`;
      return res;
    }

    // 3. Kepala Sekolah
    if (
      cleanMsg.includes('kepala') || 
      cleanMsg.includes('kepsek') || 
      cleanMsg.includes('nurhariadji') || 
      cleanMsg.includes('pimpinan')
    ) {
      return `Kepala UPT SD Negeri Remen 2 Tuban saat ini dijabat oleh Bapak ${content.headmasterName || 'Nurhariadji, S.Pd.'} (${content.headmasterTitle || 'Kepala UPT SD Negeri Remen 2'}).`;
    }

    // 4. NPSN
    if (cleanMsg.includes('npsn') || cleanMsg.includes('nomor pokok sekolah')) {
      return `NPSN (Nomor Pokok Sekolah Nasional) UPT SD Negeri Remen 2 Tuban adalah: ${content.npsn || '20505101'}.`;
    }

    // 5. Alamat / Lokasi / Kontak / Hubungi
    if (
      cleanMsg.includes('alamat') || 
      cleanMsg.includes('lokasi') || 
      cleanMsg.includes('dimana') || 
      cleanMsg.includes('peta') || 
      cleanMsg.includes('jenu') || 
      cleanMsg.includes('tuban') || 
      cleanMsg.includes('remen')
    ) {
      return `UPT SD Negeri Remen 2 Tuban berlokasi di:\n📍 ${content.contact?.alamat || 'Desa Remen, Kec. Jenu, Kabupaten Tuban, Jawa Timur'}.\n\nAnda dapat mengunjungi halaman "Kontak" untuk melihat peta lokasi interaktif.`;
    }

    if (
      cleanMsg.includes('hubungi') || 
      cleanMsg.includes('kontak') || 
      cleanMsg.includes('telepon') || 
      cleanMsg.includes('no wa') || 
      cleanMsg.includes('email') || 
      cleanMsg.includes('wa') || 
      cleanMsg.includes('whatsapp') || 
      cleanMsg.includes('nomor')
    ) {
      return `Silakan hubungi kami melalui kontak resmi sekolah berikut:\n📞 Telepon/WA: ${content.contact?.telepon || '085604431706'}\n✉️ Email: ${content.contact?.email || 'admin@sdnremen2.sch.id'}\n⏰ Jam Pelayanan: ${content.contact?.jamOperasional || 'Senin - Sabtu, 07:00 - 13:00 WIB'}`;
    }

    // 6. Visi & Misi
    if (
      cleanMsg.includes('visi') || 
      cleanMsg.includes('misi') || 
      cleanMsg.includes('tujuan') || 
      cleanMsg.includes('semboyan') || 
      cleanMsg.includes('motto')
    ) {
      const visi = content.profil?.visi || 'Mewujudkan insan agamis, unggul dalam prestasi, berkarakter bangsa, dan peduli lingkungan.';
      const misi = content.profil?.misi && Array.isArray(content.profil.misi)
        ? content.profil.misi.map((m: string, i: number) => `${i + 1}. ${m}`).join('\n')
        : '';
      
      let res = `✨ Visi Sekolah:\n"${visi}"\n`;
      if (misi) {
        res += `\n✨ Misi Sekolah:\n${misi}`;
      }
      return res;
    }

    // 7. Ekstrakurikuler / Ekskul
    if (
      cleanMsg.includes('ekskul') || 
      cleanMsg.includes('ekstrakurikuler') || 
      cleanMsg.includes('kegiatan') || 
      cleanMsg.includes('pramuka') || 
      cleanMsg.includes('drumband') || 
      cleanMsg.includes('silat') || 
      cleanMsg.includes('futsal')
    ) {
      const ekskuls = content.ekstrakurikuler && Array.isArray(content.ekstrakurikuler)
        ? content.ekstrakurikuler.map((e: any) => `• ${e.name}: ${e.description || 'Kegiatan ekstrakurikuler sekolah'}`).join('\n')
        : '';
      
      if (ekskuls) {
        return `🎯 Daftar Ekstrakurikuler di UPT SD Negeri Remen 2:\n${ekskuls}\n\nSiswa didorong aktif memilih ekskul penunjang minat bakat!`;
      }
      return `🎯 Ekstrakurikuler unggulan kami antara lain: Pramuka (Wajib), Drumband, Pencak Silat, Futsal, Tari Tradisional, dan Keagamaan.`;
    }

    // 8. Biaya / Gratis / SPP / Bayar
    if (
      cleanMsg.includes('biaya') || 
      cleanMsg.includes('spp') || 
      cleanMsg.includes('gratis') || 
      cleanMsg.includes('bayar') || 
      cleanMsg.includes('uang') || 
      cleanMsg.includes('pendaftaran berapa')
    ) {
      return `Sebagai lembaga sekolah negeri resmi di bawah naungan Kemendikbudristek, seluruh biaya pendidikan, SPP, dan uang pendaftaran di UPT SD Negeri Remen 2 Tuban adalah GRATIS (0 IDR / Bebas Biaya) yang sepenuhnya didukung oleh program dana BOS Pemerintah.`;
    }

    // 9. Guru / Pengajar / Staf / Pegawai
    if (
      cleanMsg.includes('guru') || 
      cleanMsg.includes('staf') || 
      cleanMsg.includes('pengajar') || 
      cleanMsg.includes('pendidik') || 
      cleanMsg.includes('pegawai')
    ) {
      const totalGuru = content.guru && Array.isArray(content.guru) ? content.guru.length : 0;
      let res = `👨‍🏫 UPT SD Negeri Remen 2 Tuban didukung oleh ${totalGuru || 12} tenaga pendidik dan kependidikan profesional.\n`;
      if (content.guru && Array.isArray(content.guru)) {
        res += `Beberapa diantaranya:\n` + content.guru.slice(0, 4).map((g: any) => `• ${g.name} (${g.role})`).join('\n');
      }
      res += `\nDaftar lengkap dapat Anda lihat di menu "Guru & Staf" pada sub-menu Profil Sekolah.`;
      return res;
    }

    // 10. Prestasi / Lomba / Juara
    if (
      cleanMsg.includes('prestasi') || 
      cleanMsg.includes('juara') || 
      cleanMsg.includes('menang') || 
      cleanMsg.includes('piala') || 
      cleanMsg.includes('lomba')
    ) {
      const prestasis = content.prestasi && Array.isArray(content.prestasi)
        ? content.prestasi.slice(0, 3).map((p: any) => `🏆 [${p.category}] ${p.title} - ${p.description}`).join('\n')
        : '';
      
      if (prestasis) {
        return `🏆 Beberapa Prestasi Terbaru UPT SD Negeri Remen 2 Tuban:\n${prestasis}\n\nSelengkapnya dapat dilihat di menu "Prestasi" pada website!`;
      }
      return `Siswa-siswi kami aktif menorehkan prestasi gemilang di tingkat Kecamatan maupun Kabupaten, baik dalam bidang akademik maupun non-akademik (seperti Pramuka, Olahraga, dan Seni).`;
    }

    // 11. Berita / Kabar / Info Terbaru
    if (
      cleanMsg.includes('berita') || 
      cleanMsg.includes('kabar') || 
      cleanMsg.includes('artikel') || 
      cleanMsg.includes('info')
    ) {
      const news = content.berita && Array.isArray(content.berita)
        ? content.berita.slice(0, 2).map((b: any) => `📰 "${b.title}" (${b.date})`).join('\n')
        : '';
      if (news) {
        return `📰 Berita & Kegiatan Terbaru Sekolah:\n${news}\n\nSilakan kunjungi menu "Berita" di website untuk membaca detail artikel selengkapnya!`;
      }
    }

    // 12. Sarana & Prasarana / Fasilitas
    if (
      cleanMsg.includes('fasilitas') || 
      cleanMsg.includes('sarana') || 
      cleanMsg.includes('kelas') || 
      cleanMsg.includes('lapangan') || 
      cleanMsg.includes('ruang') || 
      cleanMsg.includes('gedung')
    ) {
      return `Fasilitas sarana prasarana kami meliputi: Ruang Kelas Representatif, Ruang UKS Nyaman, Perpustakaan Lengkap, Lapangan Olahraga, Area Parkir, Area Bermain, dan Lingkungan Asri yang mendukung kenyamanan belajar siswa.`;
    }

    // Default Fallback
    return `Halo! Terima kasih atas pertanyaannya. Saya dapat menginformasikan seputar:\n` +
           `1. Informasi SPMB / Pendaftaran Siswa Baru\n` +
           `2. Profil Sekolah, NPSN, Visi & Misi\n` +
           `3. Nama Kepala Sekolah (${content.headmasterName || 'Bapak Nurhariadji'})\n` +
           `4. Alamat & Kontak Resmi Sekolah\n` +
           `5. Daftar Ekstrakurikuler & Prestasi\n` +
           `6. Fasilitas, Biaya Sekolah (Gratis!), & Guru\n\n` +
           `Silakan tanyakan hal-hal di atas atau ketik kata kunci seperti "SPMB", "Alamat", "Kontak", atau "Ekskul".`;
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    // Simulate response delay for nice UX with a typing indicator
    setTimeout(() => {
      const reply = getBotResponse(text);
      const botMsg: Message = { sender: 'bot', text: reply };
      setMessages((prev) => [...prev, botMsg]);
      setIsLoading(false);
    }, 600);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage(inputText);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        sender: 'bot',
        text: lang === 'id' 
          ? "Halo! Saya Asisten Otomatis UPT SD Negeri Remen 2 Tuban. Silakan tanyakan informasi seputar sekolah kami!" 
          : "Hello! I am the automated assistant of UPT SD Negeri Remen 2 Tuban. Please ask any information regarding our school!"
      }
    ]);
  };


  return (
    <div className="fixed bottom-20 xl:bottom-6 left-6 z-50">
      
      {/* Floating Trigger circular button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-brand-primary text-slate-950 hover:bg-brand-orange hover:text-white shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer border border-white/20 animate-pulse"
          title="Tanya Asisten AI"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      {/* Expanded Dialog Box */}
      {isOpen && (
        <div className="w-[90vw] sm:w-[380px] h-[500px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between overflow-hidden animate-fade-in relative z-50">
          
          {/* Header Panel */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="h-9 w-9 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
                <Bot className="h-5 w-5 text-brand-primary" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Asisten Digital</h4>
                <h3 className="text-xs sm:text-sm font-bold text-white flex items-center">
                  <span>AI UPT SD Negeri Remen 2</span>
                  <Sparkles className="h-3 w-3 text-brand-orange ml-1" />
                </h3>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Reset clicker */}
              <button
                onClick={handleResetChat}
                className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer"
                title="Reset Chat"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
              {/* Close clicker */}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer"
                title="Tutup Chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Scrolling Log panel */}
          <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto space-y-4 bg-slate-50 dark:bg-slate-950/40">
            {messages.map((msg, idx) => {
              const isBot = msg.sender === 'bot';
              return (
                <div key={idx} className={`flex ${isBot ? 'justify-start' : 'justify-end'} items-start space-x-2.5`}>
                  {isBot && (
                    <div className="h-7 w-7 rounded-lg bg-brand-primary text-slate-950 flex items-center justify-center flex-shrink-0 border border-white/10 text-xs">
                      🤖
                    </div>
                  )}
                  <div className={`p-3.5 rounded-2xl max-w-[80%] text-xs sm:text-sm leading-relaxed ${
                    isBot
                      ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-800 shadow-sm'
                      : 'bg-brand-primary text-slate-950 font-medium rounded-tr-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              );
            })}

            {/* Loading Indicator dots bubble */}
            {isLoading && (
              <div className="flex justify-start items-center space-x-2.5">
                <div className="h-7 w-7 rounded-lg bg-brand-primary text-slate-950 flex items-center justify-center flex-shrink-0 text-xs">
                  🤖
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center space-x-1">
                  <span className="h-2 w-2 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>

          {/* Message text input box */}
          <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex items-center space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={lang === 'id' ? 'Tulis pesan Anda...' : 'Type a question...'}
              disabled={isLoading}
              className="flex-grow px-3.5 py-2 text-xs sm:text-sm bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary disabled:opacity-50"
            />
            <button
              onClick={() => handleSendMessage(inputText)}
              disabled={isLoading || !inputText.trim()}
              className="p-2.5 bg-brand-primary hover:bg-brand-orange text-slate-950 hover:text-white rounded-xl transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
