import { isWeekend, addDays, isBefore, nextMonday } from "date-fns";

export const calculateWorkingDays = (startDate: Date, numberOfDays: number): number => {
  // Ensure start date is a Monday
  const adjustedStartDate = nextMonday(startDate);
  let workingDays = 0;
  let currentDate = new Date(adjustedStartDate);
  let daysToAdd = 0;

  while (workingDays < numberOfDays) {
    currentDate = addDays(adjustedStartDate, daysToAdd);
    if (!isWeekend(currentDate)) {
      workingDays++;
    }
    daysToAdd++;
  }

  return daysToAdd;
};

export const getEndDate = (startDate: Date, totalWorkingDays: number): Date => {
  const adjustedStartDate = nextMonday(startDate);
  let currentDate = new Date(adjustedStartDate);
  let workingDays = 0;
  
  while (workingDays < totalWorkingDays) {
    currentDate = addDays(currentDate, 1);
    if (!isWeekend(currentDate)) {
      workingDays++;
    }
  }
  
  return currentDate;
};