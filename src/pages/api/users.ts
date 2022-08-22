import { NextApiResponse, NextApiRequest } from "next";
import crypto from "crypto";

import fakeData from "../../../fake-data.json";

import User from "../../types/User";

type RawUser = User & {
  first_name: string;
  last_name: string;
  picture_ID: string;
};

const getRandomBoolean = () => Math.ceil(Math.random() * 10) % 2 == 0;

const getPicture = (
  pictures: Array<{ ID: string; source: string }>,
  pictureID: string
) => pictures.find((picture) => picture.ID === pictureID);

const getRandomPicture = (
  pictures: Array<{ ID: string; source: string }>,
  pictureIndex: number
) => pictures[pictureIndex];

const returnItemsWithValueAppended = <T>(
  array: Array<T>,
  key: string,
  valueGenerator: (index: number) => unknown | (() => unknown),
  formatAs?: (item: T) => unknown
) =>
  array.map((item, index) => {
    const newItem = {
      ...item,
      [key]: valueGenerator(index),
    };

    if (formatAs) return formatAs(newItem);

    return newItem;
  });

const formatAsUser = (rawUser: RawUser): User => {
  const {
    first_name: firstName,
    last_name: lastName,
    picture_ID,
    ...rest
  } = rawUser;

  return {
    ...rest,
    firstName,
    lastName,
  };
};

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  if (_req.method === "POST") {
    const {
      first_name: firstName,
      last_name: lastName,
      role,
      status,
      email,
    } = JSON.parse(_req.body);

    if (!firstName || !lastName || !role || !status || !email) {
      return res
        .status(400)
        .json({ error: "Bad request", message: "Invalid user format" });
    }

    if (fakeData.users.some((user) => user.email === email)) {
      return res.status(200).json({ message: "E-mail already in use" });
    }

    const randomPicture = getRandomPicture(
      fakeData.pictures,
      Math.floor(Math.random() * 14)
    );

    const addedUser = {
      ID: crypto.randomUUID(),
      firstName,
      lastName,
      role,
      status,
      email,
      picture: randomPicture,
    };

    return res.status(201).json(addedUser);
  }

  if (_req.method === "PUT") {
    const {
      ID,
      first_name: firstName,
      last_name: lastName,
      role,
      status,
      email,
      picture,
    } = JSON.parse(_req.body);

    if (
      !ID ||
      !firstName ||
      !lastName ||
      !role ||
      !status ||
      !email ||
      !picture
    ) {
      return res
        .status(400)
        .json({ error: "Bad request", message: "Invalid user format" });
    }

    if (
      fakeData.users
        .filter((user) => user.ID !== ID)
        .some((user) => user.email === email)
    ) {
      return res.status(200).json({ message: "E-mail already in use" });
    }

    const editedUser = {
      ID,
      firstName,
      lastName,
      role,
      status,
      email,
      picture,
    };

    return res.status(201).json(editedUser);
  }

  const users = fakeData.users;

  const usersWithStatuses = returnItemsWithValueAppended(users, "status", () =>
    getRandomBoolean() ? "active" : "inactive"
  );
  const usersWithPictures = returnItemsWithValueAppended<RawUser>(
    usersWithStatuses as Array<RawUser>,
    "picture",
    (index: number) => getPicture(fakeData.pictures, users[index].picture_ID),
    formatAsUser
  );

  return res.status(200).json(usersWithPictures);
}
