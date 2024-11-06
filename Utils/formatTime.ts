export function formatDate(dateString: string) {
  // Create a new Date object from the input string
  const date = new Date(dateString);

  // Define an array of month names
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  // Extract the month, day, and year from the date object
  const month = monthNames[date.getMonth()];
  const day = String(date.getDate()).padStart(2, '0'); // Ensure day is always 2 digits
  const year = date.getFullYear();

  // Return the formatted date string
  return `${month} ${day}, ${year}`;
}

export function upcomingEventDate(dateString: string) {
  // Create a new Date object from the input string
  const date = new Date(dateString);

  console.log(date, dateString);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    console.error('Invalid date:', dateString);
    return undefined;
  }

  // Define an array of month names
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  // Extract the month, day, and year from the date object
  const month = monthNames[date.getMonth()];
  const day = String(date.getDate()).padStart(2, '0'); // Ensure day is always 2 digits

  // Return the formatted date string
  return `${month} ${day}`;
}
