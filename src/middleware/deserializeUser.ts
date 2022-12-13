import { Request, Response, NextFunction } from "express";
import { get } from "lodash";
import { reIssueAccessToken } from "../service/session.service";
import { verifyJwt } from "../utils/jwt";
import log from "../utils/logger";
export interface Return {
  valid: boolean;
  expired: boolean;
  decoded: string | null;
}

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken =
    get(req, "cookies.accessToken") ||
    get(req, "headers.authorization", "").replace(/^Bearer\s/, "");

  const refreshToken =
    get(req, "cookies.refreshToken") || get(req, "headers.x-refresh");

  if (!accessToken && !refreshToken) {
    return next();
  }

  if (accessToken) {
    const { decoded, expired } = verifyJwt(
      accessToken,
      "accessTokenPublicKey"
    ) as Return;

    if (decoded) {
      res.locals.user = decoded;
      return next();
    }

    if (expired && refreshToken) {
      const newAccessToken = (await reIssueAccessToken({
        refreshToken,
      })) as string;

      if (newAccessToken) {
        res.setHeader("x-access-token", newAccessToken);

        res.cookie("accessToken", newAccessToken, {
          maxAge: 900000, // 15 mins
          httpOnly: true,
          domain: "localhost",
          path: "/",
          sameSite: "strict",
          secure: false,
        });
      }
      const result = verifyJwt(
        newAccessToken,
        "accessTokenPublicKey"
      ) as Return;
      res.locals.user = result.decoded;
      return next();
    }
    return next();
  }

  if (refreshToken) {
    const newAccessToken = (await reIssueAccessToken({
      refreshToken,
    })) as string;

    if (newAccessToken) {
      res.setHeader("x-access-token", newAccessToken);

      res.cookie("accessToken", newAccessToken, {
        maxAge: 900000, // 15 mins
        httpOnly: true,
        domain: "localhost",
        path: "/",
        sameSite: "strict",
        secure: false,
      });
    }

    const result = verifyJwt(newAccessToken, "accessTokenPublicKey") as Return;
    res.locals.user = result.decoded;
    return next();
  }
};
export default deserializeUser;
