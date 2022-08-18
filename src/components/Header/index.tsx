import React from "react";
import Image from "next/future/image";
import Link from "next/link";
import { IoMdLogOut as Leave } from "react-icons/io";

import logo from "../../assets/logo.png";
import logoIcon from "../../assets/logo-icon.png";

import useWindowDimensions from "../../hooks/useWindowDimensions";

import styles from "./styles.module.scss";

const Header: React.FC<React.HTMLAttributes<HTMLDivElement>> = () => {
  const width = useWindowDimensions("width");

  const handleLogout = () => {};

  return (
    <header className={styles.header}>
      <Link href="/">
        <a>
          <Image
            src={width && width < 768 ? logoIcon : logo}
            alt="Scratch"
            className={styles.header__logo}
          />
        </a>
      </Link>
      <button
        onPointerUp={handleLogout}
        onTouchEnd={handleLogout}
        className={styles.header__log_out}
      >
        <span className={styles.log_out__text}>LOG OUT</span>
        <Leave className={styles.log_out__icon} />
      </button>
    </header>
  );
};

export default React.memo(Header);
