import http from 'http';
import express, { type Express, type Request, type Response } from 'express';
import cors from "cors";
import dotenv from 'dotenv';
import podRouter from './routes/pod.routes';
import namespaceRouter from './routes/namespace.routes';
import deploymentRouter from './routes/deployment.routes';
import eventRouter from './routes/event.routes';
import insightRouter from './routes/insight.routes';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';
import { setupLogSocket } from './websocket/logs.socket';
import { requestLogger } from './middlewares/logger.middleware';

dotenv.config();

const app: Express = express();
const server = http.createServer(app);
const port = process.env.PORT || 5050;

setupLogSocket(server);

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send({message: 'Express server is running'});
});

app.get('/health', (req: Request, res: Response) => {
    res.send({
        status: 'OK',
        message: 'Backend is running smoothly'
    });
});

app.use(requestLogger);

app.use('/api/pods', podRouter);
app.use('/api/namespaces', namespaceRouter);
app.use('/api/deployments', deploymentRouter);
app.use('/api/events', eventRouter);
app.use('/api/insights', insightRouter);

app.use(notFoundHandler);
app.use(errorHandler);

server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});