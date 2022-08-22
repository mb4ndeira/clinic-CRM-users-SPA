import React, { useEffect, useState, useRef } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import cN from "classnames";
import { IconType } from "react-icons";
import { FiPlus as Plus } from "react-icons/fi";
import {
  IoChevronBack as Left,
  IoChevronForward as Right,
} from "react-icons/io5";
import { IoMdGrid as Grid } from "react-icons/io";

import Header from "../components/Header";
import UserCard from "./_users/UserCard";
import UserEditionForm from "./_users/UserEditionForm";

import styles from "../styles/Users.module.scss";

import User, { Role } from "../types/User";

type RolesID = "doctors" | "admins" | "accountants";

const Users: NextPage = () => {
  const usersInteractionsRef = useRef<HTMLDivElement>(null);

  const [users, setUsers] = useState<User[]>([]);
  const [selectedRole, setSelectedRole] = useState<RolesID>("doctors");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    usersInteractionsRef.current?.children[0].classList.add(
      styles["--invisible"]
    );

    (async () => {
      const fetchedUsers = await fetch("/api/users")
        .then((response) => response.json())
        .catch((error) => console.error(error));

      setUsers(fetchedUsers);
    })();
  }, []);

  const roles: { ID: RolesID; title: string; role: Role }[] = [
    { ID: "doctors", title: "Doctors", role: "doctor" },
    { ID: "admins", title: "Administrators", role: "admin" },
    { ID: "accountants", title: "Accountants", role: "accountant" },
  ];

  const filteredUsers = users.filter(
    (user) => user.role === roles.find((item) => item.ID === selectedRole)?.role
  );

  const UsersRoleOption = ({
    role,
    onSelection,
    active,
  }: {
    role: string;
    onSelection: () => void;
    active: boolean;
  }) => {
    const handleSelect = () => onSelection();

    return (
      <div
        onTouchEnd={handleSelect}
        onPointerUp={handleSelect}
        className={cN(styles.users__role, {
          [styles["users__role--selected"]]: active,
        })}
      >
        <span className={styles.users__role_text}>{role}</span>
      </div>
    );
  };

  const InteractionPuller: React.FC<{
    direction: "left" | "right";
    from: Element | undefined;
    to: Element | undefined;
    Icon: IconType;
  }> = React.memo(function InteractionPuller({ direction, from, to, Icon }) {
    const toggleUsersView = (from: Element, to: Element) => {
      from.classList.add(styles["--invisible"]);
      to.classList.remove(styles["--invisible"]);
    };

    return (
      <button
        onPointerUp={() => from && to && toggleUsersView(from, to)}
        className={
          direction === "right"
            ? styles.users__right_puller
            : styles.users__left_puller
        }
      >
        <div className={styles.users__puller_icons}>
          <Icon />
          {direction === "left" ? <Left /> : <Right />}
        </div>
      </button>
    );
  });

  const selectRole = (role: RolesID) => {
    if (selectedRole === role) return;

    setSelectedRole(role);
  };

  return (
    <div className={styles.page}>
      <Head>
        <title>Users</title>
        <meta name="description" content="Manage your clinic users." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header className={styles.header} />
      <div className={styles.hello}>
        <span className={styles.hello__greeting}>Hello, First Last</span>
        <p className={styles.hello__text}>
          Manage all your associated users here.
        </p>
      </div>
      <div className={styles.users}>
        <div className={styles.users__roles}>
          {roles &&
            roles.map((role) => (
              <UsersRoleOption
                key={role.ID}
                role={role.title}
                onSelection={() => selectRole(role.ID)}
                active={selectedRole === role.ID}
              />
            ))}
        </div>
        <div ref={usersInteractionsRef} className={styles.users__interactions}>
          <div className={styles.users__edition}>
            <UserEditionForm
              user={selectedUser}
              onEdition={(newUser) => {
                const indexToRemove: number = users.findIndex(
                  (item) => item.ID === newUser.ID
                );

                setUsers([
                  ...users.slice(0, indexToRemove),
                  newUser,
                  ...users.slice(indexToRemove + 1),
                ]);
              }}
              onAddition={(newUser) => setUsers([...users, newUser])}
            />
            <InteractionPuller
              direction="right"
              from={usersInteractionsRef.current?.children[0]}
              to={usersInteractionsRef.current?.children[1]}
              Icon={Grid}
            />
          </div>
          <div className={styles.users__list}>
            {filteredUsers &&
              filteredUsers.map((user) => (
                <UserCard
                  key={user.ID}
                  isActive={selectedUser === user}
                  user={user}
                  onSelection={() => {
                    if (selectedUser?.ID === user?.ID) {
                      setSelectedUser(null);

                      return;
                    }

                    setSelectedUser(user);
                  }}
                />
              ))}
            <InteractionPuller
              direction="left"
              from={usersInteractionsRef.current?.children[1]}
              to={usersInteractionsRef.current?.children[0]}
              Icon={Plus}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
