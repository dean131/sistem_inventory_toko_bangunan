import express from "express";
import userController from "../controller/user-controller.js";
import productController from "../controller/product-controller.js";
import supplierController from "../controller/supplier-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";
import orderitemController from "../controller/orderitem-controller.js";

const userRouter = new express.Router();
userRouter.use(authMiddleware);

// User API
userRouter.get("/api/users/current", userController.get);
userRouter.patch("/api/users/current", userController.update);
userRouter.delete("/api/users/logout", userController.logout);

// Product API
userRouter.get("/api/products", productController.getMany);
userRouter.get("/api/products/:id", productController.get);
userRouter.post("/api/products", productController.create);
userRouter.patch("/api/products/:id", productController.update);
userRouter.delete("/api/products/:id", productController.destroy);

// Supplier API
userRouter.get("/api/suppliers", supplierController.getMany);
userRouter.get("/api/suppliers/:id", supplierController.get);
userRouter.post("/api/suppliers", supplierController.create);
userRouter.patch("/api/suppliers/:id", supplierController.update);
userRouter.delete("/api/suppliers/:id", supplierController.destroy);

// Order Item API
userRouter.post("/api/orderitems", orderitemController.create);

export { userRouter };
