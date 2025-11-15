import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import CalendarView from "../CalendarView";
import * as useCalendarHook from "@/hooks/useCalendar";

// Mock the useCalendar hook
vi.mock("@/hooks/useCalendar", () => {
  const events = [
    { id: 1, title: "Meeting", start: new Date(), color: "#3b82f6" },
    { id: 2, title: "Lunch", start: new Date(), color: "#10b981" },
  ];
  const addEvent = vi.fn();
  const deleteEvent = vi.fn();
  const updateEvent = vi.fn();
  return {
    useCalendar: () => ({
      events,
      addEvent,
      deleteEvent,
      updateEvent,
    }),
  };
});

describe("CalendarView Component", () => {
  it("renders calendar events correctly", () => {
    render(<CalendarView />);
    expect(screen.getByText("Meeting")).toBeInTheDocument();
    expect(screen.getByText("Lunch")).toBeInTheDocument();
  });

  it("renders Add Event button", () => {
    render(<CalendarView />);
    const addBtn = screen.getByRole("button", { name: /add event/i });
    expect(addBtn).toBeInTheDocument();
  });

  it("calls addEvent when new event form is submitted", () => {
    const mockAdd = vi.fn();
    vi.spyOn(useCalendarHook, "useCalendar").mockReturnValue({
      events: [],
      addEvent: mockAdd,
      deleteEvent: vi.fn(),
      updateEvent: vi.fn(),
    });

    render(<CalendarView />);

    const addBtn = screen.getByRole("button", { name: /add event/i });
    fireEvent.click(addBtn);

    // Simulate entering title
    const input = screen.getByPlaceholderText(/event title/i);
    fireEvent.change(input, { target: { value: "New Event" } });

    const saveBtn = screen.getByRole("button", { name: /save/i });
    fireEvent.click(saveBtn);

    expect(mockAdd).toHaveBeenCalled();
  });

  it("handles delete event correctly", () => {
    const mockDelete = vi.fn();
    vi.spyOn(useCalendarHook, "useCalendar").mockReturnValue({
      events: [{ id: 1, title: "Test Event", start: new Date() }],
      addEvent: vi.fn(),
      deleteEvent: mockDelete,
      updateEvent: vi.fn(),
    });

    render(<CalendarView />);

    const delBtn = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(delBtn);

    expect(mockDelete).toHaveBeenCalledWith(1);
  });
});
