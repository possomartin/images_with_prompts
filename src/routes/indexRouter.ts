import { Router } from 'express';
import openaiRouter from './openAI/openaiRouter.js';
import upscalerRouter from './upscaler/upscalerRouter.js';

const indexRouter = Router();

indexRouter.use(openaiRouter);
indexRouter.use(upscalerRouter);

export default indexRouter;
