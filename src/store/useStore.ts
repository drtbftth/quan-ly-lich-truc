import { create } from "zustand";
import { Doctor, Department, Schedule } from "@/lib/types";

interface StoreState {
  doctors: Doctor[];
  departments: Department[];
  schedules: Schedule[];
  setDoctors: (doctors: Doctor[]) => void;
  setDepartments: (departments: Department[]) => void;
  setSchedules: (schedules: Schedule[]) => void;
  addSchedule: (schedule: Schedule) => void;
  updateSchedule: (schedule: Schedule) => void;
  deleteSchedule: (id: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  doctors: [],
  departments: [],
  schedules: [],
  setDoctors: (doctors) => set({ doctors }),
  setDepartments: (departments) => set({ departments }),
  setSchedules: (schedules) => set({ schedules }),
  addSchedule: (schedule) =>
    set((state) => ({ schedules: [...state.schedules, schedule] })),
  updateSchedule: (schedule) =>
    set((state) => ({
      schedules: state.schedules.map((s) => (s.id === schedule.id ? schedule : s)),
    })),
  deleteSchedule: (id) =>
    set((state) => ({
      schedules: state.schedules.filter((s) => s.id !== id),
    })),
}));
