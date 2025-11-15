import React, { useCallback, useMemo } from 'react';
import { CalendarEvent } from './CalendarView.types';
import { isToday as isTodayUtil } from '@/utils/date.utils';
import clsx from 'clsx';

interface CalendarCellProps {
  date: Date;
  events: CalendarEvent[];
  isCurrentMonth: boolean;
  onClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  isSelected?: boolean;
}

export const CalendarCell: React.FC<CalendarCellProps> = React.memo(
  ({ date, events, isCurrentMonth, onClick, onEventClick, isSelected }) => {
    const today = isTodayUtil(date);
    const eventCount = events.length;
    const dayNumber = date.getDate();

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') onClick(date);
      },
      [date, onClick]
    );

    const bgClass = useMemo(
      () =>
        clsx(
          'border border-neutral-200 h-32 p-2 hover:bg-neutral-50 transition-colors cursor-pointer',
          { 'text-neutral-400': !isCurrentMonth, 'ring-2 ring-primary-200': isSelected }
        ),
      [isCurrentMonth, isSelected]
    );

    return (
      <div
        role="button"
        tabIndex={0}
        aria-label={`${date.toDateString()}. ${eventCount} events.`}
        aria-pressed={!!isSelected}
        onKeyDown={handleKeyDown}
        onClick={() => onClick(date)}
        className={bgClass}
      >
        <div className="flex justify-between items-start mb-1">
          <span className={clsx('text-sm font-medium', { 'text-neutral-900': isCurrentMonth })}>{dayNumber}</span>
          {today && (
            <span className="w-6 h-6 bg-primary-500 rounded-full text-white text-xs flex items-center justify-center">
              {dayNumber}
            </span>
          )}
        </div>
        <div className="space-y-1 overflow-hidden">
          {events.slice(0, 3).map((ev) => (
            <div
              key={ev.id}
              onClick={(e) => {
                e.stopPropagation();
                onEventClick(ev);
              }}
              className="text-xs px-2 py-1 rounded truncate"
              style={{ backgroundColor: ev.color ?? '#e5e7eb' }}
              title={`${ev.title} ${new Date(ev.startDate).toLocaleTimeString()}`}
            >
              {ev.title}
            </div>
          ))}
          {eventCount > 3 && (
            <button onClick={(e) => { e.stopPropagation(); onClick(date); }} className="text-xs text-primary-600 hover:underline">
              +{eventCount - 3} more
            </button>
          )}
        </div>
      </div>
    );
  }
);
CalendarCell.displayName = 'CalendarCell';
