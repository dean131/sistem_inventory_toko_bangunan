import express from "express";
import { publicRouter } from "../route/public-api.js";
import { errorMiddleware } from "../middleware/error-middleware.js";
import { userRouter } from "../route/api.js";
import bodyParser from "body-parser";

export const web = express();
web.use(express.json());

web.use("/public", express.static("public"));

web.use(bodyParser.json());

web.set("view engine", "ejs");
web.set("views", "./src/views");

web.use(publicRouter);
web.use(userRouter);

web.use(errorMiddleware);
