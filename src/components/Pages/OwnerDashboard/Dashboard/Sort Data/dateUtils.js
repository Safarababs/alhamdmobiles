// utils/dateUtils.js
export const getStartDateForPeriod = (selectedTimePeriod) => {
  const now = new Date();
  let startDate;

  switch (selectedTimePeriod) {
    case "daily":
      startDate = new Date(now.toDateString());
      break;
    case "weekly":
      startDate = new Date(now.setDate(now.getDate() - now.getDay()));
      break;
    case "monthly":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "yearly":
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    case "all-time":
    default:
      startDate = new Date(0); // Unix epoch start date
      break;
  }

  return startDate;
};
