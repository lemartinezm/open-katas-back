import { Body, Get, Put, Query, Route, Tags, Delete } from 'tsoa';
import { deleteUserById, getAllUsers, getKatasFromUser, getUserById, updateUser } from '../database/user.odm';
import { LogInfo, LogSuccess, LogWarning } from '../utils/Logger';
import { IUserController } from './interfaces';

@Route('/api/users')
@Tags('UserController')
export class UserController implements IUserController {
  /**
   * Endpoint to Get Users (includes pagination)
   * @param {number} page Page that is requested
   * @param {number} limit Number of users that is going to be retreived
   * @param {string} id User ID to retreive
   * @returns Object with response status and data retreived / message error
   */
  @Get('/')
  public async getUsers (@Query() page: number, @Query() limit: number, @Query() id?: string): Promise<any> {
    if (id) {
      LogInfo(`[/api/users] Getting user with id ${id}`);
      return await getUserById(id);
    } else {
      LogInfo('[/api/users] Getting all users');
      return await getAllUsers(page, limit);
    }
  }

  /**
   * Endpoint to delete User by ID
   * @param {string} id User ID to delete
   * @returns Object with the response status and confirmation / error message
   */
  @Delete('/')
  public async deleteUser (@Query() id: string): Promise<any> {
    LogWarning(`[/api/users] Trying to delete user with ID: ${id}`);
    return await deleteUserById(id);
  }

  /**
   * Endpoint to update User by ID
   * @param {string} id User ID to update
   * @param user Data updated to send
   * @returns Object with the response status and confirmation / error message
   */
  @Put('/')
  public async updateUsers (@Query() id: string, @Body() user: any): Promise<any> {
    LogInfo(`[/api/users] Trying to update user with ID: ${id}`);
    return await updateUser(id, user);
  }

  /**
   * Endpoint to get Katas from specific User (includes pagination)
   * @param page Page that is requested
   * @param limit Number of katas retreived per request
   * @param id User ID to get Katas
   * @returns Object with the response status, User information and Katas found or response status and error message
   */
  public async getKatas (page: number, limit: number, id: string): Promise<any> {
    LogSuccess(`[/api/users/katas] Obtaining katas from user with ID ${id}`);
    return await getKatasFromUser(page, limit, id);
  }
}
