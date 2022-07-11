import clientMessage from "../controllers/clientMessage";
import { Router, Request, Response } from "express";
import { DataErrorCode, StandarCode } from "../models/api";
class WhatsappRouter {
  router: Router;

  constructor() {
    this.router = Router();
    this.endPoints();
  }

  private endPoints(): void {
    this.router.post("/webhook", this.hook);
    //this.router.post("/send_wa_message", this.sendWaMessage);
  }

  private async hook(req: Request, res: Response) {
    if (req.body.object) {
      if (
        req.body.entry &&
        req.body.entry[0].changes &&
        req.body.entry[0].changes[0] &&
        req.body.entry[0].changes[0].value.messages &&
        req.body.entry[0].changes[0].value.messages[0]
      ) {
        try {
          const message = await clientMessage.manageWebHook(req.body.entry[0].changes[0].value);
          res.status(StandarCode.OK).json({
            status: "success",
            message,
          });
        } catch (error) {
          res.status(DataErrorCode.INVALID).json(error);
        }
      }
    } else {
      res.status(DataErrorCode.INVALID).json({"error": "EMPTY-DATA"});
    }
  }

  /* private async sendWaMessage(req: Request, res: Response) {
    const data = req.body;
    try {
      const message = await clientMessage.sendWaMessage(data);
      console.log(StandarCode.OK);
      res.status(StandarCode.OK).json({
        status: "success",
        message,
      });
      console.log("Envio un OK");
    } catch (error) {
      res.status(DataErrorCode.INVALID).json(error);
      console.log("Envio un ERROR");
    }
  } */
}

export default new WhatsappRouter().router;
