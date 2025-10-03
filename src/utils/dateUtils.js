import { format, isAfter, isBefore, isToday, addDays, startOfDay } from "date-fns";

export const formatDate = (date) => {
  return format(new Date(date), "MMM d, yyyy");
};

export const formatDateShort = (date) => {
  return format(new Date(date), "MMM d");
};

export const isOverdue = (date) => {
  return isBefore(new Date(date), startOfDay(new Date()));
};

export const isDueSoon = (date) => {
  const dueDate = new Date(date);
  const today = startOfDay(new Date());
  const threeDaysFromNow = addDays(today, 3);
  return isAfter(dueDate, today) && isBefore(dueDate, threeDaysFromNow);
};

export const isDueToday = (date) => {
  return isToday(new Date(date));
};

export const getUpcomingAssignments = (assignments, days = 7) => {
  const today = startOfDay(new Date());
  const futureDate = addDays(today, days);
  
  return assignments.filter(assignment => {
    const dueDate = new Date(assignment.dueDate);
    return isAfter(dueDate, today) && isBefore(dueDate, futureDate);
  });
};

export const getOverdueAssignments = (assignments) => {
  return assignments.filter(assignment => 
    !assignment.completed && isOverdue(assignment.dueDate)
  );
};