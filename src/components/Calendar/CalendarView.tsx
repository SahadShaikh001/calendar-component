// src/components/Calendar/CalendarView.tsx
import React, { useCallback, useState } from 'react';
import { CalendarViewProps, CalendarEvent } from './CalendarView.types';
import { useCalendar } from '@/hooks/useCalendar';
import { MonthView } from './MonthView';
import { WeekView } from './WeekView';
import { EventModal } from './EventModal';
import { useEventManager } from '@/hooks/useEventManager';
import { Button } from '@/components/primitives/Button';

export const CalendarView: React.FC<CalendarViewProps> = ({
  events: initialEvents = [],
  onEventAdd,
  onEventUpdate,
  onEventDelete,
  initialView = 'month',
  initialDate = new Date()
}) => {
  // Use local manager but notify parent callbacks to stay compatible with external API
  const { events, addEvent, updateEvent, deleteEvent, moveEvent } = useEventManager(initialEvents);
  // If parent provided handlers, forward changes
  const forwardAdd = useCallback((e: CalendarEvent) => {
    addEvent(e);
    onEventAdd?.(e);
  }, [addEvent, onEventAdd]);

  const forwardUpdate = useCallback((id: string, updates: Partial<CalendarEvent>) => {
    updateEvent(id, updates);
    onEventUpdate?.(id, updates);
  }, [updateEvent, onEventUpdate]);

  const forwardDelete = useCallback((id: string) => {
    deleteEvent(id);
    onEventDelete?.(id);
  }, [deleteEvent, onEventDelete]);

  const { currentDate, view, goToNext, goToPrevious, goToToday, setViewMode, setCurrentDate } = useCalendar(initialDate, initialView);

  // modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [activeEvent, setActiveEvent] = useState<CalendarEvent | null>(null);
  const [modalInitialDate, setModalInitialDate] = useState<Date | null>(null);

  const handleDayClick = useCallback((d: Date) => {
    setActiveEvent(null);
    setModalInitialDate(d);
    setModalOpen(true);
  }, []);

  const handleEventClick = useCallback((ev: CalendarEvent) => {
    setActiveEvent(ev);
    setModalOpen(true);
  }, []);

  const handleSave = useCallback((payload: CalendarEvent) => {
    if (activeEvent) {
      forwardUpdate(activeEvent.id, payload);
    } else {
      forwardAdd(payload);
    }
  }, [activeEvent, forwardAdd, forwardUpdate]);

  const handleDelete = useCallback((id: string) => {
    forwardDelete(id);
  }, [forwardDelete]);

  // for week drag create
  const handleCreateRange = useCallback((start: Date, end: Date) => {
    setActiveEvent(null);
    setModalInitialDate(start);
    setModalOpen(true);
    // store created start/end in modal by passing initialDate and we'll let modal use it. Alternatively, could open prefilled modal.
  }, []);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={goToPrevious}>Prev</Button>
          <Button variant="ghost" onClick={goToToday}>Today</Button>
          <Button variant="ghost" onClick={goToNext}>Next</Button>
        </div>
        <div className="flex items-center gap-2">
          <select aria-label="Select view" value={view} onChange={(e) => setViewMode(e.target.value as any)} className="px-2 py-1 border rounded">
            <option value="month">Month</option>
            <option value="week">Week</option>
          </select>
          <div className="text-sm font-medium">{currentDate.toLocaleString(undefined, { month: 'long', year: 'numeric' })}</div>
        </div>
      </div>

      {view === 'month' ? (
        <MonthView date={currentDate} events={events} onDayClick={handleDayClick} onEventClick={handleEventClick} selectedDate={modalInitialDate} />
      ) : (
        <WeekView date={currentDate} events={events} onEventClick={handleEventClick} onCreateRange={(s, e) => {
          // open modal with computed start/end prefilled via modalInitialDate and activeEvent? We pass initialDate=start and rely on EventModal to set times.
          setModalInitialDate(s);
          setActiveEvent(null);
          setModalOpen(true);
        }} />
      )}

      <EventModal
        open={modalOpen}
        event={activeEvent}
        initialDate={modalInitialDate}
        onClose={() => setModalOpen(false)}
        onSave={(data) => {
          if (activeEvent) {
            forwardUpdate(activeEvent.id, data);
          } else {
            // ensure id generated and populated
            forwardAdd(data);
          }
          setModalOpen(false);
        }}
        onDelete={(id) => {
          forwardDelete(id);
          setModalOpen(false);
        }}
      />
    </div>
  );
};
