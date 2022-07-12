import * as express from "express";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import * as morgan from "morgan";
import * as mongoose from "mongoose";
import Routes from "./routes";
import { config } from "./config";

class App {
  app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  private config(): void {
    mongoose.connect(config.db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any);
    mongoose.set("useFindAndModify", false);
    this.app.use(morgan("dev"));
    this.app.use(helmet());
    this.app.use(bodyParser.json({ limit: "50mb" }));
    this.app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
    mongoose.connection.on("open", () => {
      console.log("Ingredion DB Online.");
    });
  }

  private routes(): void {
    this.app.use("/v1", Routes);
  }
}

export default new App().app;
