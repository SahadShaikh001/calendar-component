import React, { useMemo } from 'react';
import { getCalendarGrid, isSameMonth } from '@/utils/date.utils';
import { CalendarEvent } from './CalendarView.types';
import { CalendarCell } from './CalendarCell';

interface MonthViewProps {
  date: Date;
  events: CalendarEvent[];
  onDayClick: (d: Date) => void;
  onEventClick: (e: CalendarEvent) => void;
  selectedDate?: Date | null;
}

export const MonthView: React.FC<MonthViewProps> = ({ date, events, onDayClick, onEventClick, selectedDate }) => {
  const grid = useMemo(() => getCalendarGrid(date), [date]);
  const eventsByDay = useMemo(() => {
    const m = new Map<string, CalendarEvent[]>();
    for (const ev of events) {
      const key = `${ev.startDate.getFullYear()}-${ev.startDate.getMonth()}-${ev.startDate.getDate()}`;
      const arr = m.get(key) ?? [];
      arr.push(ev);
      m.set(key, arr);
    }
    return m;
  }, [events]);

  return (
    <div className="grid grid-cols-7 gap-1">
      {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d) => (
        <div key={d} className="text-xs text-neutral-500 text-center py-1">{d}</div>
      ))}
      {grid.map((day) => {
        const key = `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`;
        const evs = eventsByDay.get(key) ?? [];
        const isCurrentMonth = isSameMonth(day, date);
        const isSelected = selectedDate ? day.toDateString() === selectedDate.toDateString() : false;
        return (
          <CalendarCell
            key={key}
            date={day}
            events={evs}
            isCurrentMonth={isCurrentMonth}
            onClick={onDayClick}
            onEventClick={onEventClick}
            isSelected={isSelected}
          />
        );
      })}
    </div>
  );
};
