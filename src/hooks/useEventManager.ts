// src/hooks/useEventManager.ts
import { useCallback, useEffect, useState } from 'react';
import { CalendarEvent } from '@/components/Calendar/CalendarView.types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'calendar_events_v1';

export const useEventManager = (initial?: CalendarEvent[]) => {
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return initial ?? [];
      const parsed = JSON.parse(raw) as any[];
      return parsed.map((p) => ({
        ...p,
        startDate: new Date(p.startDate),
        endDate: new Date(p.endDate),
      }));
    } catch {
      return initial ?? [];
    }
  });

  // persist (debounced simple)
  useEffect(() => {
    const toStore = events.map((e) => ({ ...e, startDate: e.startDate.toISOString(), endDate: e.endDate.toISOString() }));
    const t = setTimeout(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore)), 250);
    return () => clearTimeout(t);
  }, [events]);

  const addEvent = useCallback((ev: Omit<CalendarEvent, 'id'>) => {
    const newEv: CalendarEvent = { ...ev, id: uuidv4() };
    setEvents((s) => [...s, newEv]);
    return newEv;
  }, []);

  const updateEvent = useCallback((id: string, updates: Partial<CalendarEvent>) => {
    setEvents((s) => s.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents((s) => s.filter((e) => e.id !== id));
  }, []);

  // Move event (used by drag-and-drop)
  const moveEvent = useCallback((id: string, newStart: Date, newEnd: Date) => {
    setEvents((s) => s.map((e) => (e.id === id ? { ...e, startDate: newStart, endDate: newEnd } : e)));
  }, []);

  return {
    events,
    setEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    moveEvent,
  };
};
