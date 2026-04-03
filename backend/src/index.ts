import express, { type Express, type Request, type Response } from 'express';
import cors from "cors";
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

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

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});