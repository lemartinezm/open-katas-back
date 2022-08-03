import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { userEntity } from '../models/schemas/user';
import { LogError, LogSuccess } from '../utils/Logger';
import { AuthSchema } from '../models/interfaces/auth.interface';
import { UserFoundSchema, UserSchema } from '../models/interfaces/user.interface';

// Env variables
dotenv.config();
const SECRET = process.env.SECRET_KEY;

/**
 * Method to register new User
 * @param user User data for registration
 * @returns Object with response status and confirmation or error message
 */
export const registerUser = async (user: UserSchema) => {
  try {
    const userModel = userEntity();
    await userModel.create(user);
    return {
      status: 201,
      message: 'User created successfully'
    };
  } catch (error) {
    LogError(`[ORM ERROR]: Registering user: ${error}`);
    return {
      status: 400,
      message: '[ERROR]: Register user failed'
    };
  }
};

/**
 * Method to login User
 * @param auth Login data
 * @returns Object with response status, User found and Token signed or response status and error message.
 */
export const loginUser = async (auth: AuthSchema): Promise <any> => {
  try {
    let userFound: UserFoundSchema | undefined;
    const userModel = userEntity();
    await userModel.findOne({ email: auth.email }).then((user: UserFoundSchema) => {
      userFound = user;
    }).catch((error) => {
      LogError('[ERROR Authentication ORM]: User not found');
      throw new Error(`[ERROR Authentication ORM]: User not found: ${error}`);
    });

    // Verify password
    const validPassword = bcrypt.compareSync(auth.password, userFound!.password);

    if (!validPassword) {
      LogError('[ERROR Authentication ORM]: Invalid password');
      throw new Error('[ERROR Authentication ORM]: Invalid password');
    }

    // Create JWT
    const token: string = jwt.sign({ id: userFound!._id, role: userFound!.role }, SECRET!, {
      expiresIn: '3h'
    });

    LogSuccess('[/api/auth/login] Logging successful');

    return {
      status: 200,
      message: `Welcome ${userFound?.name}`,
      token,
      user: {
        _id: userFound?._id,
        name: userFound?.name,
        email: userFound?.email,
        katas: userFound?.katas,
        role: userFound?.role
      },
      loggedUserId: userFound?._id,
      admin: await isAdmin(userFound!._id.toString())
    };
  } catch (error) {
    LogError(`[ORM ERROR] ${error}`);
    return {
      status: 401,
      message: `Logging failed. ${error}`
    };
  }
};

/**
 * Method to find repeated username in Database
 * @param name Name to verify
 * @returns {boolean} Boolean that confirm if a repeated username was found
 */
export const hasRepeatedName = async (name: string): Promise<boolean> => {
  const userModel = userEntity();
  let isFound: boolean = false;
  try {
    await userModel.findOne({ name })
      .then((user) => {
        if (user) {
          isFound = true;
        }
      });
  } catch (error) {
    LogError(`[AUTH ORM]: ${error}`);
  }

  return isFound;
};

/**
 * Method to find repeated email in Database
 * @param {string} email Email to verify
 * @returns {boolean} Boolean that confirm if a repeated username was found
 */
export const hasRepeatedEmail = async (email: string): Promise<boolean> => {
  const userModel = userEntity();
  let isFound: boolean = false;
  try {
    await userModel.findOne({ email })
      .then((user) => {
        if (user) {
          isFound = true;
        }
      });
  } catch (error) {
    LogError(`[AUTH ORM]: ${error}`);
  }
  return isFound;
};

/**
 * Method to find out if user has admin role
 * @param loggedUserId Logged User ID
 * @returns {boolean} Boolean that says if a user has admin role
 */
export const isAdmin = async (loggedUserId: string): Promise<any> => {
  const userModel = userEntity();
  let isAdmin: boolean = false;
  try {
    await userModel.findById(loggedUserId, { role: 1 })
      .then((res) => {
        if (res.role === 'admin') {
          isAdmin = true;
        }
      });
  } catch (error) {
    LogError(`[AUTH ORM]: ${error}`);
  }
  return isAdmin;
};
