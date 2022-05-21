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

export const httpOk = (res: Response): Response => {
  return res.status(200).send();
};

export const httpBadRequest = (res: Response, error: any): Response => {
  const errorResponse: ErrorResponse = {
    message: error?.message || `Invalid request!`,
  };
  return res.status(400).json(errorResponse);
};

export const httpNotFound = (res: Response, error: any): Response => {
  const errorResponse: ErrorResponse = {
    message: error?.message || `Not Found`,
  };
  return res.status(404).json(errorResponse);
};

export type ErrorResponse = {
  message: string;
};
