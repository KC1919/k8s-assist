import express, { type Express, type Request, type Response } from 'express';
import cors from "cors";
import dotenv from 'dotenv';
import podRouter from './routes/pod.routes';
import namespaceRouter from './routes/namespace.routes';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5050;

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

app.use('/api/pods', podRouter);
app.use('/api/namespaces', namespaceRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});