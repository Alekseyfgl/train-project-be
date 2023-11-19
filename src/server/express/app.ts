import express from 'express';
import { requestCounterMiddleware } from './common/middlewares/reques-counter/request-counter.middleware';
import { exceptionFilter } from './common/errors/exception-filter/exception-filter';
import { videoRouter } from './routes/video.router';
import { postRouter } from './routes/post.router';
import { blogRouter } from './routes/blog.router';
import { testRouter } from './routes/test.router';

export const app = express();

app.use(express.json());
app.use(requestCounterMiddleware);

app.use('', videoRouter, blogRouter, postRouter, testRouter);
// app.use('/videos', videoRouter);
// app.use('/blogs', blogRouter);
// app.use('/posts', postRouter);

// the exceptionFilter should be at the end of all routers
app.use(exceptionFilter);
