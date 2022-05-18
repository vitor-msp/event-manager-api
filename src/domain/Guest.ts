import { Event } from "./Event";
import { Permission } from "./Permission";
import { User } from "./User";

export class Guest {
  constructor(
    private readonly event: Event,
    private readonly user: User,
    private permission: Permission
  ) {}
}