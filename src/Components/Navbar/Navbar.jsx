import React, { useEffect, useState } from "react";
import "./Navbar.css";
import menu_icon from "../../assets/menu.png";
import logo from "../../assets/logo.png";
import search_icon from "../../assets/search.png";
import upload_icon from "../../assets/upload.png";
import more_icon from "../../assets/more.png";
import notification_icon from "../../assets/notification.png";
import profile_icon from "../../assets/jack.png";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useApp } from "../../context/AppContext";

const Navbar = ({ toggleSidebar, isMobile }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { darkMode, toggleDarkMode } = useApp();

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setQuery(q);
  }, [searchParams]);

  const submitSearch = (e) => {
    e?.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    setSearchOpen(false);
  };

  const SearchForm = ({ autoFocus = false }) => (
    <form className="search-box flex-div" onSubmit={submitSearch}>
      <input
        type="text"
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus={autoFocus}
      />
      <button type="submit" className="search-submit" aria-label="Search">
        <img src={search_icon} alt="" />
      </button>
    </form>
  );

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
        <SearchForm />
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
        <button
          className="theme-toggle"
          onClick={toggleDarkMode}
          type="button"
          aria-label="Toggle dark mode"
          title="Toggle theme"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
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
          <SearchForm autoFocus />
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
