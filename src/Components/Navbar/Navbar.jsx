import React from 'react';
import styles from './Navbar.module.css';
import { MdNotifications } from 'react-icons/md'; // Import the Material Design bell icon

const Navbar = () => {
  return (
    <div className={styles.navbar}>
      <div className={styles.breadcrumb}>
        <span>Home</span>
        <span className={styles.separator}> &gt; </span>
        <span>Dashboard V2</span>
      </div>
      <div className={styles.searchBox}>
        <input type="text" placeholder="Search anything..." />
      </div>
      <div className={styles.profileSection}>
        <div className={styles.notification}>
          <MdNotifications className={styles.bellIcon} />
        </div>
        <div className={styles.profile}>
          <img src="/path/to/profile-pic.jpg" alt="Profile" className={styles.profilePic} />
          <span className={styles.profileName}>Sidhant</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
