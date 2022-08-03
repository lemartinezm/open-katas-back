import express, { Request, Response } from 'express';
import cors from 'cors';
import authRouter from './auth.routes';
import kataRouter from './kata.routes';

// For the home page from API (http://localhost:3000)
const homeRouter = express.Router();

homeRouter.get('/', (req: Request, res: Response) => {
  return res.status(200).send({
    status: 200,
    message: 'Welcome to Open Katas API'
  });
});

// For redirections in diferents routers for differents nested routes from '/api'
const rootRouter = express();

rootRouter.use(cors());
rootRouter.use('/', homeRouter);
rootRouter.use('/auth', authRouter);
rootRouter.use('/katas', kataRouter);

export default rootRouter;
