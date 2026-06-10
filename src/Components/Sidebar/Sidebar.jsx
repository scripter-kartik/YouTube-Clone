import React from "react";
import "./Sidebar.css";
import home from "../../assets/home.png";
import history_icon from "../../assets/history.png";
import library_icon from "../../assets/library.png";
import game_icon from "../../assets/game_icon.png";
import automobiles from "../../assets/automobiles.png";
import sports from "../../assets/sports.png";
import entertainment from "../../assets/entertainment.png";
import tech from "../../assets/tech.png";
import music from "../../assets/music.png";
import blogs from "../../assets/blogs.png";
import news from "../../assets/news.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

const CATEGORIES = [
  { id: 0, label: "Home", icon: home },
  { id: 20, label: "Gaming", icon: game_icon },
  { id: 2, label: "Automobiles", icon: automobiles },
  { id: 17, label: "Sports", icon: sports },
  { id: 24, label: "Entertainment", icon: entertainment },
  { id: 28, label: "Technology", icon: tech },
  { id: 10, label: "Music", icon: music },
  { id: 22, label: "Blogs", icon: blogs },
  { id: 25, label: "News", icon: news },
];

const Sidebar = ({
  sidebar,
  isMobile,
  isVideoPage,
  category,
  setCategory,
  closeSidebar,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getSubscribedChannels, subsVersion } = useApp();

  const handleCategoryClick = (cat) => {
    setCategory(cat);
    if (location.pathname !== "/") {
      navigate("/");
    }
    if (isMobile) closeSidebar();
  };

  const handleNavLink = () => {
    if (isMobile) closeSidebar();
  };

  const sidebarClass = [
    "sidebar",
    !sidebar && !isMobile ? "small-sidebar" : "",
    isMobile && sidebar ? "mobile-open" : "",
    isVideoPage ? "video-page" : "home-page",
  ]
    .filter(Boolean)
    .join(" ");

  const subscriptions = getSubscribedChannels();
  void subsVersion;

  const isActivePath = (path) => location.pathname === path;

  return (
    <div className={sidebarClass}>
      <div className="shortcut-links">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            className={`side-link ${location.pathname === "/" && category === cat.id ? "active" : ""}`}
            onClick={() => handleCategoryClick(cat.id)}
          >
            <img src={cat.icon} alt="" />
            <p>{cat.label}</p>
          </div>
        ))}
        <hr />
        <Link
          to="/history"
          className={`side-link ${isActivePath("/history") ? "active" : ""}`}
          onClick={handleNavLink}
        >
          <img src={history_icon} alt="" />
          <p>History</p>
        </Link>
        <Link
          to="/saved"
          className={`side-link ${isActivePath("/saved") ? "active" : ""}`}
          onClick={handleNavLink}
        >
          <img src={library_icon} alt="" />
          <p>Saved</p>
        </Link>
        <hr />
      </div>
      {subscriptions.length > 0 && (
        <div className="subscribed-list">
          <h3>Subscriptions</h3>
          {subscriptions.map((sub) => (
            <Link
              key={sub.channelId}
              to={`/channel/${sub.channelId}`}
              className={`side-link ${location.pathname === `/channel/${sub.channelId}` ? "active" : ""}`}
              onClick={handleNavLink}
            >
              <img src={sub.thumbnail} alt="" />
              <p>{sub.title}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
