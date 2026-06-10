const KEYS = {
  history: "yt_history",
  saved: "yt_saved",
  subscriptions: "yt_subscriptions",
  theme: "yt_theme",
};

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getTheme = () => read(KEYS.theme, "light");

export const setTheme = (theme) => write(KEYS.theme, theme);

export const getHistory = () => read(KEYS.history, []);

export const addToHistory = (video) => {
  const history = getHistory().filter((v) => v.id !== video.id);
  history.unshift({ ...video, viewedAt: Date.now() });
  write(KEYS.history, history.slice(0, 50));
};

export const clearHistory = () => write(KEYS.history, []);

export const getSaved = () => read(KEYS.saved, []);

export const toggleSaved = (video) => {
  const saved = getSaved();
  const index = saved.findIndex((v) => v.id === video.id);
  if (index >= 0) {
    saved.splice(index, 1);
    write(KEYS.saved, saved);
    return false;
  }
  saved.unshift({ ...video, savedAt: Date.now() });
  write(KEYS.saved, saved);
  return true;
};

export const isSaved = (videoId) =>
  getSaved().some((v) => v.id === videoId);

export const getSubscriptions = () => read(KEYS.subscriptions, []);

export const toggleSubscription = (channel) => {
  const subs = getSubscriptions();
  const index = subs.findIndex((c) => c.channelId === channel.channelId);
  if (index >= 0) {
    subs.splice(index, 1);
    write(KEYS.subscriptions, subs);
    return false;
  }
  subs.unshift(channel);
  write(KEYS.subscriptions, subs);
  return true;
};

export const isSubscribed = (channelId) =>
  getSubscriptions().some((c) => c.channelId === channelId);
