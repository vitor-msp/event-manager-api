import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
  httpBadRequest,
  httpForbidden,
  httpUnauthorized,
} from "../responses/httpResponses";

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const bearer = req.headers.authorization;

  if (!bearer) return httpForbidden(res, "Missing JWT");

  const token = bearer.slice(7);

  if (!token || token.length === 0) return httpForbidden(res, "Missing JWT");

  jwt.verify(token, process.env.JWT_KEY!, (err, decoded) => {
    if (err) return httpUnauthorized(res, err);

    // @ts-ignore
    req.userId = decoded.userdId;

    next();
  });
};
