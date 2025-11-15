// src/components/Calendar/CalendarView.types.ts

/** Represents a single event on the calendar */
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  color?: string;
  category?: string;
}

/** Props for the main CalendarView component */
export interface CalendarViewProps {
  events: CalendarEvent[];
  onEventAdd: (event: CalendarEvent) => void;
  onEventUpdate: (id: string, updates: Partial<CalendarEvent>) => void;
  onEventDelete: (id: string) => void;
  initialView?: 'month' | 'week';
  initialDate?: Date;
}

/** Represents the current view mode */
export type CalendarViewMode = 'month' | 'week';

/** Represents a focusable grid cell for keyboard navigation */
export interface FocusedCell {
  row: number;
  col: number;
}

/** Represents the drag-to-create or drag-to-resize state */
export interface DragState {
  isDragging: boolean;
  startY: number | null;
  endY: number | null;
  day: Date | null;
  startTime?: string;
  endTime?: string;
}

/** Represents the event creation/editing modal form */
export interface EventFormData {
  id?: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  color: string;
  category?: string;
}

/** Represents a time slot cell for week view */
export interface TimeSlot {
  time: string; // e.g. "09:00"
  date: Date;
}
