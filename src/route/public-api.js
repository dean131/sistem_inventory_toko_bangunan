import express from "express";
import userController from "../controller/user-controller.js";

const publicRouter = new express.Router();
publicRouter.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});
publicRouter.post("/api/users", userController.register);
publicRouter.post("/api/users/login", userController.login);

export { publicRouter };
