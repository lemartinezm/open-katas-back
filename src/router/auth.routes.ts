import express, { Request, Response } from 'express';

// Misc
import bcrypt from 'bcrypt';
import { AuthController } from '../controllers/auth.controllers';

const authRouter = express.Router();

// To read JSON from body
authRouter.use(express.json());

// * Register new user
authRouter.route('/register')
  .post(async (req: Request, res: Response) => {
    const { name, email, password, age } = req?.body;

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 8);
    const controller: AuthController = new AuthController();
    const response = await controller.registerUsers(name, email, hashedPassword, age);

    return res.status(response.status).send(response);
  });

// * Login user
authRouter.route('/login')
  .post(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const controller: AuthController = new AuthController();
    const response = await controller.loginUsers(email, password);

    return res.status(response.status).send(response);
  });

export default authRouter;
