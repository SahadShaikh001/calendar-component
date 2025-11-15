import React, { useState } from "react";
import { CalendarView } from "./components/Calendar/CalendarView";
import { CalendarEvent } from "./components/Calendar/CalendarView.types";
import ResponsiveWrapper from "./components/ResponsiveWrapper";

const App: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: "1",
      title: "Team Standup",
      description: "Daily sync with the development team",
      startDate: new Date(),
      endDate: new Date(),
      color: "#3b82f6", // blue
      category: "Meeting",
    },
    {
      id: "2",
      title: "Design Review",
      description: "Discuss UI/UX updates",
      startDate: new Date(),
      endDate: new Date(),
      color: "#f59e0b", // amber
      category: "Review",
    },
  ]);

  // ✅ Add Event
  const handleEventAdd = (newEvent: CalendarEvent) => {
    setEvents((prev) => [...prev, { ...newEvent, id: Date.now().toString() }]);
  };

  // ✅ Update Event
  const handleEventUpdate = (id: string, updates: Partial<CalendarEvent>) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === id ? { ...event, ...updates } : event))
    );
  };

  // ✅ Delete Event
  const handleEventDelete = (id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  };

  return (
    <ResponsiveWrapper>
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
        📅 Calendar Demo
      </h1>

      <div className="w-full bg-white rounded-2xl shadow-lg p-4 sm:p-6">
        <CalendarView
          events={events}
          onEventAdd={handleEventAdd}
          onEventUpdate={handleEventUpdate}
          onEventDelete={handleEventDelete}
          initialView="month"
          initialDate={new Date()}
        />
      </div>
    </ResponsiveWrapper>
  );
};

export default App;
