import { User } from "../entities/User";
import { Permission } from "./Permission";

export type GuestData = {
  user: User;
  permission: Permission;
};