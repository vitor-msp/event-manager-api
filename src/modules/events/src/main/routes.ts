import { Router, Request, Response } from "express";
import { verifyJWT } from "../../../../helpers/jwt/VerifyJWT";
import {
  cancelEventController,
  createEventController,
  editEventController,
  exitOfTheEventController,
  findEventsController,
} from "./factory";

const router = Router();

router.post("/event", verifyJWT, (req: Request, res: Response) => {
  createEventController.handle(req, res);
});

router.put("/event", verifyJWT, (req: Request, res: Response) => {
  editEventController.handle(req, res);
});

router.delete("/event", verifyJWT, (req: Request, res: Response) => {
  cancelEventController.handle(req, res);
});

router.put("/event/exit", verifyJWT, (req: Request, res: Response) => {
  exitOfTheEventController.handle(req, res);
});

router.get("/event", verifyJWT, (req: Request, res: Response) => {
  findEventsController.handle(req, res);
});

export { router as eventsRouter };
