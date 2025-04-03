import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdAccountCircle, MdLogout } from "react-icons/md";
import logo from "../assets/logo.jpeg";
import styles from "../styles/Header.module.scss";

const Header = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("User");
  const [userAvatar, setUserAvatar] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUserName(storedUser.name || "User");
      setUserAvatar(storedUser.avatar || null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className={styles.header}>
      <img src={logo} alt="Company Logo" className={styles.logo} />
      <Link to="/employees" className={styles.titleLink}>
        <h1 className={styles.title}>
          <span className={styles.employee}>Employee</span>
          <span className={styles.payroll}>Payroll</span>
        </h1>
      </Link>

      {/* Profile Section */}
      <div className={styles.profileSection}>
        <button
          className={styles.profileInfo}
          onClick={() => setDropdownOpen(!dropdownOpen)}
          aria-expanded={dropdownOpen}
          aria-label="User Profile Menu"
        >
          {userAvatar ? (
            <img src={userAvatar} alt="User Avatar" className={styles.avatar} />
          ) : (
            <MdAccountCircle className={styles.profileIcon} />
          )}
          <span className={styles.userName}>{userName}</span>
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className={styles.dropdownMenu}>
            <button onClick={handleLogout} className={styles.dropdownItem}>
              <MdLogout className={styles.logoutIcon} />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;