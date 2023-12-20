import express from 'express';
import { requestCounterMiddleware } from './common/middlewares/reques-counter/request-counter.middleware';
import { exceptionFilter } from './common/errors/exception-filter/exception-filter';
import { postRouter } from './routes/post.router';
import { blogRouter } from './routes/blog.router';
import { testRouter } from './routes/test.router';
import { logRequestsMiddleware } from './common/middlewares/log-requests/log-requests';
import { userRouter } from './routes/user.router';
import { authRouter } from './routes/auth.router';

export const app = express();

app.use(express.json());
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Nodes');
//     res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
//     res.header('Access-Control-Allow-Credentials', 'true');
//     next();
// });
app.use(requestCounterMiddleware);
app.use(logRequestsMiddleware);

app.use('', blogRouter, postRouter, userRouter, authRouter, testRouter);
// app.use('/videos', videoRouter);
// app.use('/blogs', blogRouter);
// app.use('/posts', postRouter);

// the exceptionFilter should be at the end of all routers
app.use(exceptionFilter);
