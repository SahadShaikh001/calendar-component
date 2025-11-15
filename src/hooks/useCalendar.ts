import { useState, useCallback } from 'react';

export type View = 'month' | 'week';

export const useCalendar = (initialDate = new Date(), initialView: View = 'month') => {
  const [currentDate, setCurrentDate] = useState<Date>(initialDate);
  const [view, setView] = useState<View>(initialView);
  const goToNext = useCallback(() => {
    if (view === 'month') setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
    else setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7));
  }, [view]);
  const goToPrevious = useCallback(() => {
    if (view === 'month') setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    else setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7));
  }, [view]);
  const goToToday = useCallback(() => setCurrentDate(new Date()), []);
  const setViewMode = useCallback((v: View) => setView(v), []);
  return { currentDate, view, goToNext, goToPrevious, goToToday, setViewMode, setCurrentDate };
};
