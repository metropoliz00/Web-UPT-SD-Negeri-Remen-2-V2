import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import { defaultSchoolContent } from '../data/defaultContent';

// Helper to get environment variables
const getEnv = (key: string): string => {
  return process.env[key] || '';
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL') || getEnv('SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY') || getEnv('SUPABASE_ANON_KEY');

const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

async function getSchoolDataAsync() {
  if (!supabase) return defaultSchoolContent;
  try {
    const { data, error } = await supabase
      .from('cms_content')
      .select('data')
      .eq('id', 'content')
      .single();

    if (data && data.data) {
      return { ...defaultSchoolContent, ...(data.data as any) };
    }
  } catch (error) {
    console.error('Error fetching CMS content:', error);
  }
  return defaultSchoolContent;
}

let aiClient: any = null;
function getAIClient() {
  if (!aiClient) {
    const key = getEnv('GEMINI_API_KEY');
    if (key && key !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: { 'User-Agent': 'aistudio-build' }
        }
      });
    }
  }
  return aiClient;
}

export async function handleChat(message: string, _history: any[]) {
  const schoolData = await getSchoolDataAsync();
  const msg = message.toLowerCase();
  
  // 1. Cek Pertanyaan Umum (FAQ) dari CMS
  if (schoolData.faq && Array.isArray(schoolData.faq)) {
    const matchedFaq = schoolData.faq.find((f: any) => 
      msg.includes(f.question.toLowerCase()) || 
      f.question.toLowerCase().split(' ').every((word: string) => word.length > 3 && msg.includes(word))
    );
    if (matchedFaq) return matchedFaq.answer;
  }

  // 2. Logika Berbasis Kata Kunci (Keywords)
  
  // SPMB / Pendaftaran
  if (msg.includes('spmb') || msg.includes('ppdb') || msg.includes('daftar') || msg.includes('masuk') || msg.includes('pendaftaran')) {
    let response = `Informasi SPMB ${schoolData.schoolName}:\n`;
    response += `- Status: ${schoolData.ppdb?.status || 'Buka'}\n`;
    response += `- Sisa Kuota: ${(schoolData.ppdb?.kuota || 0) - (schoolData.ppdb?.kuotaTerisi || 0)} kursi\n`;
    if (schoolData.ppdb?.persyaratan) {
      response += `- Persyaratan: ${schoolData.ppdb.persyaratan.slice(0, 3).join(', ')}...\n`;
    }
    response += `Silakan cek menu SPMB untuk detail lengkap.`;
    return response;
  }

  // Kontak & Lokasi
  if (msg.includes('alamat') || msg.includes('lokasi') || msg.includes('dimana') || msg.includes('rute')) {
    return `UPT SD Negeri Remen 2 berlokasi di: ${schoolData.contact?.alamat || 'Desa Remen, Kec. Jenu, Tuban'}.`;
  }
  
  if (msg.includes('kontak') || msg.includes('telepon') || msg.includes('wa') || msg.includes('hubungi') || msg.includes('email')) {
    return `Anda bisa menghubungi kami melalui:\n- Telepon/WA: ${schoolData.contact?.telepon}\n- Email: ${schoolData.contact?.email}\n- Jam Kerja: ${schoolData.contact?.jamOperasional || '07:00 - 13:00 WIB'}`;
  }

  // Profil & Kepala Sekolah
  if (msg.includes('kepala') || msg.includes('nurhariadji') || msg.includes('pimpinan')) {
    return `Kepala Sekolah saat ini adalah Bapak ${schoolData.headmasterName}. Beliau menjabat sebagai ${schoolData.headmasterTitle}.`;
  }

  if (msg.includes('visi') || msg.includes('misi') || msg.includes('tujuan')) {
    return `Visi kami: "${schoolData.profil?.visi}"\n\nMisi kami diantaranya: ${(schoolData.profil?.misi || []).slice(0, 2).join(', ')}...`;
  }

  // Kegiatan & Ekskul
  if (msg.includes('ekskul') || msg.includes('ekstrakurikuler') || msg.includes('kegiatan') || msg.includes('pramuka')) {
    const ekskuls = (schoolData.ekstrakurikuler || []).map((e: any) => e.name).join(', ');
    return `Kami memiliki berbagai kegiatan ekstrakurikuler, antara lain: ${ekskuls || 'Pramuka, Drumband, Futsal, dll'}.`;
  }

  // Guru
  if (msg.includes('guru') || msg.includes('staf') || msg.includes('pengajar')) {
    const jumlahGuru = (schoolData.guru || []).length;
    return `UPT SD Negeri Remen 2 didukung oleh ${jumlahGuru} tenaga pendidik profesional. Daftar lengkap dapat dilihat di halaman "Guru & Staf".`;
  }

  // Prestasi
  if (msg.includes('prestasi') || msg.includes('juara') || msg.includes('menang')) {
    const prestasiTerbaru = (schoolData.prestasi || [])[0];
    if (prestasiTerbaru) return `Salah satu prestasi terbaru kami: ${prestasiTerbaru.title} (${prestasiTerbaru.category}).`;
    return `Siswa-siswi kami aktif meraih prestasi di tingkat Kabupaten maupun Provinsi. Detailnya ada di menu "Prestasi".`;
  }

  // Biaya
  if (msg.includes('biaya') || msg.includes('bayar') || msg.includes('gratis') || msg.includes('spp')) {
    return `Sebagai Sekolah Negeri, seluruh biaya pendidikan di UPT SD Negeri Remen 2 adalah GRATIS (bebas SPP) karena didukung oleh dana BOS Pemerintah.`;
  }

  // Berita
  if (msg.includes('berita') || msg.includes('info') || msg.includes('kabar')) {
    const beritaTerbaru = (schoolData.berita || [])[0];
    if (beritaTerbaru) return `Kabar terbaru: "${beritaTerbaru.title}" yang terbit pada ${beritaTerbaru.date}.`;
    return `Silakan kunjungi halaman "Berita" untuk melihat informasi dan kegiatan terbaru di sekolah kami.`;
  }

  // 3. Jawaban Default jika tidak ditemukan
  return `Halo! Saya adalah asisten otomatis SD Negeri Remen 2. Maaf, saya tidak mengerti pertanyaan tersebut. Coba tanyakan tentang "SPMB", "Lokasi Sekolah", "Daftar Ekskul", atau "Nama Kepala Sekolah".`;
}
