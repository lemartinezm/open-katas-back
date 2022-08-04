import { Post, Route, Tags, BodyProp, SuccessResponse, Response, Example } from 'tsoa';
import { loginUser, registerUser } from '../database/auth.odm';
import { AuthSchema } from '../models/interfaces/auth.interface';
import { UserSchema } from '../models/interfaces/user.interface';
import { LogInfo } from '../utils/Logger';
import { AuthResponse } from '../utils/Responses';
import { IAuthController } from './interfaces';

const errorExample: AuthResponse = {
  status: 400,
  message: 'Something went wrong'
};

@Route('/api/auth')
@Tags('AuthController')
export class AuthController implements IAuthController {
  /**
   * Endpoint to register new User
   * @param {string} name Name
   * @param {string} email Email
   * @param {string} password Password
   * @param {number} age Age
   * @returns Object with response status and confirmation or error message
   */
  @Post('/register')
  @SuccessResponse(201, 'User registered successfully')
  @Response<AuthResponse>(400, 'User registration failed', errorExample)
  @Example({
    status: 201,
    message: 'User registered successfully'
  })
  public async registerUsers (
    @BodyProp('name') name: string,
    @BodyProp('email') email: string,
    @BodyProp('password') password: string,
    @BodyProp('age') age: number
  ): Promise<AuthResponse> {
    LogInfo('[/api/auth/register] Creating new user');
    if (name && email && password && age) {
      const newUser: UserSchema = {
        name,
        email,
        password,
        age,
        katas: [],
        role: 'user'
      };
      return await registerUser(newUser);
    } else {
      return {
        status: 400,
        message: 'Please complete all the fields'
      };
    }
  }

  /**
   * Endpoint to login
   * @param {string} email Email
   * @param {string} password Password
   * @returns Object with response status, User found and Token signed or response status and error message
   */
  @Post('/login')
  @SuccessResponse(200, 'User logged successflully')
  @Response<AuthResponse>(400, 'Something went wrong', errorExample)
  @Example({
    status: 200,
    message: 'Welcome User',
    token: 'tokenExample'
  })
  public async loginUsers (
    @BodyProp('email') email: string,
    @BodyProp('password') password: string
  ): Promise<AuthResponse> {
    LogInfo(`[/api/auth/login] Trying to log: ${email}`);
    if (email && password) {
      const auth: AuthSchema = {
        email,
        password
      };
      return await loginUser(auth);
    } else {
      return {
        status: 400,
        message: 'Please, complete all the fields'
      };
    }
  }
}
