import { CalendarEvent } from "@/components/Calendar/CalendarView.types";
import { isSameDay } from "./date.utils";

/**
 * Sort events by start time (ascending)
 */
export const sortEventsByTime = (events: CalendarEvent[]): CalendarEvent[] => {
  return [...events].sort(
    (a, b) => a.startDate.getTime() - b.startDate.getTime()
  );
};

/**
 * Filter events that occur on a specific day
 */
export const getEventsForDay = (
  events: CalendarEvent[],
  day: Date
): CalendarEvent[] => {
  return events.filter(
    (event) =>
      isSameDay(event.startDate, day) ||
      (event.startDate < day && event.endDate > day)
  );
};

/**
 * Check if two events overlap in time
 */
export const eventsOverlap = (a: CalendarEvent, b: CalendarEvent): boolean => {
  return a.startDate < b.endDate && a.endDate > b.startDate;
};

/**
 * Split multi-day events into daily chunks (for rendering)
 */
export const splitMultiDayEvent = (event: CalendarEvent): CalendarEvent[] => {
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);
  const parts: CalendarEvent[] = [];

  const current = new Date(start);
  while (current <= end) {
    const dayStart = new Date(current);
    const dayEnd = new Date(current);
    dayEnd.setHours(23, 59, 59, 999);

    const part: CalendarEvent = {
      ...event,
      id: `${event.id}-${current.toISOString().split("T")[0]}`,
      startDate: dayStart < event.startDate ? event.startDate : dayStart,
      endDate: dayEnd > event.endDate ? event.endDate : dayEnd,
    };
    parts.push(part);
    current.setDate(current.getDate() + 1);
  }
  return parts;
};

/**
 * Group events by day (for week view rendering)
 */
export const groupEventsByDay = (
  events: CalendarEvent[]
): Record<string, CalendarEvent[]> => {
  const grouped: Record<string, CalendarEvent[]> = {};
  events.forEach((event) => {
    const dateKey = event.startDate.toISOString().split("T")[0];
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(event);
  });
  return grouped;
};

/**
 * Get event duration in minutes
 */
export const getEventDurationMinutes = (event: CalendarEvent): number => {
  return (event.endDate.getTime() - event.startDate.getTime()) / (1000 * 60);
};

/**
 * Create a new calendar event object
 */
export const createEvent = (
  title: string,
  startDate: Date,
  endDate: Date,
  color = "#4f46e5",
  category?: string,
  description?: string
): CalendarEvent => {
  return {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    title,
    description,
    startDate,
    endDate,
    color,
    category,
  };
};
