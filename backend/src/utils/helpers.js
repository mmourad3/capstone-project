import bcrypt from "bcryptjs";

export const hashPassword = (str) => {
  return bcrypt.hash(str, 10);
};

