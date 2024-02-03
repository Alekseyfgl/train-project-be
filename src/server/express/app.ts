import express from 'express';
import { requestCounterMiddleware } from './common/middlewares/reques-counter/request-counter.middleware';
import { postRouter } from './routes/post.router';
import { blogRouter } from './routes/blog.router';
import { testRouter } from './routes/test.router';
import { logRequestsMiddleware } from './common/middlewares/log-requests/log-requests';
import { userRouter } from './routes/user.router';
import { authRouter } from './routes/auth.router';
import { commentRouter } from './routes/comment.router';
import cookieParser from 'cookie-parser';
import { exceptionFilter } from './common/errors/exception-filter/exception-filter';
import { RateLimitReqMiddleware } from './common/middlewares/rate-limit-request/rate-limit-request.middleware';
import { setUserAgentMiddleware } from './common/middlewares/user-agent/user-agent.middleware';
import { deviceSessionRouter } from './routes/device-session.router';

export const app = express();
// const expressip = require('express-ip');
// app.use(expressip().getIpInfoMiddleware);
app.use(express.json());
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Nodes');
//     res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
//     res.header('Access-Control-Allow-Credentials', 'true');
//     next();
// });
//
// saveCrashTime();
// readCrashTime();
// clearCrashTime();
app.set('trust proxy', true);

app.use(cookieParser());
app.use(requestCounterMiddleware);
app.use(logRequestsMiddleware);
app.use(RateLimitReqMiddleware);
app.use(setUserAgentMiddleware);

app.use('', blogRouter, postRouter, userRouter, authRouter, commentRouter, deviceSessionRouter, testRouter);
// app.use('/videos', videoRouter);
// app.use('/blogs', blogRouter);
// app.use('/posts', postRouter);

// the exceptionFilter should be at the end of all routers
app.use(exceptionFilter);
