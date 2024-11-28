import { VacationDay } from "@/types/vacation";
import { isWeekend } from "date-fns";

export const WORK_HOURS_PER_DAY = 8;
export const DAYS_PER_WEEK = 5;
export const WEEKS_OF_WORK = 3;

export const calculateTotalWorkDays = (engineers: number, vacationDays: VacationDay[]) => {
  // One engineer works for 3 weeks (15 working days)
  const totalWorkHours = WORK_HOURS_PER_DAY * DAYS_PER_WEEK * WEEKS_OF_WORK;
  const rawWorkDays = Math.ceil(totalWorkHours / WORK_HOURS_PER_DAY);

  // Subtract vacation days (only counting non-weekend days)
  const totalVacationDays = vacationDays.reduce((acc, vDay) => {
    if (isWeekend(vDay.date)) return acc;
    const hoursToSubtract = vDay.hours || WORK_HOURS_PER_DAY;
    return acc + (hoursToSubtract / WORK_HOURS_PER_DAY);
  }, 0);

  return rawWorkDays - totalVacationDays;
};