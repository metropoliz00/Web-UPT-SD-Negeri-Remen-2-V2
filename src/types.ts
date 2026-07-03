export interface Dokumen {
  id: string;
  title: string;
  url: string;
}

export interface StatItem {
  id: string;
  label: string;
  value: number;
  suffix?: string;
}

export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string;
}

export interface KeunggulanItem {
  id: string;
  title: string;
  description: string;
  iconName: string; // Lucide icon name
}

export interface ProgramItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
}

export interface PrestasiItem {
  id: string;
  title: string;
  category: 'Siswa' | 'Guru' | 'Sekolah';
  subCategory?: 'Akademik' | 'Non akademik';
  date: string;
  achievement: string;
  image: string;
  description: string;
}

export interface GuruItem {
  id: string;
  name: string;
  nip?: string;
  role: string;
  subject: string;
  photo: string;
  socials?: {
    instagram?: string;
    facebook?: string;
    email?: string;
  };
}

export interface GaleriItem {
  id: string;
  title: string;
  category: 'Kegiatan' | 'Prestasi' | 'Pembelajaran' | 'Sarana';
  url: string;
}

export interface BeritaItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  date: string;
  thumbnail: string;
}

export interface TestimoniItem {
  id: string;
  name: string;
  role: 'Orang Tua' | 'Alumni' | 'Guru' | 'Siswa';
  relation: string; // e.g. "Orang Tua Siswa Kelas 4"
  content: string;
  avatar: string;
}

export interface EkstrakurikulerItem {
  id: string;
  name: string;
  iconName: string;
  description: string;
  pembina: string;
  waktu: string;
  dokumen?: Dokumen[];
}

export interface PPDBConfig {
  status: 'Open' | 'Closed';
  kuota: number;
  kuotaTerisi: number;
  jadwal: { phase: string; date: string }[];
  persyaratan: string[];
  alur: { step: number; title: string; desc: string }[];
  countdownDate: string; // ISO string or date string e.g. "2026-07-31T23:59:59"
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface AgendaItem {
  id: string;
  date: string; // YYYY-MM-DD or formatted
  title: string;
  description: string;
  color?: string; // 'primary' | 'orange' | 'green' etc.
}

export interface ContactInfo {
  alamat: string;
  telepon: string;
  email: string;
  jamOperasional: string;
  mapsEmbedUrl: string;
  socials: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    youtube?: string;
    website?: string;
  };
}

export interface VideoItem {
  id: string;
  youtubeId: string;
  title: string;
  duration: string;
  category: string;
  thumbnail: string;
}

export interface PerpustakaanConfig {
  deskripsi: string;
  foto: string;
  stats: { label: string; value: string }[];
  fasilitas: { id: string; nama: string; deskripsi: string; iconName: string }[];
  program: { id: string; nama: string; deskripsi: string; jadwal: string }[];
  dokumen?: Dokumen[];
}

export interface UKSConfig {
  deskripsi: string;
  foto: string;
  stats: { label: string; value: string }[];
  fasilitas: { id: string; nama: string; deskripsi: string; iconName: string }[];
  program: { id: string; nama: string; deskripsi: string; jadwal: string }[];
  dokumen?: Dokumen[];
}

export interface SchoolContent {
  schoolName: string;
  npsn: string;
  headmasterName: string;
  headmasterTitle: string;
  logoUrl: string;
  headmasterSpeech: string;
  headmasterPhoto: string;
  heroTitle: string;
  heroSubtitle: string;
  heroVideoUrlOrImage: string;
  heroCarousel: string[];
  motto: string;
  visionStatement: string;
  visi: string;
  misi: string;
  tujuan: string;
  stats: StatItem[];
  historyTimeline: TimelineEvent[];
  keunggulan: KeunggulanItem[];
  programs: ProgramItem[];
  prestasi: PrestasiItem[];
  guru: GuruItem[];
  galeri: GaleriItem[];
  berita: BeritaItem[];
  testimoni: TestimoniItem[];
  ekstrakurikuler: EkstrakurikulerItem[];
  sarana: SaranaItem[];
  ppdb: PPDBConfig;
  faq: FAQItem[];
  contact: ContactInfo;
  runningText: string;
  runningTextSpeed: number;
  agenda: AgendaItem[];
  popupBannerUrl?: string;
  strukturSekolah: StrukturItem[];
  strukturKomite: StrukturItem[];
  strukturSekolahImageUrl?: string;
  strukturKomiteImageUrl?: string;
  strukturUKSImageUrl?: string;
  strukturPerpustakaanImageUrl?: string;
  strukturEkskulImageUrl?: string;
  dokumen?: Dokumen[];
  videos?: VideoItem[];
  perpustakaan?: PerpustakaanConfig;
  uks?: UKSConfig;
  isTextToSpeechEnabled?: boolean;
}

export interface SaranaItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export interface StrukturItem {
  id: string;
  name: string;
  nip?: string;
  role: string; // Pengawas, Kepala Sekolah, Guru Kelas, Guru PAI, Guru PJOK, Adminitrasi, Penjaga Sekolah, Siswa, Ketua Komite, Wakil Ketua Komite, Sekretaris Bendahara, Bidang-Bidang, Anggota
  tugasMengajar?: string; // Tugas mengajar
  tugasTambahan?: string; // Tugas tambahan
  photo: string;
  order: number;
  parentId?: string;
  position?: { x: number; y: number };
  connectionType?: 'komando' | 'koordinasi';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}
