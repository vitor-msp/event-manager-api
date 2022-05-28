import { Response } from "express";

export type ErrorResponse = {
  message: string;
};

export const httpCreated = (res: Response, data?: any): Response => {
  return res.status(201).json(data ?? null);
};

export const httpOk = (res: Response, data?: any): Response => {
  return res.status(200).send(data ?? null);
};

export const httpBadRequest = (res: Response, error: any): Response => {
  const errorResponse: ErrorResponse = {
    message: error?.message || `Invalid Request`,
  };
  return res.status(400).json(errorResponse);
};

export const httpServerError = (res: Response, error: any): Response => {
  const errorResponse: ErrorResponse = {
    message: error?.message || `Internal Server Error`,
  };
  return res.status(500).json(errorResponse);
};

export const httpNotFound = (res: Response, error: any): Response => {
  const errorResponse: ErrorResponse = {
    message: error?.message || `Not Found`,
  };
  return res.status(404).json(errorResponse);
};

export const httpUnauthorized = (res: Response, error: any): Response => {
  const errorResponse: ErrorResponse = {
    message: error?.message || `Unauthorized`,
  };
  return res.status(401).json(errorResponse);
};
