export class UserCannotCancelEvent extends Error {
  constructor() {
    super("User Cannot Cancel Event");
  }
}