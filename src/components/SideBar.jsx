import Logo from "./Logo";
import styles from "./Sidebar.module.css";
import AppNav from "./AppNav";
import { Outlet } from "react-router-dom";

function SideBar() {
  return (
    <div className={styles.sidebar}>
      <Logo />
      <AppNav />
      <Outlet />
      <footer className={styles.footer}>
        <p className={styles.copyrigh}>
          &copy; Copyright {new Date().getFullYear()} by Arina.
        </p>
      </footer>
    </div>
  );
}

export default SideBar;
