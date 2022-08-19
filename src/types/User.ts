export type Role = "doctor" | "admin" | "accountant";

type User = {
  ID: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  status: "active" | "inactive";
  picture: {
    source: string;
  };
};

export default User;
