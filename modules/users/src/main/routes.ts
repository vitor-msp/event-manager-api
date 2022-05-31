import { Router, Request, Response, NextFunction } from "express";
import { verifyJWT } from "../../../../helpers/jwt/VerifyJWT";
import {
  authController,
  changePasswordController,
  createUserController,
  editUserController,
  getUserDataController,
} from "./factory";

const router = Router();

// Free Routes
router.post("/user", (req: Request, res: Response) => {
  createUserController.handle(req, res);
});

router.post("/user/auth", (req: Request, res: Response) => {
  authController.handle(req, res);
});

// Authorized Routes
router.get("/user", verifyJWT, (req: Request, res: Response) => {
  getUserDataController.handle(req, res);
});

router.put("/user", verifyJWT, (req: Request, res: Response) => {
  editUserController.handle(req, res);
});

router.put("/user/password", verifyJWT, (req: Request, res: Response) => {
  changePasswordController.handle(req, res);
});

export { router as usersRouter };
