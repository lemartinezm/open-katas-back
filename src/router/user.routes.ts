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

    if (isAdmin) {
      // Query Params
      const id: any = req?.query?.id;
      if (id) {
        const controller: UserController = new UserController();
        const response: any = await controller.deleteUser(id);
        return res.status(response.status).send(response);
      } else {
        return res.status(400).send({
          message: 'No User ID Found to delete'
        });
      }
    } else {
      return res.status(401).send({
        message: 'You\'re not authorized to perform this action'
      });
    }
  })

  // * Update user only if you're admin
  .put(verifyToken, verifyAdmin, async (req: Request, res: Response) => {
    const isAdmin: boolean = res.locals.isAdmin;

    if (isAdmin) {
      const id: any = req?.query?.id;
      if (id) {
        // Body params
        const name: any = req?.body?.name;
        const email: any = req?.body?.email;
        const age: any = req?.body?.age;

        const controller = new UserController();
        const response = await controller.updateUsers(id, {
          name,
          email,
          age
        });
        return res.status(200).send(response);
      } else {
        return res.status(400).send({
          message: 'No User ID found to update'
        });
      }
    } else {
      return res.status(401).send({
        message: 'You\'re not authorized to perform this action'
      });
    }
  });

// * Get Katas from User
userRouter.route('/katas')
  .get(verifyToken, async (req: Request, res: Response) => {
    // Query Param
    const id: any = req?.query?.id || res.locals.userId;
    const page: any = req?.query?.page || 1;
    const limit: any = req?.query?.limit || 10;
    let response: any = {};

    if (id) {
      const controller: UserController = new UserController();
      response = await controller.getKatas(page, limit, id);
    } else {
      response = {
        status: 400,
        message: 'Please, provide an ID to retreive the katas'
      };
    }
    return res.status(response.status).send(response);
  });

export default userRouter;
