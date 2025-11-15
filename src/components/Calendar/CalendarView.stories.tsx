import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CalendarView } from './CalendarView';
import { CalendarEvent } from './CalendarView.types';

const meta: Meta<typeof CalendarView> = {
  title: 'Components/Calendar/CalendarView',
  component: CalendarView,
};
export default meta;

const sampleEvents: CalendarEvent[] = [
  {
    id: 'evt-1',
    title: 'Team Standup',
    startDate: new Date(2024, 0, 15, 9, 0),
    endDate: new Date(2024, 0, 15, 9, 30),
    color: '#3b82f6',
    category: 'Meeting',
  },
  {
    id: 'evt-2',
    title: 'Design Review',
    startDate: new Date(2024, 0, 15, 14, 0),
    endDate: new Date(2024, 0, 15, 15, 30),
    color: '#10b981',
    category: 'Design',
  },
];

export const Default: StoryObj = {
  render: () => {
    const [events, setEvents] = useState<CalendarEvent[]>(sampleEvents);
    return (
      <div className="max-w-4xl">
        <CalendarView
          events={events}
          onEventAdd={(e) => setEvents((s) => [...s, e])}
          onEventUpdate={(id, updates) =>
            setEvents((s) => s.map((ev) => (ev.id === id ? { ...ev, ...updates } : ev)))
          }
          onEventDelete={(id) => setEvents((s) => s.filter((ev) => ev.id !== id))}
        />
      </div>
    );
  },
};

export const Empty: StoryObj = {
  render: () => {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    return (
      <div className="max-w-4xl">
        <CalendarView
          events={events}
          onEventAdd={(e) => setEvents((s) => [...s, e])}
          onEventUpdate={(id, updates) =>
            setEvents((s) => s.map((ev) => (ev.id === id ? { ...ev, ...updates } : ev)))
          }
          onEventDelete={(id) => setEvents((s) => s.filter((ev) => ev.id !== id))}
        />
      </div>
    );
  },
};

export const LargeDataset: StoryObj = {
  render: () => {
    const today = new Date(2024, 0, 1);
    const many: CalendarEvent[] = Array.from({ length: 25 }).map((_, i) => {
      const d = new Date(today.getFullYear(), today.getMonth(), (i % 28) + 1, 9 + (i % 8), 0);
      return {
        id: `evt-${i}`,
        title: `Event ${i}`,
        startDate: d,
        endDate: new Date(d.getTime() + 60 * 60 * 1000),
        color: ['#3b82f6', '#10b981', '#f59e0b'][i % 3],
        category: 'Auto',
      };
    });
    const [events, setEvents] = useState<CalendarEvent[]>(many);
    return (
      <div className="max-w-4xl">
        <CalendarView
          events={events}
          onEventAdd={(e) => setEvents((s) => [...s, e])}
          onEventUpdate={(id, updates) =>
            setEvents((s) => s.map((ev) => (ev.id === id ? { ...ev, ...updates } : ev)))
          }
          onEventDelete={(id) => setEvents((s) => s.filter((ev) => ev.id !== id))}
        />
      </div>
    );
  },
};
