export const checkTimeStatus = (startTime: number | string, expiryTime: number | string) => {
  const currentTime = new Date().getTime(); // Current time in milliseconds
  const start = new Date(startTime).getTime(); // Start time in milliseconds
  const expiry = new Date(expiryTime).getTime(); // Expiry time in milliseconds
  const oneHourBeforeStart = start - 60 * 60 * 1000; // 1 hour before the start time

  // Check if the current time is within the range of start and expiry time
  if (currentTime >= start && currentTime <= expiry) {
    return 'now';
  }

  // Check if the current time is within 1 hour before the start time
  if (currentTime >= oneHourBeforeStart && currentTime < start) {
    return 'countdown';
  }

  // Default to 'normal' if none of the above conditions are met
  return 'normal';
};
