import { Permission } from "../types/Permission";
import { Event } from "./Event";
import { User } from "./User";

export class Guest {
  constructor(
    public readonly event: Event,
    public readonly user: User,
    public readonly permission: Permission
  ) {}
}
