import { create } from 'zustand';

interface CalendarState {
  selectedDate: Date;
  currentMonth: number;
  currentYear: number;
  viewMode: 'month' | 'week';
  setSelectedDate: (date: Date) => void;
  setMonth: (year: number, month: number) => void;
  goToToday: () => void;
  prevMonth: () => void;
  nextMonth: () => void;
}

const today = new Date();

export const useCalendarStore = create<CalendarState>((set) => ({
  selectedDate: today,
  currentMonth: today.getMonth() + 1,
  currentYear: today.getFullYear(),
  viewMode: 'month',

  setSelectedDate: (date) =>
    set({
      selectedDate: date,
      currentMonth: date.getMonth() + 1,
      currentYear: date.getFullYear(),
    }),

  setMonth: (year, month) =>
    set({ currentYear: year, currentMonth: month }),

  goToToday: () => {
    const now = new Date();
    set({
      selectedDate: now,
      currentMonth: now.getMonth() + 1,
      currentYear: now.getFullYear(),
    });
  },

  prevMonth: () =>
    set((state) => {
      let month = state.currentMonth - 1;
      let year = state.currentYear;
      if (month < 1) {
        month = 12;
        year--;
      }
      return { currentMonth: month, currentYear: year };
    }),

  nextMonth: () =>
    set((state) => {
      let month = state.currentMonth + 1;
      let year = state.currentYear;
      if (month > 12) {
        month = 1;
        year++;
      }
      return { currentMonth: month, currentYear: year };
    }),
}));
