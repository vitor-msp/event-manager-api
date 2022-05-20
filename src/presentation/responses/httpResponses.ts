import { Response } from "express";

export const httpServerError = (res: Response, error: any): Response => {
  const errorResponse: ErrorResponse = {
    message: error?.message || `Invalid request!`,
  };
  return res.status(500).json(errorResponse);
};

export const httpCreated = (res: Response, data: any): Response => {
  return res.status(201).json(data);
};

export const httpBadRequest = (res: Response, error: any): Response => {
  const errorResponse: ErrorResponse = {
    message: error?.message || `Invalid request!`,
  };
  return res.status(400).json(errorResponse);
};

export type ErrorResponse = {
  message: string;
};
