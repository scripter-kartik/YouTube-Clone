import React from "react";
import "./Sidebar.css";
import home from "../../assets/home.png";
import game_icon from "../../assets/game_icon.png";
import automobiles from "../../assets/automobiles.png";
import sports from "../../assets/sports.png";
import entertainment from "../../assets/entertainment.png";
import tech from "../../assets/tech.png";
import music from "../../assets/music.png";
import blogs from "../../assets/blogs.png";
import news from "../../assets/news.png";
import jack from "../../assets/jack.png";
import simon from "../../assets/simon.png";
import tom from "../../assets/tom.png";
import megan from "../../assets/megan.png";
import cameron from "../../assets/cameron.png";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = ({
  sidebar,
  isMobile,
  isHome,
  category,
  setCategory,
  closeSidebar,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleCategoryClick = (cat) => {
    setCategory(cat);
    if (location.pathname !== "/") {
      navigate("/");
    }
    if (isMobile) {
      closeSidebar();
    }
  };

  const sidebarClass = [
    "sidebar",
    !sidebar && !isMobile ? "small-sidebar" : "",
    isMobile && sidebar ? "mobile-open" : "",
    isHome ? "home-page" : "video-page",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={sidebarClass}>
      <div className="shortcut-links">
        <div
          className={`side-link ${category === 0 ? "active" : ""}`}
          onClick={() => handleCategoryClick(0)}
        >
          <img src={home} alt="" />
          <p>Home</p>
        </div>
        <div
          className={`side-link ${category === 20 ? "active" : ""}`}
          onClick={() => handleCategoryClick(20)}
        >
          <img src={game_icon} alt="" />
          <p>Gaming</p>
        </div>
        <div
          className={`side-link ${category === 2 ? "active" : ""}`}
          onClick={() => handleCategoryClick(2)}
        >
          <img src={automobiles} alt="" />
          <p>Automobiles</p>
        </div>
        <div
          className={`side-link ${category === 17 ? "active" : ""}`}
          onClick={() => handleCategoryClick(17)}
        >
          <img src={sports} alt="" />
          <p>Sports</p>
        </div>
        <div
          className={`side-link ${category === 24 ? "active" : ""}`}
          onClick={() => handleCategoryClick(24)}
        >
          <img src={entertainment} alt="" />
          <p>Entertainment</p>
        </div>
        <div
          className={`side-link ${category === 28 ? "active" : ""}`}
          onClick={() => handleCategoryClick(28)}
        >
          <img src={tech} alt="" />
          <p>Technology</p>
        </div>
        <div
          className={`side-link ${category === 10 ? "active" : ""}`}
          onClick={() => handleCategoryClick(10)}
        >
          <img src={music} alt="" />
          <p>Music</p>
        </div>
        <div
          className={`side-link ${category === 22 ? "active" : ""}`}
          onClick={() => handleCategoryClick(22)}
        >
          <img src={blogs} alt="" />
          <p>Blogs</p>
        </div>
        <div
          className={`side-link ${category === 25 ? "active" : ""}`}
          onClick={() => handleCategoryClick(25)}
        >
          <img src={news} alt="" />
          <p>News</p>
        </div>
        <hr />
      </div>
      <div className="subscribed-list">
        <h3>Subscribed</h3>
        <Link to="/" className="side-link" onClick={() => isMobile && closeSidebar()}>
          <img src={jack} alt="" />
          <p>PewDiePie</p>
        </Link>
        <Link to="/" className="side-link" onClick={() => isMobile && closeSidebar()}>
          <img src={simon} alt="" />
          <p>Mrbeast</p>
        </Link>
        <Link to="/" className="side-link" onClick={() => isMobile && closeSidebar()}>
          <img src={tom} alt="" />
          <p>Justin Bieber</p>
        </Link>
        <Link to="/" className="side-link" onClick={() => isMobile && closeSidebar()}>
          <img src={megan} alt="" />
          <p>5-Minute Crafts</p>
        </Link>
        <Link to="/" className="side-link" onClick={() => isMobile && closeSidebar()}>
          <img src={cameron} alt="" />
          <p>Nas Daily</p>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
