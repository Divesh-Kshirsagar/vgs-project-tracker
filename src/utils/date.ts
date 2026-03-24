export const getCurrentMonthData = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const currentDay = now.getDate();

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return { year, month, daysInMonth, currentDay, daysArray };
};
