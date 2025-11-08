/**
 * Formats an ISO 8601 date string to show the unambiguous UTC time and the user's local time for context.
 * @param {string} dateString - The ISO date string from the API (e.g., "2023-10-27T10:30:00Z").
 * @returns {string} A formatted UTC date and time string.
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'Date not available';
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  
  const utcOptions = {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: 'numeric', minute: '2-digit', timeZone: 'UTC', timeZoneName: 'short',
  };
  const utcTimeStr = date.toLocaleString('en-US', utcOptions);
  
  if (date.getTimezoneOffset() === 0) {
    return utcTimeStr;
  }

  const localOptions = {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
  };
  const localTimeStr = date.toLocaleString(undefined, localOptions);

  return `${utcTimeStr} (Your time: ${localTimeStr})`;
};
