import { userEntity } from '../models/schemas/user';
import { LogError, LogSuccess } from '../utils/Logger';
import dotenv from 'dotenv';
import { UserSchema } from '../models/interfaces/user.interface';
import { kataEntity } from '../models/schemas/kata';

// Env variables
dotenv.config();

/**
 * Method to get All Users with pagination and limit
 * @param {number} page Page number that will be retrieved
 * @param {number} limit Number of users that will be retrieved
 * @returns Object with response status and users requested or error message
 */
export const getAllUsers = async (page: number, limit: number): Promise<any[] | undefined> => {
  const response: any = {};
  try {
    const userModel = userEntity();
    // Search and pagination
    // Hide the pass and role
    await userModel.find({}, { name: 1, email: 1, age: 1, katas: 1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .then((users: UserSchema[]) => {
        response.status = 200;
        response.users = users;
      });
    // Calculate and return the number of pages
    await userModel.countDocuments()
      .then((total: number) => {
        response.totalPages = Math.ceil(total / limit);
        response.currentPage = page;
      });
  } catch (error) {
    response.status = 400;
    response.message = 'Error getting all users';
    LogError(`[ORM ERROR]: Getting all users: ${error}`);
  }
  return response;
};

/**
 * Method to get User by ID
 * @param id User ID that will be retrieved
 * @returns Object with response status and user found or error message.
 */
export const getUserById = async (id: string): Promise <any | undefined> => {
  const response: any = {};
  try {
    const userModel = userEntity();
    await userModel.findById(id, { name: 1, email: 1, age: 1, katas: 1 })
      .then(user => {
        response.status = 200;
        response.user = user;
      });
  } catch (error) {
    response.status = 400;
    response.message = 'Error getting User by ID';
    LogError(`[ORM ERROR]: Getting user by id: ${id}`);
  }
  return response;
};

/**
 * Method to delete User by ID
 * @param {string} id User ID that will be deleted
 * @returns Object with the response status and confirmation or error message
 */
export const deleteUserById = async (id: string): Promise <any | undefined> => {
  const response: any = {};
  try {
    const userModel = userEntity();
    await userModel.findByIdAndDelete(id)
      .then(() => {
        response.status = 200;
        response.message = `User with ID ${id} deleted successfully`;
        LogSuccess(`[/api/katas] User with ID ${id} deleted successfully`);
      });
  } catch (error) {
    response.status = 400;
    response.message = `Error deleting User with ID ${id}`;
    LogError(`[ORM ERROR]: Deleting user by id: ${id}`);
  }
  return response;
};

/**
 * Method to update a User by Id
 * @param {string} id User ID that will be updated
 * @param user User object with data updated
 * @returns Object with the response status and confirmation / error message
 */
export const updateUser = async (id: string, user: any) => {
  const response: any = {};
  try {
    const userModel = userEntity();
    await userModel.findByIdAndUpdate(id, user).then(() => {
      response.status = 200;
      response.message = `User with id ${id} updated successfully`;
      LogSuccess(`[/api/users] User with id ${id} updated successfully`);
    });
  } catch (error) {
    response.status = 400;
    response.message = `Error updating user with ID ${id}`;
    LogError(`[ORM ERROR]: Updating user with ID : ${id}`);
  }
  return response;
};

/**
 * Method to get Katas from User with ID
 * @param page Page that will be retrieved
 * @param limit Number of user retreived per request
 * @param id User ID
 * @returns Object with the response status, User information and Katas found or response status and error message
 */
export const getKatasFromUser = async (page: number, limit: number, id: string): Promise <any> => {
  const response: any = {};
  try {
    const kataModel = kataEntity();
    const userModel = userEntity();
    await userModel.findById(id, { name: 1, email: 1 })
      .then(async (userFound) => {
        await kataModel.find({ 'creator.creatorId': id })
          .then((katasFound) => {
            response.status = 200;
            response.user = userFound;
            response.katas = katasFound;
          });
      });
  } catch (error) {
    response.status = 400;
    response.message = 'Error getting Katas from User';
    LogError(`[ORM ERROR] Getting Katas from User. ${error}`);
  }
  return response;
};
