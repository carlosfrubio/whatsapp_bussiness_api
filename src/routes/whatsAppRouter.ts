import ClientMessageController from "../controllers/clientMessageController";
import DbController from "../controllers/dbController";
import { Router, Request, Response } from "express";
import { DataErrorCode, StandarCode } from "../models/api";

class WhatsappRouter {
  router: Router;

  constructor() {
    this.router = Router();
    this.endPoints();
  }

  private endPoints(): void {
    this.router.get("/webhook", this.hookVeryfication);
    this.router.get("/phones", this.getPhonesData);
    this.router.post("/webhook", this.hook);
    this.router.post("/create_waba_phone", this.createWabaPhone);
    this.router.put("/update_phone", this.updatePhoneData);
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
          const message = await ClientMessageController.manageWebHook(
            req.body.entry[0].changes[0].value
          );
          res.status(StandarCode.OK).json({
            status: "success",
            message,
          });
        } catch (error) {
          res.status(DataErrorCode.INVALID).json(error);
        }
      } else {
        res.status(StandarCode.OK).json({
          status: "success",
        });
      }
    } else {
      res.status(DataErrorCode.INVALID).json({ error: "EMPTY-DATA" });
    }
  }

  private async hookVeryfication(req: Request, res: Response) {
    //const verify_token = config.tokenVerification;

    // Parse params from the webhook verification request
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];
    //console.log(req)
    // Check if a token and mode were sent
    if (mode && token) {
      // Check the mode and token sent are correct
      if (mode === "subscribe") {
        // Respond with 200 OK and challenge token from the request
        const data = await ClientMessageController.handleHookVerify(token);
        if (data) {
          res.status(200).send(challenge);
        } else {
          res.status(DataErrorCode.INVALID).json({ error: "BAD REQUEST" });
        }
      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        res.status(DataErrorCode.INVALID).json({ error: "BAD REQUEST" });
      }
    }
  }

  private async createWabaPhone(req: Request, res: Response) {
    try {
      if (
        req.body["phone_number"] &&
        req.body["phone_number_id"] &&
        req.body["waba_id"] &&
        req.body["bot_url"] &&
        req.body["token"] &&
        req.body["verify_token"]
      ) {
        const message = await DbController.createWabaPhone(
          req.body["phone_number"],
          req.body["phone_number_id"],
          req.body["waba_id"],
          req.body["bot_url"],
          req.body["token"],
          req.body["verify_token"]
        );
        res.status(StandarCode.OK).json({
          status: "success",
          message,
        });
      }
    } catch (error) {
      res.status(DataErrorCode.INVALID).json(error);
    }
  }

  private async getPhonesData(req: Request, res: Response) {
    try {
      const data = await DbController.getPhonesData();
      res.status(StandarCode.OK).json({
        status: "success",
        data,
      });
    } catch (error) {
      res.status(DataErrorCode.INVALID).json(error);
    }
  }

  private async updatePhoneData(req: Request, res: Response) {
    try {
      if (req.body.id && req.body.payload) {
        const { id, payload } = req.body;
        const data = await DbController.updatePhoneData(id, payload);
        if (data) {
          res.status(StandarCode.OK).json({
            status: "success",
            data,
          });
        } else {
          res.status(DataErrorCode.NOT_FOUND).json({
            status: "error",
            message: "Phone not found",
          });
        }
      } else {
        res.status(DataErrorCode.INVALID).json({ error: "EMPTY DATA" });
      }
    } catch (error) {
      res.status(DataErrorCode.INVALID).json(error);
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
