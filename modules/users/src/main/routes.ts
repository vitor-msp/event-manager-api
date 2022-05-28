import { Router, Request, Response } from "express";
import { createUserController } from "./factory";

const router = Router();

router.post("/user", (req: Request, res: Response) => {
    createUserController.handle(req, res);
});

export {router as usersRouter};
