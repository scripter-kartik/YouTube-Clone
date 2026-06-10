import React, { useState } from "react";
import "./Navbar.css";
import menu_icon from "../../assets/menu.png";
import logo from "../../assets/logo.png";
import search_icon from "../../assets/search.png";
import upload_icon from "../../assets/upload.png";
import more_icon from "../../assets/more.png";
import notification_icon from "../../assets/notification.png";
import profile_icon from "../../assets/jack.png";
import { Link } from "react-router-dom";

const Navbar = ({ toggleSidebar, isMobile }) => {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <nav className={`flex-div ${searchOpen ? "search-active" : ""}`}>
      <div className="nav-left flex-div">
        <img
          className="menu-icon"
          onClick={toggleSidebar}
          src={menu_icon}
          alt="Menu"
        />
        <Link to="/" onClick={() => searchOpen && setSearchOpen(false)}>
          <img className="logo" src={logo} alt="Logo" />
        </Link>
      </div>

      <div className="nav-middle flex-div">
        <div className="search-box flex-div">
          <input type="text" placeholder="Search" />
          <img src={search_icon} alt="Search" />
        </div>
        {isMobile && (
          <img
            className="mobile-search-icon"
            src={search_icon}
            alt="Search"
            onClick={() => setSearchOpen((prev) => !prev)}
          />
        )}
      </div>

      <div className="nav-right flex-div">
        <img className="nav-icon-upload" src={upload_icon} alt="Upload" />
        <img className="nav-icon-more" src={more_icon} alt="More Options" />
        <img
          className="nav-icon-notification"
          src={notification_icon}
          alt="Notifications"
        />
        <img src={profile_icon} className="user-icon" alt="Profile" />
      </div>

      {isMobile && searchOpen && (
        <div className="mobile-search-bar flex-div">
          <div className="search-box flex-div">
            <input type="text" placeholder="Search" autoFocus />
            <img src={search_icon} alt="Search" />
          </div>
          <button
            className="search-close"
            onClick={() => setSearchOpen(false)}
            type="button"
          >
            Cancel
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
