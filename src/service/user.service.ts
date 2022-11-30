import UserModel, { User } from "../model/user.model";

export function createUser(user: Partial<User>) {
  return UserModel.create(user);
}

export function findUserById(id: string) {
  return UserModel.findById(id);
}

export function findUserByEmail(email: string) {
  return UserModel.findOne({ email });
}
