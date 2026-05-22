import accountsRouter from "./accounts.routes.js";
import usersRouter from "./users.routes.js";
import questionsRouter from "./questions.routes.js";
import testsRouter from "./tests.routes.js";
import fileUploadRouter from "./fileUpload.routes.js";
import { Router } from "express";

const rootRouter = Router();

rootRouter.use("/accounts", accountsRouter);
rootRouter.use("/fileuploads", fileUploadRouter);
rootRouter.use("/users", usersRouter);
rootRouter.use("/questions", questionsRouter);
rootRouter.use("/tests", testsRouter);


export default rootRouter;