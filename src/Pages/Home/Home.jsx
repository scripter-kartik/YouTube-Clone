import React from "react";
import "./Home.css";
import Feed from "../../Components/Feed/Feed";

const Home = ({ sidebar, isMobile, category }) => {
  const containerClass = [
    "container",
    !isMobile && !sidebar ? "large-container" : "",
    isMobile ? "mobile-container" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClass}>
      <Feed category={category} />
    </div>
  );
};

export default Home;
