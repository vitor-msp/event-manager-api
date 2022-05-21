import { Router, Request, Response } from "express";
import { createEventController, editEventController } from "./factory";

const router = Router();

router.post("/event", (req: Request, res: Response) => {
    createEventController.handle(req, res);
});

router.put("/event", (req: Request, res: Response) => {
    editEventController.handle(req, res);
});

export default router;
