import { get } from "lodash";
import { FilterQuery, UpdateQuery } from "mongoose";
import { Return } from "../middleware/deserializeUser";
import SessionModel, { Session } from "../model/session.model";
import { verifyJwt } from "../utils/jwt";
import { signAccessToken } from "./auth.service";
import { findUser, findUserById } from "./user.service";

export async function updateSession(
  query: FilterQuery<Session>,
  update: UpdateQuery<Session>
) {
  return SessionModel.updateOne(query, update);
}

export async function reIssueAccessToken({
  refreshToken,
}: {
  refreshToken: string;
}) {
  const { decoded } = verifyJwt(
    refreshToken,
    "refreshTokenPublicKey"
  ) as Return;

  if (!decoded || !get(decoded, "session")) return false;

  const session = await SessionModel.findById(get(decoded, "session"));

  if (!session || !session.valid) return false;

  const user = await findUser({ _id: session.user });

  if (!user) return false;
  const accessToken = signAccessToken(user);

  return accessToken;
}
