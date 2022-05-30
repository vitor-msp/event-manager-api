import { Router, Request, Response } from "express";
import { createUserController, editUserController, getUserDataController } from "./factory";

const router = Router();

router.post("/user", (req: Request, res: Response) => {
    createUserController.handle(req, res);
});

router.get("/user", (req: Request, res: Response) => {
    getUserDataController.handle(req, res);
});

router.put("/user", (req: Request, res: Response) => {
    editUserController.handle(req, res);
});

export {router as usersRouter};
