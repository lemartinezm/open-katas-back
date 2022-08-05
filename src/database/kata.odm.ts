import { IKataFound } from '../models/interfaces/kata.interface';
import { kataEntity } from '../models/schemas/kata';
import { userEntity } from '../models/schemas/user';
import { LogError, LogInfo } from '../utils/Logger';
import { KatasResponse } from '../utils/Responses';

/**
 * Method to get Katas with pagination, limit, filter and sort type
 * @param {number} page Page to retreive
 * @param {number} limit Number of Katas that will be retreived
 * @param {Object} filter Filter that will be applied
 * @param {Object} sortType Sort type that will be applied
 * @returns Object with response status and Katas found or error message
 */
export const getAllKatas = async (
  page: number,
  limit: number,
  filter?: any,
  sortType?: any): Promise<KatasResponse> => {
  const response: any = {};
  try {
    const kataModel = kataEntity();
    let steps: any = '';
    // Apply filters
    if (filter) {
      steps = kataModel.find(filter, { name: 1, level: 1, stars: 1, creator: 1, language: 1, participants: 1 });
    }
    // Apply sort
    if (sortType) {
      LogInfo(`[ORM] Sorting by ${sortType}`);
      steps = steps.sort(sortType);
    }
    // Pagination
    steps = steps.limit(limit).skip((page - 1) * limit);
    // Execution
    await steps.then((katas: any) => {
      response.status = 200;
      response.katas = katas;
    });
    // Add total pages and current page to the response
    await kataModel.countDocuments().then((total: number) => {
      response.totalPages = Math.ceil(total / limit);
      response.currentPage = page;
    });
  } catch (error) {
    response.status = 400;
    response.message = `Something went wrong. ${error}`;
    LogError(`[ORM ERROR] Getting all katas: ${error}`);
  }
  return response;
};

/**
 * Method to get Kata by ID
 * @param {string} kataId Kata ID to retrieve
 * @param {string} loggedUserId Logged User ID that is trying to get the Kata
 * @returns Object with response status and Kata found or error message.
 */
export const getKataById = async (kataId: string, loggedUserId: any): Promise<KatasResponse> => {
  const response: any = {};
  try {
    const kataModel = kataEntity();
    await kataModel.findById(kataId).then((kata: IKataFound) => {
      if (kata) {
        // Verify if user tried the Kata before to send solution or send kata without solution
        // TODO: use projections for this
        if (kata.participants.includes(loggedUserId)) {
          response.status = 200;
          response.kata = kata;
        } else {
          kata.solution = '';
          response.status = 200;
          response.kata = kata;
        }
      } else {
        response.status = 404;
        response.message = 'Kata not found';
      }
    });
  } catch (error) {
    response.status = 400;
    response.message = `Something went wrong. ${error}`;
    LogError(`[ORM ERROR] Getting kata with id ${kataId}: ${error}`);
  }
  return response;
};

/**
 * Method to delete Kata by ID
 * @param {string} id Kata ID to delete
 * @param {string} loggedUserId Logged User ID that is trying to delete the Kata
 * @param {boolean} isAdmin Boolean specifying if user has admin role
 * @returns Object with response status and confirmation or error message
 */
export const deleteKataById = async (id: string, loggedUserId: string, isAdmin: boolean): Promise<KatasResponse> => {
  const response: any = {};
  try {
    const kataModel = kataEntity();
    await kataModel.findById(id).then(async (kataFound: IKataFound) => {
      if (loggedUserId === kataFound.creator.toString() || isAdmin) {
        await kataModel.findByIdAndDelete(id).then(() => {
          response.status = 200;
          response.message = `Kata with id ${id} deleted successfully`;
        });
      } else {
        throw new Error('You don\'t have permission to delete this kata');
      }
    });
  } catch (error) {
    LogError(`[ORM ERROR] Deleting kata with id ${id}`);
    response.status = 401;
    response.message = `Error: ${error}`;
  }
  return response;
};

/**
 * Method to create a Kata
 * @param {Object} kata Kata object with values to create new Kata
 * @returns Object with status response and confirmation or error message
 */
