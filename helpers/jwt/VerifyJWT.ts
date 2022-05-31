import { NextFunction, Request, Response } from "express";
import { httpForbidden } from "../responses/httpResponses";

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const bearer = req.headers.authorization;

  if (!bearer) return httpForbidden(res, "Missing JWT");

  const jwt = bearer.slice(7);

  if (!jwt || jwt.length === 0) return httpForbidden(res, "Missing JWT");

  next();
};
