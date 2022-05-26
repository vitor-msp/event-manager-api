import { Router, Request, Response } from "express";
import { cancelEventController, createEventController, editEventController, exitOfTheEventController } from "./factory";

const router = Router();

router.post("/event", (req: Request, res: Response) => {
    createEventController.handle(req, res);
});

router.put("/event", (req: Request, res: Response) => {
    editEventController.handle(req, res);
});

router.delete("/event", (req: Request, res: Response) => {
    cancelEventController.handle(req, res);
});

router.put("/event/exit", (req: Request, res: Response) => {
    exitOfTheEventController.handle(req, res);
});

export default router;
