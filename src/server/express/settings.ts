import express from 'express';
import { videoRouter } from './routes/video.routers';

export const app = express();
app.use(express.json());

app.use(videoRouter);
