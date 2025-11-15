import { startOfMonth, endOfMonth, startOfWeek, addDays, isSameDay, isSameMonth } from 'date-fns';

export const getCalendarGrid = (date: Date): Date[] => {
  const start = startOfWeek(startOfMonth(date), { weekStartsOn: 0 });
  const grid: Date[] = [];
  const copy = new Date(start);
  for (let i = 0; i < 42; i++) {
    grid.push(new Date(copy));
    copy.setDate(copy.getDate() + 1);
  }
  return grid;
};

export const isToday = (d: Date) => isSameDay(d, new Date());

export const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

export const eventsForDay = (date: Date, events: { startDate: Date }[]) =>
  events.filter((e) => isSameDay(e.startDate, date));

export { isSameDay, isSameMonth };
