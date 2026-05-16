import jwt from "jsonwebtoken";

export const verifyAdmin = (
  token: string
) => {

  try {

    const decoded: any =
      jwt.verify(

        token,

        process.env
          .JWT_SECRET ||

          "secret"

      );

    if (
      !decoded.isAdmin
    ) {

      return null;

    }

    return decoded;

  } catch {

    return null;

  }

};