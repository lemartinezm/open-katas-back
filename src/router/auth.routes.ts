import express, { Request, Response } from 'express';

// Misc
import bcrypt from 'bcrypt';
import { LogError } from '../utils/Logger';
import { UserSchema } from '../models/interfaces/user.interface';
import { AuthController } from '../controllers/auth.controllers';
import { AuthSchema } from '../models/interfaces/auth.interface';

const authRouter = express.Router();

// To read JSON from body
authRouter.use(express.json());

// * Register new user
authRouter.route('/register')
  .post(async (req: Request, res: Response) => {
    const { name, email, password, age } = req.body;

    if (name && email && password && age) {
      // Hash password
      const hashedPassword = bcrypt.hashSync(password, 8);
      const newUser: UserSchema = {
        name,
        email,
        password: hashedPassword,
        age,
        katas: [],
        role: 'user'
      };

      const controller: AuthController = new AuthController();
      const response = await controller.registerUsers(newUser);

      return res.status(response.status).send(response);
    } else {
      LogError('[/api/auth/register] Creating user with incomplete fields');
      return res.status(400).send({
        message: 'Please complete all the fields'
      });
    }
  });

// * Admin register new user
// authRouter.route('/register/admin')
//   .post(verifyToken, verifyAdmin, verifyUser, async (req: Request, res: Response) => {
//     const isAdmin: boolean = res.locals.isAdmin;

//     if (isAdmin) {
//       const { name, email, password, age, role } = req.body;

//       if (name && email && password && age && role) {
//         // Hash password
//         const hashedPassword = bcrypt.hashSync(password, 8);
//         const newUser: IUser = {
//           name,
//           email,
//           password: hashedPassword,
//           age,
//           katas: [],
//           role
//         };

//         const controller: AuthController = new AuthController();
//         const response = await controller.registerUsers(newUser);

//         return res.status(response.status).send(response);
//       } else {
//         LogError('[/api/auth/register/admin] Creating user with incomplete fields');
//         return res.status(400).send({
//           message: 'Please complete all the fields'
//         });
//       }
//     } else {
//       return res.status(401).send({
//         message: 'You\'re not authorized to perform this action'
//       });
//     }
//   });

// * Login user
authRouter.route('/login')
  .post(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (email && password) {
      const auth: AuthSchema = {
        email,
        password
      };
      const controller: AuthController = new AuthController();
      const response = await controller.loginUsers(auth);
      return res.status(response.status).send(response);
    } else {
      return res.status(400).send({
        message: 'Please, provide an email and password to login'
      });
    }
  });

// * Verify token that is send from FrontEnd
authRouter.route('/me')
  .get(async (req: Request, res: Response) => {
    return res.status(200).send({
      isAdmin: res.locals.isAdmin
    });
  });

export default authRouter;
