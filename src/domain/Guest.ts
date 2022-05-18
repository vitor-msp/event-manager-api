import { Event } from "./Event";
import { Permission } from "./Permission";
import { User } from "./User";

export class Guest {
  constructor(
    public readonly event: Event,
    public readonly user: User,
    private permission: Permission
  ) {}

  public getPermission(): Permission {
    return this.permission;
  }
}