export const createKata = async (kata: any): Promise<KatasResponse> => {
  const response: any = {};
  try {
    const kataModel = kataEntity();
    const userModel = userEntity();
    await kataModel.create(kata).then(async (kataCreated) => {
      await userModel.findByIdAndUpdate(kata.creator, {
        $push: { katas: kataCreated._id }
      });
      response.status = 201;
      response.message = 'Kata created successfully';
    });
  } catch (error) {
    LogError('[ORM ERROR] Creating new Kata');
    response.status = 400;
    response.message = `Error creating kata. Error: ${error}`;
  }
  return response;
};

/**
 * Method to update a Kata if the logged user is the creator
 * @param {string} id Kata ID that is going to be updated
 * @param {string} loggedUserId Logged user ID that is trying to update the Kata
 * @param {boolean} isAdmin Boolean specifying if the user is admin
 * @param {Object} kata Kata object with values updated
 * @returns Object with response status and confirmation or error message
 */
export const updateKata = async (id: string, loggedUserId: string, isAdmin: boolean, kata: any) => {
  const response: any = {};
  try {
    const kataModel = kataEntity();

    await kataModel.findById(id).then(async (kataFound: IKataFound) => {
      // Proceed if the user is the kata creator or has admin role
      if (loggedUserId === kataFound.creator.toString() || isAdmin) {
        await kataModel.findByIdAndUpdate(id, kata).then(() => {
          response.status = 200;
          response.message = `Kata with id ${id} updated successfully`;
        });
      } else {
        throw new Error('You don\'t have permission to update this kata');
      }
    });
  } catch (error) {
    LogError(`[ORM ERROR] Updating Kata with id ${id}. ${error}`);
    response.status = 401;
    response.message = `Error updating kata. ${error}`;
  }
  return response;
};

/**
 * Method to vote for a Kata with ID and saves the average
 * @param {string} loggedUserId Logged User ID
 * @param {string} id Kata ID to vote
 * @param {number} valoration Valoration that user gives to the Kata
 * @returns Object with response status and confirmation or error message
 */
export const voteKata = async (loggedUserId: string, id: string, valoration: any) => {
  // TODO: restringir votos repetidos
  const response: any = {};
  try {
    const kataModel = kataEntity();
    await kataModel.findById(id).then(async (kata) => {
      if (kata.participants.includes(loggedUserId)) {
        await kataModel.updateOne({ _id: id }, [
          {
            $set: {
              numValorations: { $add: ['$numValorations', 1] },
              allValorations: { $add: ['$allValorations', parseInt(valoration)] }
            }
          },
          {
            $set: {
              stars: {
                $round: [{ $divide: ['$allValorations', '$numValorations'] }, 1]
              }
            }
          }
        ]).then(() => {
          response.status = 200;
          response.message = `Vote for kata with id ${id} completed`;
        });
      } else {
        throw new Error('Kata not solved before');
      }
    });
  } catch (error) {
    response.status = 401;
    response.message = `${error}`;
    LogError(`[ORM ERROR] Voting Kata with id ${id}. ${error}`);
  }
  return response;
};

/**
 * Method to solve the kata
 * @param {string} kataId Kata ID to be solved
 * @param {string} loggedUserId User ID that solved the kata
 * @returns Object with response status and confirmation or error message
 */
export const solveKata = async (kataId: string, loggedUserId: string) => {
  // TODO: restringir que intentos repetidos agreguen al usuario a participantes
  const response: any = {};
  try {
    const kataModel = kataEntity();
    await kataModel.findById(kataId).then(async (kata) => {
      if (kata) {
        await kataModel.findByIdAndUpdate(kataId, {
          $push: { participants: loggedUserId }
        });
        response.status = 200;
        response.message = 'Kata solved successfully';
      } else {
        throw new Error('Kata not found');
      }
    });
  } catch (error) {
    response.status = 404;
    response.message = error;
    LogError(`[ORM ERROR] Solving Kata with id ${kataId}. Error: ${error}`);
  }
  return response;
};
