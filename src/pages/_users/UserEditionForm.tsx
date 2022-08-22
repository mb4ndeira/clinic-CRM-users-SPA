import React, { useRef, useState, useEffect } from "react";
import cN from "classnames";
import { FiPlus as Plus, FiEdit2 as Edit } from "react-icons/fi";
import {
  IoChevronBack as Left,
  IoChevronForward as Right,
} from "react-icons/io5";
import { MdOutlineDelete as Delete } from "react-icons/md";
import { IoMdCheckmark as Check } from "react-icons/io";

import User, { Role } from "../../types/User";

import styles from "../../styles/Users.module.scss";

const DeleteButton: React.FC = React.memo(function DeleteButton() {
  const deleteButtonRef = useRef<HTMLButtonElement>(null);

  const [locked, setLocked] = useState<boolean>(true);

  const handleDelete = (deleteButton: HTMLButtonElement) => {
    if (!locked) {
      deleteButton.blur();

      return;
    }

    setLocked(false);
    deleteButton.focus();
  };

  return (
    <button
      ref={deleteButtonRef}
      onPointerUp={() =>
        deleteButtonRef.current !== null &&
        handleDelete(deleteButtonRef.current)
      }
      onBlur={() => setLocked(true)}
      className={cN(styles.form__delete, {
        [styles["form__delete--active"]]: locked === false,
      })}
    >
      {locked ? <Delete /> : <Check />}
    </button>
  );
});

const UserEditionForm: React.FC<{
  user?: User | null;
  onAddition: (user: User) => void;
}> = ({ user, onAddition }) => {
  const addButtonRef = useRef(null);

  const [mode, setMode] = useState<"view" | "edition">();
  const [userFirstName, setUserFirstName] = useState<string>(
    user?.firstName || ""
  );
  const [userLastName, setUserLastName] = useState<string>(
    user?.lastName || ""
  );
  const [userEmail, setUserEmail] = useState<string>(user?.email || "");
  const [userStatus, setUserStatus] = useState<"active" | "inactive">(
    user?.status || "inactive"
  );
  const [userRole, setUserRole] = useState<Role>(user?.role || "doctor");

  const roles: { title: string; role: Role; left: number; right: number }[] = [
    { title: "doctor", role: "doctor", left: 2, right: 1 },
    { title: "admin", role: "admin", left: 0, right: 2 },
    { title: "accountant", role: "accountant", left: 1, right: 0 },
  ];

  const uponWrite = (input: HTMLElement | null, value: string) => {
    if (!input) return;

    const length = Array.from(value).length;

    if (length === 0) {
      input.style.width = `calc((5px * 2) + 5ch)`;

      return;
    }

    input.style.width = `calc((5px * 2) + ${length}ch + (1px * ${length}))`;
  };

  const uponReject = (button: HTMLElement) => {
    button.classList.add(styles["form__add_button--rejected"]);
    button.focus();
  };

  const handleToggleEditMode = () => {
    setMode(mode === "view" ? "edition" : "view");
  };

  const handleAddUser = async () => {
    if (
      !userFirstName ||
      !userLastName ||
      !userEmail ||
      !userRole ||
      !userStatus
    ) {
      addButtonRef.current && uponReject(addButtonRef.current);

      return;
    }

    const data = {
      first_name: userFirstName,
      last_name: userLastName,
      email: userEmail,
      role: userRole,
      status: userStatus,
    };

    const addResponse = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((response) =>
        response.json().then((data) => ({
          message: data.message as string,
          user: { ...data } as User,
        }))
      )
      .catch((error) => console.error(error));

    const { user: addedUser, message } = addResponse as {
      user: User;
      message: string;
    };

    if (message && message === "E-mail already in use") {
      addButtonRef.current &&
        uponReject(addButtonRef.current, styles["form__add_button--rejected"]);

      return;
    }

    onAddition(addedUser);
  };

  return (
    <div className={cN(styles.form)}>
      <div className={styles.form__header}>
        <div className={styles.form__role}>
          <span className={styles.form__role_text}>Role:</span>
          <div className={styles.form__role_selection}>
            <Left
              onPointerUp={() =>
                setUserRole(
                  roles[
                    roles[roles.findIndex((item) => item.role === userRole)]
                      .left
                  ].role
                )
              }
            />
            <span className={styles.form__role_title}>
              {userRole
                ? roles.find((item) => item.role === userRole)?.title
                : roles[0].title}
            </span>
            <Right
              onPointerUp={() =>
                setUserRole(
                  roles[
                    roles[roles.findIndex((item) => item.role === userRole)]
                      .left
                  ].role
                )
              }
            />
          </div>
        </div>
        <div className={styles.form__buttons}>
          <DeleteButton />
            <button
            onPointerUp={handleToggleEditMode}
              className={cN(styles.form__edit, {
                [styles["form__edit--active"]]: mode === "edition",
              })}
            >
            <Edit />
            </button>
        </div>
      </div>
      <div className={styles.form__body}>
        <div className={styles.form__names}>
          <div className={styles.form__first_name}>
            <input
              type="text"
              placeholder="First"
              value={userFirstName}
              onChange={(e) => {
                setUserFirstName(e.target.value);
                uponWrite(e.target, e.target.value);
              }}
            />
          </div>
          <div className={styles.form__last_name}>
            <input
              type="text"
              placeholder="Last"
              value={userLastName}
              onChange={(e) => {
                setUserLastName(e.target.value);
                uponWrite(e.target, e.target.value);
              }}
            />
          </div>
        </div>
        <div className={styles.form__email}>
          <input
            type="email"
            placeholder="e-mail"
            value={userEmail}
            onChange={(e) => {
              setUserEmail(e.target.value);
              uponWrite(e.target, e.target.value);
            }}
          />
        </div>
        <div className={styles.form__footer}>
          <button
            className={cN(styles.form__active, {
              [styles["form__active--active"]]: userStatus === "active",
            })}
            onPointerUp={() => {
              setUserStatus(userStatus === "active" ? "inactive" : "active");
            }}
          >
            <div className={styles.form__checkbox}>
              <div className={styles.form__checkbox_dot} />
            </div>
            <span className={styles.form__active_text}>Active</span>
          </button>
          <button
            ref={addButtonRef}
            onClick={handleAddUser}
            onBlur={(e) =>
              e.target.classList.contains(
                styles["form__add_button--rejected"]
              ) &&
              e.target.classList.remove(styles["form__add_button--rejected"])
            }
            className={styles.form__add_button}
          >
            <span className={styles.form__add_text}>Add user</span>
            <Plus />
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(UserEditionForm);
