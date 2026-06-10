import React from "react";
import "./PageLayout.css";

const PageLayout = ({ sidebar, isMobile, children, className = "" }) => {
  const containerClass = [
    "page-layout",
    !isMobile && !sidebar ? "large-container" : "",
    isMobile ? "mobile-container" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={containerClass}>{children}</div>;
};

export default PageLayout;
