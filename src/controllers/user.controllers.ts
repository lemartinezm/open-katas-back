import { Get, Put, Query, Route, Tags, Delete, Inject, BodyProp, SuccessResponse, Example, Response } from 'tsoa';
import { deleteUserById, getAllUsers, getUserById, updateUser } from '../database/user.odm';
import { LogInfo, LogWarning } from '../utils/Logger';
import { UsersResponse } from '../utils/Responses';
import { IUserController } from './interfaces';

const errorExample = {
  status: 400,
  message: 'Something went wrong'
};

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
  @SuccessResponse(200, 'Users obtained successfully')
  @Example(
    {
      status: 200,
      users: [
        {
          _id: '62ead98822cd04870ab7278b',
          name: 'Martín',
          email: 'martin@email.com',
          age: 30,
          katas: [
            '62eae045d5c645439b3a026a',
            '62eaf1e8946b8624a7901072'
          ]
        },
        {
          _id: '62ed2ef188b1ccf16afb5d89',
          name: 'Jorge',
          email: 'jorge@email.com',
          age: 30,
          katas: []
        }
      ],
      totalPages: 1,
      currentPage: 1
    }
  )
  @Response<UsersResponse>(400, 'Something went wrong', errorExample)
  public async getUsers (
    @Query() page: number,
    @Query() limit: number,
    @Query() id?: string
  ): Promise<UsersResponse> {
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
   * @param {boolean} isAdmin User role
   * @returns Object with the response status and confirmation / error message
   */
  @Delete('/')
  @SuccessResponse(200, 'User deleted successfully')
  @Example({
    status: 400,
    message: 'User deleted successfully'
  })
  @Response<UsersResponse>(400, 'Something went wrong', errorExample)
  public async deleteUser (
    @Query() id: string,
    @Inject() isAdmin: boolean
  ): Promise<UsersResponse> {
    LogWarning(`[/api/users] Trying to delete user with ID: ${id}`);

    if (isAdmin) {
      if (id) {
        return await deleteUserById(id);
      } else {
        return {
          status: 404,
          message: 'No User ID found to delete'
        };
      }
    } else {
      return {
        status: 401,
        message: 'You\'re not authorized to perform this action'
      };
    }
  }

  /**
   * Endpoint to update User by ID
   * @param {string} id User ID to update
   * @param {boolean} isAdmin User role
   * @param {string} name Name
   * @param {string} email Email
   * @param {number} age Age
   * @returns Object with the response status and confirmation or error message
   */
  @Put('/')
  @SuccessResponse(200, 'User updated successfully')
  @Example({
    status: 200,
    message: 'User updated successfully'
  })
  @Response<UsersResponse>(400, 'Something went wrong', errorExample)
  public async updateUsers (
    @Query() id: string,
    @Inject() isAdmin: boolean,
    @BodyProp('name') name: string,
    @BodyProp('email') email: string,
    @BodyProp('age') age: number
  ): Promise<any> {
    LogInfo(`[/api/users] Trying to update user with ID: ${id}`);
    if (isAdmin) {
      if (id) {
        return await updateUser(id, { name, email, age });
      } else {
        return {
          status: 404,
          message: 'No User ID found to update'
        };
      }
    } else {
      return {
        status: 401,
        message: 'You\'re not authorized to perform this action'
      };
    }
  }
}
