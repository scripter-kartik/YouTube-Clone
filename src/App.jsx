import React, { useEffect, useState } from "react";
import Navbar from "./Components/Navbar/Navbar";
import Sidebar from "./Components/Sidebar/Sidebar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Video from "./Pages/Video/Video";

const MOBILE_BREAKPOINT = 768;

const AppContent = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";

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

  return (
    <div className="app">
      <Navbar toggleSidebar={toggleSidebar} isMobile={isMobile} />
      <Sidebar
        sidebar={sidebar}
        isMobile={isMobile}
        isHome={isHome}
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
        <Route
          path="/"
          element={
            <Home
              sidebar={sidebar}
              isMobile={isMobile}
              category={category}
            />
          }
        />
        <Route path="/video/:categoryId/:videoId" element={<Video />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return <AppContent />;
};

export default App;
