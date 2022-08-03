import { Post, Route, Tags, Body } from 'tsoa';
import { loginUser, registerUser } from '../database/auth.odm';
import { AuthSchema } from '../models/interfaces/auth.interface';
import { UserSchema } from '../models/interfaces/user.interface';
import { LogInfo } from '../utils/Logger';
import { IAuthController } from './interfaces';

@Route('/api/auth')
@Tags('AuthController')
export class AuthController implements IAuthController {
  /**
   * Endpoint to register new User
   * @param user User Data to register (name + email + password + age + katas + role)
   * @returns Object with response status and confirmation or error message
   */
  @Post('/register')
  public async registerUsers (@Body()user: UserSchema): Promise<any> {
    LogInfo('[/api/auth/register] Creating new user');
    return await registerUser(user);
  }

  /**
   * Endpoint to login
   * @param auth User data to login (email + password)
   * @returns Object with response status, User found and Token signed or response status and error message
   */
  @Post('/login')
  public async loginUsers (@Body()auth: AuthSchema): Promise<any> {
    LogInfo(`[/api/auth/login] Trying to log: ${auth.email}`);
    return await loginUser(auth);
  }
}
