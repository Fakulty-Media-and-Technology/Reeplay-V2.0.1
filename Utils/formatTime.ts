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



export const getTimeAgo = (createdAt: string) => {
  const now = new Date();
  const createdDate = new Date(createdAt);
  const timeDifference = now.getTime() - createdDate.getTime();
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const years = Math.floor(days / 365);

  if (seconds < 60) {
    return `${Math.max(seconds, 1)}s ago`;
  } else if (minutes < 60) {
    return `${minutes}m ago`;
  } else if (hours < 24) {
    return `${hours}h ago`;
  } else if (days < 7) {
    return `${days}d ago`;
  } else if (weeks < 52) {
    return `${weeks}w ago`;
  } else {
    return `${years}yr ago`;
  }
};


export const getNotificationTime = (createdAt: string) => {
  const now = new Date();
  const createdDate = new Date(createdAt);
  const timeDifference = now.getTime() - createdDate.getTime();

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const years = Math.floor(days / 365);

  if (hours < 24) {
    // Format time as h:mm AM/PM
    return createdDate.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  if (days < 7) {
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }

  if (weeks < 52) {
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  }

  return `${years} ${years === 1 ? 'year' : 'years'} ago`;
};

export function formatToMonthDayYear(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).toUpperCase();
}

export function formatToTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).toLowerCase();
}
