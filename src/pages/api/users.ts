import { NextApiResponse, NextApiRequest } from "next";

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
