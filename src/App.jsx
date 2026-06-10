import React, { useEffect, useState } from "react";
import Navbar from "./Components/Navbar/Navbar";
import Sidebar from "./Components/Sidebar/Sidebar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Video from "./Pages/Video/Video";
import Search from "./Pages/Search/Search";
import Channel from "./Pages/Channel/Channel";
import History from "./Pages/History/History";
import Saved from "./Pages/Saved/Saved";

const MOBILE_BREAKPOINT = 768;

const layoutProps = (sidebar, isMobile, category) => ({
  sidebar,
  isMobile,
  category,
});

const AppContent = () => {
  const location = useLocation();
  const isVideoPage = location.pathname.startsWith("/video/");

  const [sidebar, setSidebar] = useState(
    () => window.innerWidth > MOBILE_BREAKPOINT
  );
  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth <= MOBILE_BREAKPOINT
  );
  const [category, setCategory] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= MOBILE_BREAKPOINT;
      setIsMobile(mobile);
      if (mobile) {
        setSidebar(false);
      } else {
        setSidebar(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile && sidebar) {
      document.body.classList.add("sidebar-open");
    } else {
      document.body.classList.remove("sidebar-open");
    }
    return () => document.body.classList.remove("sidebar-open");
  }, [isMobile, sidebar]);

  const toggleSidebar = () => setSidebar((prev) => !prev);
  const closeSidebar = () => setSidebar(false);

  const pageProps = layoutProps(sidebar, isMobile, category);

  return (
    <div className="app">
      <Navbar toggleSidebar={toggleSidebar} isMobile={isMobile} />
      <Sidebar
        sidebar={sidebar}
        isMobile={isMobile}
        isVideoPage={isVideoPage}
        category={category}
        setCategory={setCategory}
        closeSidebar={closeSidebar}
      />
      {isMobile && sidebar && (
        <div
          className="sidebar-backdrop"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}
      <Routes>
        <Route path="/" element={<Home {...pageProps} />} />
        <Route path="/search" element={<Search {...pageProps} />} />
        <Route path="/history" element={<History {...pageProps} />} />
        <Route path="/saved" element={<Saved {...pageProps} />} />
        <Route path="/channel/:channelId" element={<Channel {...pageProps} />} />
        <Route path="/video/:categoryId/:videoId" element={<Video />} />
      </Routes>
    </div>
  );
};

const App = () => <AppContent />;

export default App;
