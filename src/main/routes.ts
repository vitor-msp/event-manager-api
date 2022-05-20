import { Router, Request, Response } from "express";
import { createEventController } from "./factory";

const router = Router();

router.post("/event", (req: Request, res: Response) => {
    createEventController.handle(req, res);
});

export default router;
