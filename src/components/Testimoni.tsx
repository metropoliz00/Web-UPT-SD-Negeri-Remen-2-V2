import React, { useState, useEffect } from 'react';
import { TestimoniItem } from '../types';
import { Quote, ChevronLeft, ChevronRight, Star, MessageSquare, X, CheckCircle, Smile } from 'lucide-react';
import { getTestimonials, addTestimonial } from '../supabase';

interface TestimoniProps {
  items: TestimoniItem[];
  lang: 'id' | 'en';
}

export default function Testimoni({ items, lang }: TestimoniProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visitorTestimonials, setVisitorTestimonials] = useState<TestimoniItem[]>([]);
  
  // Modal & Form States
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('Wali Murid');
  const [role, setRole] = useState('');
  const [contentInput, setContentInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Load visitor-submitted testimonials from Supabase
  useEffect(() => {
    let isMounted = true;
    const fetchVisitorTestimonials = async () => {
      try {
        const dataList = await getTestimonials();
        if (isMounted) {
          const fetched: TestimoniItem[] = dataList.map((data: any) => ({
            id: data.id,
            name: data.name || '',
            relation: data.relation || 'Warga Sekolah',
            role: data.role || 'Umum',
            content: data.content || '',
            avatar: data.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || 'W')}&background=random&color=fff&size=128`
          }));
          setVisitorTestimonials(fetched);
        }
      } catch (err) {
        console.error("Gagal mengambil suara komunitas pengunjung:", err);
      }
    };

    fetchVisitorTestimonials();
    return () => {
      isMounted = false;
    };
  }, []);

  // Combine default CMS testimonials with visitor submissions
  const allItems = [...items, ...visitorTestimonials];
  const totalItems = allItems.length;
  const safeActiveIndex = totalItems > 0 ? activeIndex % totalItems : 0;

  // Auto Slider
  useEffect(() => {
    if (totalItems === 0) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalItems);
    }, 5500);
    return () => clearInterval(timer);
  }, [totalItems]);

  const handlePrev = () => {
    if (totalItems === 0) return;
    setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

  const handleNext = () => {
    if (totalItems === 0) return;
    setActiveIndex((prev) => (prev + 1) % totalItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim() || !contentInput.trim()) return;

    setSubmitting(true);
    try {
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}&background=random&color=fff&size=128`;
      
      const newDoc = {
        name: name.trim(),
        relation: relation,
        role: role.trim(),
        content: contentInput.trim(),
        avatar: avatarUrl
      };

      const result = await addTestimonial(newDoc);
      
      // Prepend to local visitor list so it displays immediately
      setVisitorTestimonials(prev => [
        {
          id: result?.id || 'temp_' + Date.now(),
          name: name.trim(),
          relation: relation,
          role: role.trim(),
          content: contentInput.trim(),
          avatar: avatarUrl
        },
        ...prev
      ]);

      // Reset Form fields
      setName('');
      setRole('');
      setContentInput('');
      setSuccess(true);
      setActiveIndex(items.length); // Slide to the freshly added feedback!
    } catch (err) {
      console.error("Gagal mengirim suara komunitas:", err);
      alert(lang === 'id' ? 'Gagal mengirim testimoni. Silakan coba lagi.' : 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="testimoni" className="py-24 bg-brand-primary/5 dark:bg-slate-900 text-slate-900 dark:text-white relative overflow-hidden">
      {/* Immersive background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#60B5FF10,transparent_50%)] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full">
            {lang === 'id' ? 'Suara Komunitas' : 'Testimonials'}
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-brand-navy dark:text-white text-glow">
            {lang === 'id' ? 'Apa Kata Mereka Tentang Kami?' : 'What Our School Community Says'}
          </h2>
          <div className="h-1 w-20 bg-brand-primary mx-auto rounded-full" />
        </div>

        {totalItems > 0 ? (
          <div className="relative">
            {/* Quote mark decoration */}
            <Quote className="absolute -top-10 -left-6 h-20 w-20 text-brand-primary/10 pointer-events-none" />

            {/* Testimonial Active Card wrapper */}
            <div className="glass-panel bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 p-8 sm:p-12 rounded-3xl shadow-xl dark:shadow-2xl backdrop-blur-md relative min-h-[300px] flex flex-col justify-between transition-all duration-500">
              <div className="space-y-6">
                {/* Star rating design */}
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4.5 w-4.5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Speech */}
                <p className="text-base sm:text-lg md:text-xl font-light italic leading-relaxed text-slate-600 dark:text-slate-300 break-words">
                  "{allItems[safeActiveIndex].content}"
                </p>
              </div>

              {/* User Profile Info Footer */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-100 dark:border-white/10">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-brand-primary shadow-inner bg-slate-100 flex-shrink-0">
                    <img
                      src={allItems[safeActiveIndex].avatar}
                      alt={allItems[safeActiveIndex].name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm sm:text-base text-brand-navy dark:text-white leading-tight">
                      {allItems[safeActiveIndex].name}
                    </h4>
                    <span className="text-xs text-brand-primary font-medium block">
                      {allItems[safeActiveIndex].relation}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-extrabold uppercase tracking-widest bg-brand-orange text-white px-2.5 py-1 rounded-md">
                  {allItems[safeActiveIndex].role}
                </span>
              </div>
            </div>

            {/* Sliding buttons & pagination dots */}
            <div className="flex justify-center items-center space-x-4 mt-8">
              <button
                onClick={handlePrev}
                className="p-3 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 rounded-2xl transition-colors cursor-pointer text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              {/* Pagination dots */}
              <div className="flex space-x-2 overflow-x-auto max-w-[150px] py-1 scrollbar-none">
                {allItems.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`h-2.5 rounded-full transition-all flex-shrink-0 cursor-pointer ${
                      safeActiveIndex === idx ? 'w-8 bg-brand-primary' : 'w-2.5 bg-slate-300 dark:bg-white/20 hover:bg-slate-400 dark:hover:bg-white/45'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="p-3 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 rounded-2xl transition-colors cursor-pointer text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-slate-500 italic">Belum ada testimoni.</p>
        )}

        {/* Action Button to Open Dialog */}
        <div className="flex justify-center mt-12">
          <button
            onClick={() => {
              setSuccess(false);
              setIsOpen(true);
            }}
            className="group relative inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-gradient-to-r from-brand-primary to-indigo-600 hover:from-brand-primary/90 hover:to-indigo-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:shadow-brand-primary/30 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
          >
            <MessageSquare className="h-4.5 w-4.5" />
            <span>{lang === 'id' ? 'Kirim Suara Komunitas Anda' : 'Submit Your Feedback'}</span>
          </button>
        </div>
      </div>

      {/* Testimonial Submission Modal Popup */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden transform transition-all animate-scale-up">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-brand-primary to-indigo-600 px-6 py-5 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Smile className="h-5.5 w-5.5" />
                <div>
                  <h3 className="font-display font-bold text-base sm:text-lg leading-tight">
                    {lang === 'id' ? 'Bagikan Pengalaman Anda' : 'Share Your Experience'}
                  </h3>
                  <p className="text-[10px] text-white/80 font-medium mt-0.5">
                    {lang === 'id' ? 'Suara Anda sangat berarti bagi sekolah kami' : 'Your voice matters to our school community'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-xl text-white/95 hover:text-white transition-all cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {success ? (
                <div className="text-center py-8 space-y-4">
                  <div className="mx-auto h-16 w-16 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center shadow-inner">
                    <CheckCircle className="h-10 w-10" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-display font-bold text-base sm:text-lg text-slate-800 dark:text-white">
                      {lang === 'id' ? 'Terima Kasih Banyak!' : 'Thank You Very Much!'}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                      {lang === 'id' 
                        ? 'Komentar Anda telah berhasil disimpan dan tampil secara langsung di bagian Suara Komunitas.' 
                        : 'Your feedback has been successfully submitted and is now displayed on the main page.'}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="mt-6 px-6 py-2.5 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-primary/95 transition-all cursor-pointer shadow-md shadow-brand-primary/15"
                  >
                    {lang === 'id' ? 'Tutup' : 'Close'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Name Input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 dark:text-slate-400 font-bold uppercase tracking-wider block">
                      {lang === 'id' ? 'Nama Lengkap' : 'Full Name'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={lang === 'id' ? 'Contoh: Ahmad Budiman, S.Pd.' : 'e.g. Jane Doe'}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all font-bold"
                    />
                  </div>

                  {/* Grid for Relation and Role */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Relation */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 dark:text-slate-400 font-bold uppercase tracking-wider block">
                        {lang === 'id' ? 'Hubungan dengan Sekolah' : 'Relation'}
                      </label>
                      <select
                        value={relation}
                        onChange={(e) => setRelation(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all font-bold"
                      >
                        <option value="Wali Murid">{lang === 'id' ? 'Wali Murid / Orang Tua' : 'Parent'}</option>
                        <option value="Alumni">{lang === 'id' ? 'Alumni Sekolah' : 'Alumni'}</option>
                        <option value="Siswa">{lang === 'id' ? 'Siswa Aktif' : 'Student'}</option>
                        <option value="Tokoh Masyarakat">{lang === 'id' ? 'Tokoh Masyarakat' : 'Community Leader'}</option>
                        <option value="Guru">{lang === 'id' ? 'Guru / Staff' : 'Teacher / Staff'}</option>
                      </select>
                    </div>

                    {/* Role */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 dark:text-slate-400 font-bold uppercase tracking-wider block">
                        {lang === 'id' ? 'Peran / Jabatan / Kelas' : 'Role Description'} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder={lang === 'id' ? 'Contoh: Wali Kelas 4, Alumni 2021' : 'e.g. Parent of 5th Grader'}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all font-semibold"
                      />
                    </div>
                  </div>

                  {/* Testimonial Content */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 dark:text-slate-400 font-bold uppercase tracking-wider block">
                      {lang === 'id' ? 'Pesan / Suara Komunitas Anda' : 'Your Testimonial'} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={contentInput}
                      onChange={(e) => setContentInput(e.target.value)}
                      placeholder={lang === 'id' ? 'Tuliskan kesan, pesan, atau testimoni positif Anda mengenai sekolah kami...' : 'Write your warm message or experience with our school...'}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all leading-relaxed"
                    />
                  </div>

                  {/* Submission Buttons */}
                  <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer"
                    >
                      {lang === 'id' ? 'Batal' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-2.5 bg-gradient-to-r from-brand-primary to-indigo-600 hover:from-brand-primary/95 hover:to-indigo-700 disabled:opacity-55 text-white font-bold text-xs rounded-xl shadow-md shadow-brand-primary/10 hover:shadow-lg transition-all cursor-pointer flex items-center space-x-1.5"
                    >
                      {submitting ? (
                        <>
                          <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>{lang === 'id' ? 'Mengirim...' : 'Submitting...'}</span>
                        </>
                      ) : (
                        <span>{lang === 'id' ? 'Kirim Testimoni' : 'Submit Testimonial'}</span>
                      )}
                    </button>
                  </div>

                </form>
              )}
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
