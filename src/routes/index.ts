import { Router, Request, Response } from "express";
import * as cors from "cors";
import { StandarCode, DataErrorCode } from "./../models/api";
import WhatsappRouter from "./whatsAppRouter";

class Routes {
  router: Router;

  constructor() {
    this.router = Router();
    this.router.use(cors());
    this.router.use(WhatsappRouter);
    this.router.get("/health", async (req: Request, res: Response) => {
      res.status(StandarCode.OK).json({
        status: "ok",
      });
    });
  }
}

export default new Routes().router;
