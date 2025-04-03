import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import logo from "../assets/logo.jpeg";
import styles from "../styles/Header.module.scss";

const Header = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    let storedUser = JSON.parse(localStorage.getItem("user"));

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    let name = urlParams.get("name");

    // ✅ Filter to remove numbers & special characters, keeping only letters
    if (name) {
      name = name.replace(/[^a-zA-Z]/g, ""); // ✅ Only letters remain
    }

    if (id && name) {
      const githubUser = { id, name };
      localStorage.setItem("user", JSON.stringify(githubUser));
      storedUser = githubUser;
      window.history.replaceState(null, "", "/employees");
    }

    if (storedUser) {
      setUserName(storedUser.name || "User");
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
