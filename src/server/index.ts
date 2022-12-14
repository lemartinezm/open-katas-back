import express, { Request, Response } from 'express';
import dbConnect from '../configs/mongo.config';
import rootRouter from '../router/root.routes';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../../public/swagger.json';

// Connection with DB
dbConnect();

const server = express();

server.get('/', (req: Request, res: Response) => {
  return res.redirect('/api');
});

// Serve documentation
server.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

server.use('/api', rootRouter);

export default server;
