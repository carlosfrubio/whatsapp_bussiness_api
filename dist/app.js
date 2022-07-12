"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");
const routes_1 = require("./routes");
const config_1 = require("./config");
class App {
    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }
    config() {
        mongoose.connect(config_1.config.db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        mongoose.set("useFindAndModify", false);
        this.app.use(morgan("dev"));
        this.app.use(helmet());
        this.app.use(bodyParser.json({ limit: "50mb" }));
        this.app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
        mongoose.connection.on("open", () => {
            console.log("Ingredion DB Online.");
        });
    }
    routes() {
        this.app.use("/v1", routes_1.default);
    }
}
exports.default = new App().app;
//# sourceMappingURL=app.js.map