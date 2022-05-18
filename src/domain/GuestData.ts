import { Permission } from "./Permission";
import { User } from "./User";

export type GuestData = {
  user: User;
  permission: Permission;
};