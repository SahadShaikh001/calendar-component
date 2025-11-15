// src/components/Calendar/WeekView.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CalendarEvent } from './CalendarView.types';
import { startOfWeek, addDays, format, differenceInMinutes, isSameDay } from 'date-fns';
import clsx from 'clsx';

interface WeekViewProps {
  date: Date;
  events: CalendarEvent[];
  onEventClick: (ev: CalendarEvent) => void;
  onCreateRange: (start: Date, end: Date) => void;
  className?: string;
}

const SLOT_MINUTES = 30;
const DAY_START_HOUR = 0;
const DAY_END_HOUR = 24;

export const WeekView: React.FC<WeekViewProps> = ({
  date,
  events,
  onEventClick,
  onCreateRange,
  className,
}) => {
  const weekStart = useMemo(() => startOfWeek(date, { weekStartsOn: 0 }), [date]);
  const days = useMemo(() => Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i)), [weekStart]);
  const totalSlots = ((DAY_END_HOUR - DAY_START_HOUR) * 60) / SLOT_MINUTES;
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Drag-to-create
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<{ dayIndex: number; startSlot: number; endSlot: number } | null>(null);
  const [, forceRerender] = useState(0);

  const slotToDate = useCallback(
    (dayIndex: number, slotIndex: number) => {
      const day = days[dayIndex];
      const minutes = DAY_START_HOUR * 60 + slotIndex * SLOT_MINUTES;
      const d = new Date(day);
      d.setHours(0, 0, 0, 0);
      d.setMinutes(minutes);
      return d;
    },
    [days]
  );

  // Pointer event handlers
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let pointerDown = false;
    let startDay = -1;
    let startSlot = -1;

    const getDaySlotFromEvent = (ev: PointerEvent | MouseEvent) => {
      const cell = (ev.target as HTMLElement).closest('[data-day-index][data-slot-index]') as HTMLElement | null;
      if (!cell) return null;
      const dayIndex = Number(cell.getAttribute('data-day-index'));
      const slotIndex = Number(cell.getAttribute('data-slot-index'));
      if (Number.isNaN(dayIndex) || Number.isNaN(slotIndex)) return null;
      return { dayIndex, slotIndex };
    };

    const onPointerDown = (e: PointerEvent) => {
      const pos = getDaySlotFromEvent(e);
      if (!pos) return;
      pointerDown = true;
      startDay = pos.dayIndex;
      startSlot = pos.slotIndex;
      dragRef.current = { dayIndex: pos.dayIndex, startSlot: pos.slotIndex, endSlot: pos.slotIndex + 1 };
      setDragging(true);
      (e.target as HTMLElement).setPointerCapture?.((e as any).pointerId);
      forceRerender((v) => v + 1);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!pointerDown) return;
      const pos = getDaySlotFromEvent(e);
      if (!pos) return;
      const a = Math.min(startSlot, pos.slotIndex);
      const b = Math.max(startSlot + 1, pos.slotIndex + 1);
      dragRef.current = { dayIndex: pos.dayIndex, startSlot: a, endSlot: b };
      forceRerender((v) => v + 1);
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!pointerDown) return;
      pointerDown = false;
      setDragging(false);
      if (dragRef.current) {
        const start = slotToDate(dragRef.current.dayIndex, dragRef.current.startSlot);
        const end = slotToDate(dragRef.current.dayIndex, dragRef.current.endSlot);
        onCreateRange(start, end);
      }
      dragRef.current = null;
      forceRerender((v) => v + 1);
    };

    el.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      el.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [slotToDate, onCreateRange]);

  // Position events
  const positionedEvents = useMemo(() => {
    const result: Array<{
      ev: CalendarEvent;
      dayIndex: number;
      topPercent: number;
      heightPercent: number;
      minutesFromStart: number;
      minutesDuration: number;
    }> = [];

    events.forEach((ev) => {
      for (let i = 0; i < days.length; i++) {
        const d = days[i];
        if (
          (ev.startDate <= d && ev.endDate > d) || // spans into day
          isSameDay(ev.startDate, d)
        ) {
          const start = ev.startDate < d ? new Date(d.setHours(0, 0, 0, 0)) : ev.startDate;
          const end = ev.endDate > addDays(d, 1) ? addDays(d, 1) : ev.endDate;
          const minutesFromStart = start.getHours() * 60 + start.getMinutes();
          const minutesDuration = Math.max(15, differenceInMinutes(end, start));
          const topPercent = (minutesFromStart / (24 * 60)) * 100;
          const heightPercent = (minutesDuration / (24 * 60)) * 100;
          result.push({ ev, dayIndex: i, topPercent, heightPercent, minutesFromStart, minutesDuration });
        }
      }
    });

    return result;
  }, [events, days]);

  // Overlap handling
  const columnsByEventId = useMemo(() => {
    const map = new Map<string, { col: number; cols: number }>();
    for (let d = 0; d < 7; d++) {
      const evs = positionedEvents
        .filter((p) => p.dayIndex === d)
        .sort((a, b) => a.minutesFromStart - b.minutesFromStart);

      const columns: Array<Array<typeof evs[0]>> = [];
      evs.forEach((e) => {
        let placed = false;
        for (let i = 0; i < columns.length; i++) {
          const col = columns[i];
          const last = col[col.length - 1];
          if (e.minutesFromStart >= last.minutesFromStart + last.minutesDuration) {
            col.push(e);
            map.set(e.ev.id, { col: i, cols: 0 });
            placed = true;
            break;
          }
        }
        if (!placed) {
          columns.push([e]);
          map.set(e.ev.id, { col: columns.length - 1, cols: 0 });
        }
      });

      // Assign total columns
      columns.forEach((col, i) => {
        col.forEach((ev) => {
          map.set(ev.ev.id, { col: map.get(ev.ev.id)!.col, cols: columns.length });
        });
      });
    }
    return map;
  }, [positionedEvents]);

  // Grid headers
  const dayHeaders = (
    <div className="grid grid-cols-7 border-b border-neutral-200">
      {days.map((d) => (
        <div key={d.toDateString()} className="p-2 text-sm font-medium text-center">
          <div>{format(d, 'EEE')}</div>
          <div className="text-xs text-neutral-500">{format(d, 'MMM d')}</div>
        </div>
      ))}
    </div>
  );

  // Time labels
  const timeLabels = useMemo(() => {
    const arr = [];
    for (let i = 0; i < totalSlots; i++) {
      const minutes = i * SLOT_MINUTES;
      const hh = Math.floor(minutes / 60);
      const mm = minutes % 60;
      arr.push(`${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`);
    }
    return arr;
  }, [totalSlots]);

  return (
    <div className={clsx('w-full overflow-auto', className)}>
      {dayHeaders}
      <div className="flex">
        <div className="w-14 shrink-0 border-r border-neutral-100">
          <div className="h-10" />
          <div className="flex flex-col">
            {timeLabels.map((label, idx) => (
              <div key={idx} className="h-8 text-xs text-right pr-1 leading-8 text-neutral-500">
                {label}
              </div>
            ))}
          </div>
        </div>

        <div ref={containerRef} className="flex-1 grid grid-cols-7 relative">
          {days.map((d, dayIndex) => (
            <div key={dayIndex} className="relative border-l border-neutral-100 min-h-[1920px]">
              <div className="absolute inset-0">
                {Array.from({ length: totalSlots }).map((_, slotIndex) => (
                  <div
                    key={slotIndex}
                    data-day-index={dayIndex}
                    data-slot-index={slotIndex}
                    className="h-8 border-b border-neutral-100"
                    role="button"
                    tabIndex={0}
                    aria-label={`Slot ${slotIndex}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const start = slotToDate(dayIndex, slotIndex);
                        const end = slotToDate(dayIndex, slotIndex + 1);
                        onCreateRange(start, end);
                      }
                    }}
                  />
                ))}
              </div>

              {/* Events */}
              <div className="relative z-10">
                {positionedEvents
                  .filter((p) => p.dayIndex === dayIndex)
                  .map((p) => {
                    const colInfo = columnsByEventId.get(p.ev.id) ?? { col: 0, cols: 1 };
                    const widthPercent = 100 / colInfo.cols;
                    const leftPercent = colInfo.col * widthPercent;
                    return (
                      <div
                        key={p.ev.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(p.ev);
                        }}
                        className="absolute shadow-sm cursor-pointer p-1 rounded-md text-white text-xs overflow-hidden"
                        style={{
                          top: `${p.topPercent}%`,
                          height: `${p.heightPercent}%`,
                          left: `${leftPercent}%`,
                          width: `calc(${widthPercent}% - 4px)`,
                          backgroundColor: p.ev.color ?? '#3b82f6',
                        }}
                        title={`${p.ev.title} (${format(p.ev.startDate, 'HH:mm')} - ${format(p.ev.endDate, 'HH:mm')})`}
                      >
                        <div className="font-semibold truncate">{p.ev.title}</div>
                        <div className="opacity-90 text-[11px]">
                          {format(p.ev.startDate, 'HH:mm')} - {format(p.ev.endDate, 'HH:mm')}
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Drag ghost */}
              {dragging && dragRef.current && dragRef.current.dayIndex === dayIndex && (
                <div
                  className="absolute rounded-md z-20"
                  style={{
                    top: `${(dragRef.current.startSlot / totalSlots) * 100}%`,
                    height: `${((dragRef.current.endSlot - dragRef.current.startSlot) / totalSlots) * 100}%`,
                    left: '2px',
                    right: '2px',
                    background: 'linear-gradient(90deg, rgba(14,165,233,0.12), rgba(14,165,233,0.08))',
                    border: '1px dashed rgba(14,165,233,0.4)',
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
