export class UserIsNotAGuestError extends Error {
  constructor() {
    super("User Is Not A Guest!");
  }
}
