import React, { useState } from "react";
import Image from "next/future/image";
import cN from "classnames";

import User from "../../types/User";

import styles from "../../styles/Users.module.scss";

const UserCard: React.FC<{
  user: User;
}> = ({ user }) => {
  const [open, setOpen] = useState(false);

  const handleActivation = () => {
    setOpen(!open);
  };

  return (
    <div
      key={user.ID}
      onPointerUp={handleActivation}
      className={cN(
        styles.user,
        {
          [styles["user--is_active"]]: user.status === "active",
        },
        { [styles["user--open"]]: open }
      )}
    >
      <div className={styles.user__picture_container}>
        <Image
          src={user.picture?.source}
          alt={user.firstName + " " + user.lastName}
          fill
          className={styles.user__picture}
        />
        <div className={styles.user__status_frame} />
        <div className={styles.user__status}>
          <div className={styles.user__status_sphere} />
        </div>
      </div>
      <h2 className={styles.user__name}>
        {user.firstName + " " + user.lastName}
      </h2>
      <p className={styles.user__email}>{user.email}</p>
    </div>
  );
};

export default React.memo(UserCard);
