import userControllers from "../Controllers/users.controllers.js";
import { authToken } from '../Middlewares/auth.middlewares.js';
import { Router } from "express";

const usersRouter = Router();

usersRouter.post("/", authToken, userControllers.createUser);
usersRouter.put("/:id", authToken, userControllers.updateUser);
usersRouter.put("/change-password", authToken, userControllers.changePassword);

export default usersRouter;