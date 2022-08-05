import express, { Request, Response } from 'express';
import { UserController } from '../controllers/user.controllers';
import { verifyAdmin } from '../middlewares/verifyAdmin.middleware';
import verifyToken from '../middlewares/verifyToken.middleware';

const userRouter = express.Router();
userRouter.use(express.json());

userRouter.route('/')
  // * Get users
  .get(verifyToken, async (req: Request, res: Response) => {
    // Query Params
    const id: any = req?.query?.id;
    // Pagination
    const page: any = req?.query?.page || 1;
    const limit: any = req?.query?.limit || 10;

    const controller: UserController = new UserController();
    const response: any = await controller.getUsers(page, limit, id);
    return res.status(response.status).send(response);
  })

  // * Delete user by ID only if you're admin
  .delete(verifyToken, verifyAdmin, async (req: Request, res: Response) => {
    const isAdmin: boolean = res.locals.isAdmin;
    const id: any = req?.query?.id;

    const controller: UserController = new UserController();
    const response: any = await controller.deleteUser(id, isAdmin);
    return res.status(response.status).send(response);
  })

  // * Update user only if you're admin
  .put(verifyToken, verifyAdmin, async (req: Request, res: Response) => {
    const isAdmin: boolean = res.locals.isAdmin;
    const id: any = req?.query?.id;
    const { name, email, age } = req?.body;

    const controller = new UserController();
    const response = await controller.updateUsers(id, isAdmin, name, email, age);
    return res.status(response.status).send(response);
  });

export default userRouter;
