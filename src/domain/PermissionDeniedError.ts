class PermissionDeniedError extends Error {
  constructor() {
    super();
  }

  message: string = "Permission Denied!";
}
