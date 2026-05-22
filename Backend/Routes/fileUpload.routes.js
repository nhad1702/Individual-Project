import fileUploadController from '../Controllers/fileUpload.controllers.js';
import { Router } from 'express';
import upload from '../Middlewares/upload.middelwares.js';
import { authToken } from '../Middlewares/auth.middlewares.js';

const fileUploadRouter = Router();

fileUploadRouter.post('/upload', authToken, upload.single('file'), fileUploadController.uploadFile);

export default fileUploadRouter;