import express from 'express';
import { videoRouter } from './routes/video.routers';
import { requestCounterMiddleware } from './common/middlewares/reques-counter/request-counter.middleware';
import { exceptionFilter } from './common/errors/exception-filter/exception-filter';

export const app = express();

app.use(express.json());
app.use(requestCounterMiddleware);

app.use('', videoRouter);

// the exceptionFilter should be at the end of all routers
app.use(exceptionFilter);
