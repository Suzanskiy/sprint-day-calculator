import { isWeekend, addDays, isBefore } from "date-fns";

export const calculateWorkingDays = (startDate: Date, numberOfDays: number): number => {
  let workingDays = 0;
  let currentDate = new Date(startDate);
  let daysToAdd = 0;

  while (workingDays < numberOfDays) {
    currentDate = addDays(startDate, daysToAdd);
    if (!isWeekend(currentDate)) {
      workingDays++;
    }
    daysToAdd++;
  }

  return daysToAdd;
};

export const getEndDate = (startDate: Date, totalWorkingDays: number): Date => {
  let currentDate = new Date(startDate);
  let workingDays = 0;
  
  while (workingDays < totalWorkingDays) {
    currentDate = addDays(currentDate, 1);
    if (!isWeekend(currentDate)) {
      workingDays++;
    }
  }
  
  return currentDate;
};