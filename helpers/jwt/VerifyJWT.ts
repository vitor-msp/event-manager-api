import { NextFunction, Request, Response } from "express";
import { httpForbidden } from "../responses/httpResponses";

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const jwt = req.headers["x-access-token"];

  if (!jwt) return httpForbidden(res, "Missing JWT");
};
