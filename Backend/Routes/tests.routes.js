import testController from "../Controllers/tests.controllers.js";
import { authToken } from '../Middlewares/auth.middlewares.js';
import { Router } from "express";

const testsRouter = Router();

testsRouter.post("/", authToken, testController.createTest);
testsRouter.get('/', authToken, testController.getAllTests);
testsRouter.get('/:id', authToken, testController.getTestById);
testsRouter.put('/:id', authToken, testController.updateTest);
testsRouter.delete('/:id', authToken, testController.deleteTest);

export default testsRouter;