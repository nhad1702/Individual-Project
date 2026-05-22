import questionControllers from "../Controllers/questions.controllers.js";
import { authToken } from '../Middlewares/auth.middlewares.js';
import { Router } from "express";

const questionsRouter = Router();

questionsRouter.post("/", authToken, questionControllers.createQuestion);
questionsRouter.get('/', authToken, questionControllers.getAllQuestions);
questionsRouter.get('/test/:testId', authToken, questionControllers.getQuestionsByTestId);
questionsRouter.get('/user/:userId', authToken, questionControllers.getQuestionsByUserId);
questionsRouter.put('/:id', authToken, questionControllers.editQuestion);
questionsRouter.delete('/:id', authToken, questionControllers.deleteQuestion);

export default questionsRouter;