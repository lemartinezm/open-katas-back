import { NextFunction, Request, Response } from 'express';
import { isAdmin } from '../database/auth.odm';

/**
 * Method to verify if Logged User has Admin role and save in res.locals.isAdmin
 * @param req Request
 * @param res Response
 * @param next Next Function
 */
export const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const loggedUserId = res.locals.userId;
  res.locals.isAdmin = await isAdmin(loggedUserId);
  next();
};
