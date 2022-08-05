import { BodyProp, Delete, Get, Inject, Post, Put, Query, Route, Tags } from 'tsoa';
import { getKataById, createKata, deleteKataById, getAllKatas, solveKata, updateKata, voteKata } from '../database/kata.odm';
import { LogInfo, LogSuccess, LogWarning } from '../utils/Logger';
import { KatasResponse } from '../utils/Responses';
import { IKataController } from './interfaces';

@Route('/api/katas')
@Tags('KataController')
export class KataController implements IKataController {
  /**
   * Endpoint to get all Katas (or one by ID)
   * @param {string} loggedUserId Logged User ID
   * @param {number} page Page to retrieve
   * @param {number} limit Limits the number of Katas retrieved
   * @param {string} kataId Kata ID to retrieve
   * @param {Object} filter Filter that will be applied
   * @param {Object} sortType Sort that will be applied (ex: name_asc or name_des)
   * @returns Object with response status and Katas found (or kata by ID) or error message.
   */
  @Get('/')
  public async getKatas (
    @Inject() loggedUserId: string,
    @Query() page: number,
    @Query() limit: number,
    @Query() kataId?: string,
    @Query() level?: string,
    @Query() language?: string,
    @Query() sortType?: string): Promise<KatasResponse> {
    if (kataId) {
      LogInfo(`[/api/katas] Getting Kata with ID ${kataId}`);
      return await getKataById(kataId, loggedUserId);
    } else {
      LogInfo('[/api/katas] Getting Katas');

      // Filters
      const filter: any = {};
      if (level) {
        filter.level = level;
        LogInfo(`[Query Params]: level ${level}`);
      }
      if (language) {
        filter.language = language;
        LogInfo(`[Query Params]: language ${language}`);
      }

      // Example of sortType: level_asc
      const sort: any = {};
      if (sortType) {
        const [sortField, sortOrder] = sortType.split('_');
        LogInfo(`[Query Params] Field: ${sortField}, Order: ${sortOrder}`);
        if (sortOrder === 'asc') {
          sort[sortField] = 1;
        } else {
          sort[sortField] = -1;
        }
      }
      return await getAllKatas(page, limit, filter, sort);
    }
  }

  /**
   * Endpoint to delete Kata by ID
   * @param {string} id Kata ID to delete
   * @param {string} loggedUserId Logged User ID
   * @param {boolean} isAdmin Boolean specifying if user has admin role
   * @returns Object with response status and confirmation or error message
   */
  @Delete('/')
  public async deleteKata (
    @Query() id: string,
    @Inject() loggedUserId: string,
    @Inject() isAdmin: boolean): Promise<KatasResponse> {
    if (id) {
      LogWarning(`[/api/katas] Deleting Kata with ID ${id}`);
      return await deleteKataById(id, loggedUserId, isAdmin);
    } else {
      return {
        status: 404,
        message: 'Please, provide an ID to delete'
      };
    }
  }

  /**
   * Endpoint to create Kata
   * @param {Object} kata Kata object to create
   * @param {string} loggedUserId Logged User ID
   * @returns Object with status response and confirmation or error message
   */
  @Post('/')
  public async createKatas (
    @BodyProp('name') name: string,
    @BodyProp('description') description: string,
    @BodyProp('level') level: string,
    @Inject() creator: string,
    @BodyProp('language') language: string,
    @BodyProp('solution') solution: string
  ): Promise<KatasResponse> {
    LogSuccess('[/api/katas] Creating new kata');
    if (name && description && level && creator && language && solution) {
      return await createKata({
        name,
        description,
        level,
        intents: 0,
        stars: 0,
        creator,
        language,
        solution,
        participants: [],
        numValorations: 0,
        allValorations: 0
      });
    } else {
      return {
        status: 400,
        message: 'Please, complete all the fields for Kata'
      };
    }
  }

  /**
   * Endpoint to update Kata by ID
   * @param {string} kataId Kata ID to update
   * @param {string} loggedUserId Logged User ID
   * @param {boolean} isAdmin Boolean specifying if user has admin role
   * @param {Object} kata Kata object with data updated
   * @returns Object with response status and confirmation or error message
   */
  @Put('/')
  public async updateKatas (
    @Query() kataId: string,
    @Inject() loggedUserId: string,
    @Inject() isAdmin: boolean,
    @BodyProp('name') name: string,
    @BodyProp('description') description: string,
    @BodyProp('level') level: string,
    @BodyProp('language') language: string,
    @BodyProp('solution') solution: string
  ): Promise<KatasResponse> {
    if (kataId) {
      LogInfo(`[/api/katas] Updating kata with id ${kataId}`);
      return await updateKata(kataId, loggedUserId, isAdmin, {
        name, description, level, language, solution
      });
    } else {
      return {
        status: 400,
        message: 'Please, provide an ID and Kata Entity to update'
      };
    }
  }

  /**
   * Endpoint to vote for Kata by ID
   * @param {string} loggedUserId Logged User ID
   * @param {string} kataId Kata ID to vote
   * @param {number} valoration Valoration provided by User
   * @returns Object with response status and confirmation or error message
   */
  @Put('/vote')
  public async voteKatas (
    @Inject() loggedUserId: string,
    @Query() kataId: string,
    @BodyProp('valoration') valoration: number
  ): Promise<any> {
    if (kataId && valoration > 0) {
      LogInfo(`[/api/katas/vote] Voting for kata with id ${kataId}`);
      return await voteKata(loggedUserId, kataId, valoration);
    } else {
      return {
        status: 400,
        message: 'Please, provide ID and valoration for kata'
      };
    }
  }

  /**
   * Endpoint to solve Kata
   * @param {string} kataId Kata ID to solve
   * @param {string} loggedUserId Logged User ID
   * @returns Object with response status and confirmation or error message
   */
  @Put('/solve')
  public async solveKatas (
    @Query() kataId: string,
    @Inject() loggedUserId: string,
    @BodyProp('solution') solution: string
  ) {
    if (kataId && solution.length >= 10) {
      LogInfo(`[/api/katas/solve] Trying to solve kata with id ${kataId}`);
      // TODO: persist solution in db?
      return await solveKata(kataId, loggedUserId);
    } else {
      return {
        status: 400,
        message: 'Please, provide the kata ID and your solution'
      };
    }
  }
}
