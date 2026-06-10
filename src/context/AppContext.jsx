import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getSaved,
  getSubscriptions,
  getTheme,
  isSaved as checkSaved,
  isSubscribed as checkSubscribed,
  setTheme,
  toggleSaved,
  toggleSubscription,
} from "../utils/storage";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => getTheme() === "dark");
  const [savedVersion, setSavedVersion] = useState(0);
  const [subsVersion, setSubsVersion] = useState(0);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
    setTheme(darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = (message) => setToast(message);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const handleToggleSave = (video) => {
    const added = toggleSaved(video);
    setSavedVersion((v) => v + 1);
    showToast(added ? "Saved to library" : "Removed from library");
    return added;
  };

  const handleToggleSubscribe = (channel) => {
    const added = toggleSubscription(channel);
    setSubsVersion((v) => v + 1);
    showToast(added ? "Subscription added" : "Unsubscribed");
    return added;
  };

  const isVideoSaved = (videoId) => {
    void savedVersion;
    return checkSaved(videoId);
  };

  const isChannelSubscribed = (channelId) => {
    void subsVersion;
    return checkSubscribed(channelId);
  };

  const getSavedVideos = () => {
    void savedVersion;
    return getSaved();
  };

  const getSubscribedChannels = () => {
    void subsVersion;
    return getSubscriptions();
  };

  return (
    <AppContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        toggleSave: handleToggleSave,
        toggleSubscribe: handleToggleSubscribe,
        isVideoSaved,
        isChannelSubscribed,
        getSavedVideos,
        getSubscribedChannels,
        savedVersion,
        subsVersion,
        showToast,
      }}
    >
      {children}
      {toast && <div className="toast">{toast}</div>}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
