export const API_KEY = import.meta.env.VITE_API_KEY || import.meta.env.API_KEY;

export const value_converter = (value) => {
  const num = Number(value) || 0;
  if (num >= 1000000) {
    return Math.floor(num / 1000000) + "M";
  } else if (num >= 1000) {
    return Math.floor(num / 1000) + "K";
  }
  return num;
};

export const formatDuration = (iso) => {
  const match = iso?.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "0:00";
  const hours = parseInt(match[1] || 0, 10);
  const minutes = parseInt(match[2] || 0, 10);
  const seconds = parseInt(match[3] || 0, 10);
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};
