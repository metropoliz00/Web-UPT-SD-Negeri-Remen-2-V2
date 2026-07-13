import React, { useState, useEffect } from 'react';
import { format, isSameDay, parseISO, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, addMonths, subMonths, isSameMonth, getDay } from 'date-fns';
import { id } from 'date-fns/locale';
import { AgendaItem } from '../types';
import { ChevronLeft, ChevronRight, Plus, Trash2, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { getAgendas, addAgenda, deleteAgenda } from '../supabase';
import { useCMS } from '../context/CMSContext';

interface Holiday {
  date: string;
  localName: string;
}

export default function CalendarComponent({ lang, agenda: initialAgenda }: { lang: 'id' | 'en', agenda: AgendaItem[] }) {
  const { isLoggedIn } = useCMS();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [agendas, setAgendas] = useState<AgendaItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newAgenda, setNewAgenda] = useState({ title: '', description: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch Agendas
  const fetchAgendas = async () => {
    setIsLoading(true);
    try {
      const dbAgendas = await getAgendas();
      // Merge with initialAgenda (from CMS content) if any, or just use dbAgendas
      // For this specific request, we prioritize the "agenda database"
      const formattedDbAgendas: AgendaItem[] = dbAgendas.map(a => ({
        id: a.id,
        date: a.date,
        title: a.title,
        description: a.description || ''
      }));
      
      // Combine with initial if needed, or just replace
      setAgendas(formattedDbAgendas);
    } catch (err) {
      console.error("Failed to fetch agendas:", err);
      setAgendas(initialAgenda);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgendas();
  }, []);

  useEffect(() => {
    fetch(`https://date.nager.at/api/v3/PublicHolidays/${format(currentDate, 'yyyy')}/ID`)
      .then(res => res.json())
      .then(data => setHolidays(data))
      .catch(err => console.error(err));
  }, [currentDate]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Starts Monday
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const selectedDateAgenda = agendas.filter(item => 
    isSameDay(parseISO(item.date), selectedDate)
  );

  const handleAddAgenda = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgenda.title.trim()) return;

    try {
      setIsLoading(true);
      const agendaToSave = {
        date: format(selectedDate, 'yyyy-MM-dd'),
        title: newAgenda.title,
        description: newAgenda.description,
        color: 'primary'
      };

      await addAgenda(agendaToSave);
      setNewAgenda({ title: '', description: '' });
      setIsAdding(false);
      await fetchAgendas();
    } catch (err) {
      console.error("Failed to add agenda:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAgenda = async (id: string) => {
    if (!confirm(lang === 'id' ? 'Hapus agenda ini?' : 'Delete this agenda?')) return;
    
    try {
      setIsLoading(true);
      await deleteAgenda(id);
      await fetchAgendas();
    } catch (err) {
      console.error("Failed to delete agenda:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
            <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white min-w-[150px] text-center">
            {format(currentDate, 'MMMM yyyy', { locale: lang === 'id' ? id : undefined })}
          </h2>
          <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
            <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
        </div>
        
        {isLoggedIn && (
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-xl hover:bg-brand-primary/90 transition-all font-bold text-sm shadow-md"
          >
            <Plus className="w-4 h-4" />
            {lang === 'id' ? 'Tambah Agenda' : 'Add Agenda'}
          </button>
        )}
      </div>

      {isLoggedIn && (
        <div className="mb-4 p-3.5 bg-brand-primary/10 border border-brand-primary/20 rounded-xl text-xs font-bold text-brand-navy dark:text-brand-light flex items-center gap-2.5">
          <span className="flex h-2.5 w-2.5 rounded-full bg-brand-primary animate-pulse" />
          <span>
            {lang === 'id' 
              ? 'Mode Edit Aktif: Klik pada tanggal mana saja di kalender untuk langsung menambah Agenda Kegiatan sekolah pada tanggal tersebut.' 
              : 'Edit Mode Active: Click on any date in the calendar to immediately add school Agenda Activities for that date.'}
          </span>
        </div>
      )}

      {isAdding && (
        <div className="mb-8 p-6 bg-brand-bg dark:bg-slate-900/50 rounded-2xl border border-brand-primary/20 animate-in fade-in slide-in-from-top-4">
          <h3 className="font-bold text-brand-navy dark:text-white mb-4 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-brand-primary" />
            {lang === 'id' ? 'Agenda Baru untuk' : 'New Agenda for'} {format(selectedDate, 'd MMMM yyyy', { locale: lang === 'id' ? id : undefined })}
          </h3>
          <form onSubmit={handleAddAgenda} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Judul Agenda</label>
              <input 
                type="text" 
                required
                placeholder={lang === 'id' ? 'Contoh: Rapat Wali Murid' : 'Example: Parent Meeting'}
                value={newAgenda.title}
                onChange={e => setNewAgenda({...newAgenda, title: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-primary outline-none transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Deskripsi (Opsional)</label>
              <textarea 
                placeholder={lang === 'id' ? 'Tulis detail kegiatan...' : 'Write activity details...'}
                value={newAgenda.description}
                onChange={e => setNewAgenda({...newAgenda, description: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-primary outline-none transition-all h-24"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setIsAdding(false)}
                className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                {lang === 'id' ? 'Batal' : 'Cancel'}
              </button>
              <button 
                type="submit" 
                disabled={isLoading}
                className="px-6 py-2.5 rounded-xl bg-brand-primary text-white font-bold hover:bg-brand-primary/90 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {lang === 'id' ? 'Simpan Agenda' : 'Save Agenda'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map(day => (
          <div key={day} className="text-center text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase py-2">
            {day}
          </div>
        ))}
        {calendarDays.map((day, idx) => {
          const dayAgenda = agendas.filter(item => isSameDay(parseISO(item.date), day));
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isHoliday = holidays.some(h => h.date === format(day, 'yyyy-MM-dd'));
          const isSunday = getDay(day) === 0;
          
          return (
            <div 
              key={idx} 
              onClick={() => {
                setSelectedDate(day);
                if (isLoggedIn) {
                  setIsAdding(true);
                }
              }}
              className={`relative h-20 sm:h-28 p-1.5 rounded-xl border transition-all duration-300 cursor-pointer group flex flex-col justify-between
                ${!isCurrentMonth ? 'opacity-30' : ''}
                ${isSelected 
                  ? 'bg-brand-primary/15 border-brand-primary ring-2 ring-brand-primary/25' 
                  : isHoliday 
                    ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/40 hover:border-rose-400'
                    : dayAgenda.length > 0
                      ? 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900/40 hover:border-indigo-400'
                      : isSunday
                        ? 'bg-red-50/20 dark:bg-red-950/5 border-slate-100 dark:border-slate-700/50 hover:border-brand-primary/40'
                        : 'bg-slate-50 dark:bg-slate-700/20 border-slate-100 dark:border-slate-700/50 hover:border-brand-primary/40'
                }
              `}
            >
              <div className="flex justify-between items-start w-full">
                <span className={`text-xs sm:text-sm font-bold ${
                  isSelected 
                    ? 'text-brand-primary font-black' 
                    : isHoliday 
                      ? 'text-rose-600 dark:text-rose-400 font-extrabold' 
                      : dayAgenda.length > 0
                        ? 'text-indigo-600 dark:text-indigo-400 font-extrabold'
                        : isSunday 
                          ? 'text-red-500' 
                          : 'text-slate-800 dark:text-white'
                }`}>
                  {format(day, 'd')}
                </span>
                
                {/* Mobile indicators top-right */}
                <div className="flex gap-0.5 sm:hidden">
                  {isHoliday && <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />}
                  {dayAgenda.length > 0 && <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />}
                </div>
              </div>
              
              {/* Agenda / Holiday Labels on Desktop */}
              <div className="mt-1 space-y-1 hidden sm:block overflow-hidden flex-1 w-full select-none">
                {isHoliday && (
                  <div 
                    className="text-[9px] leading-tight font-black bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 px-1.5 py-0.5 rounded truncate" 
                    title={holidays.find(h => h.date === format(day, 'yyyy-MM-dd'))?.localName}
                  >
                    🎉 {holidays.find(h => h.date === format(day, 'yyyy-MM-dd'))?.localName}
                  </div>
                )}
                {dayAgenda.slice(0, 2).map((item, i) => (
                  <div 
                    key={i} 
                    className="text-[9px] leading-tight font-bold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded truncate" 
                    title={item.title}
                  >
                    📌 {item.title}
                  </div>
                ))}
                {dayAgenda.length > 2 && (
                  <div className="text-[8px] text-indigo-600 dark:text-indigo-400 font-black px-1.5">
                    +{dayAgenda.length - 2} {lang === 'id' ? 'kegiatan' : 'more'}
                  </div>
                )}
              </div>

              {/* Hover Tooltip */}
              {(dayAgenda.length > 0 || isHoliday) && (
                <div className="absolute z-20 hidden group-hover:block w-52 p-3.5 bg-white dark:bg-slate-800 shadow-2xl rounded-xl border border-slate-100 dark:border-slate-700 -top-2 left-1/2 -translate-x-1/2 -translate-y-full mb-2">
                  {isHoliday && (
                    <div className="mb-2 pb-1.5 border-b border-rose-100 dark:border-rose-900/30">
                      <p className="text-[9px] text-slate-400 uppercase tracking-widest font-black">{lang === 'id' ? 'Hari Libur Nasional' : 'Public Holiday'}</p>
                      <p className="text-xs font-bold text-rose-600 dark:text-rose-400 mt-0.5">🎉 {holidays.find(h => h.date === format(day, 'yyyy-MM-dd'))?.localName}</p>
                    </div>
                  )}
                  {dayAgenda.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[9px] text-slate-400 uppercase tracking-widest font-black">{lang === 'id' ? 'Agenda Sekolah' : 'School Agenda'}</p>
                      {dayAgenda.map((item, i) => (
                        <div key={i} className={i > 0 ? 'pt-1.5 border-t border-slate-100 dark:border-slate-700/50' : ''}>
                          <p className="text-xs font-bold text-brand-navy dark:text-white line-clamp-1">📌 {item.title}</p>
                          {item.description && <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">{item.description}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white dark:bg-slate-800 border-r border-b border-slate-100 dark:border-slate-700 rotate-45"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 border-t border-slate-100 dark:border-slate-700 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-brand-primary" />
            {lang === 'id' ? 'Detail Agenda' : 'Agenda Detail'}: {format(selectedDate, 'd MMMM yyyy', { locale: lang === 'id' ? id : undefined })}
          </h3>
        </div>

        {isLoading && agendas.length === 0 ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
          </div>
        ) : selectedDateAgenda.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {selectedDateAgenda.map(item => (
              <div key={item.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700 group relative">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-bold text-brand-navy dark:text-white text-lg">{item.title}</h4>
                    {item.description && (
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">{item.description}</p>
                    )}
                  </div>
                  {isLoggedIn && (
                    <button 
                      onClick={() => handleDeleteAgenda(item.id)}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700">
            <CalendarIcon className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              {lang === 'id' ? 'Tidak ada agenda di tanggal ini.' : 'No agenda scheduled for this date.'}
            </p>
            {isLoggedIn && (
              <button 
                onClick={() => setIsAdding(true)}
                className="mt-4 text-brand-primary font-bold text-sm hover:underline"
              >
                + {lang === 'id' ? 'Tambah agenda baru' : 'Add new agenda'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
