/**
 * Format time in seconds to mm:ss or hh:mm:ss format
 */
export function formatTime(seconds: number | null | undefined, includeDecimal = false): string {
  if (seconds === null || seconds === undefined || isNaN(seconds) || seconds < 0) {
    return '--:--';
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const tenths = Math.floor((seconds % 1) * 10);

  const formattedMins = minutes.toString().padStart(2, '0');
  const formattedSecs = secs.toString().padStart(2, '0');

  let baseTime = '';
  if (hours > 0) {
    baseTime = `${hours}:${formattedMins}:${formattedSecs}`;
  } else {
    baseTime = `${formattedMins}:${formattedSecs}`;
  }

  if (includeDecimal) {
    return `${baseTime}.${tenths}`;
  }

  return baseTime;
}

/**
 * Format file size in bytes to readable KB/MB
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

