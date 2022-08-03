import { Body, Delete, Get, Inject, Post, Put, Query, Route, Tags } from 'tsoa';
import { getKataById, createKata, deleteKataById, getAllKatas, solveKata, updateKata, voteKata } from '../database/kata.odm';
import { LogInfo, LogSuccess } from '../utils/Logger';
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
    @Query() page?: number,
    @Query() limit?: number,
    @Query() kataId?: string,
    @Query() filter?: any,
    @Query() sortType?: string): Promise<any> {
    if (kataId) {
      LogSuccess(`[/api/katas] Getting Kata with ID ${kataId}`);
      return await getKataById(kataId, loggedUserId);
    } else {
      LogSuccess('[/api/katas] Getting Katas');
      return await getAllKatas(page!, limit!, filter, sortType);
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
    @Inject() isAdmin: boolean): Promise<any> {
    LogSuccess(`[/api/katas] Deleting Kata with ID ${id}`);
    return await deleteKataById(id, loggedUserId, isAdmin);
  }

  /**
   * Endpoint to create Kata
   * @param {Object} kata Kata object to create
   * @param {string} loggedUserId Logged User ID
   * @returns Object with status response and confirmation or error message
   */
  @Post('/')
  public async createKatas (@Body() kata: any, @Inject() loggedUserId: string): Promise<any> {
    LogSuccess('[/api/katas] Creating new kata');
    return await createKata(kata, loggedUserId);
  }

  /**
   * Endpoint to update Kata by ID
   * @param {string} id Kata ID to update
   * @param {string} loggedUserId Logged User ID
   * @param {boolean} isAdmin Boolean specifying if user has admin role
   * @param {Object} kata Kata object with data updated
   * @returns Object with response status and confirmation or error message
   */
  @Put('/')
  public async updateKatas (@Query() id: string,
    @Inject() loggedUserId: string,
    @Inject() isAdmin: boolean,
    @Query() kata: any): Promise<any> {
    LogInfo(`[/api/katas] Updating kata with id ${id}`);
    return await updateKata(id, loggedUserId, isAdmin, kata);
  }

  /**
   * Endpoint to vote for Kata by ID
   * @param {string} loggedUserId Logged User ID
   * @param {string} id Kata ID to vote
   * @param {number} valoration Valoration provided by User
   * @returns Object with response status and confirmation or error message
   */
  @Put('/vote')
  public async voteKatas (@Inject() loggedUserId: string, @Query() id: string, @Body() valoration: number): Promise<any> {
    LogSuccess(`[/api/katas/vote] Voting for kata with id ${id}`);
    return await voteKata(loggedUserId, id, valoration);
  }

  /**
   * Endpoint to solve Kata
   * @param {string} kataId Kata ID to solve
   * @param {string} loggedUserId Logged User ID
   * @returns Object with response status and confirmation or error message
   */
  @Put('/solve')
  public async solveKatas (@Query() kataId: string, @Inject() loggedUserId: string) {
    LogInfo(`[/api/katas/solve] Trying to solve kata with id ${kataId}`);
    return await solveKata(kataId, loggedUserId);
  }
}
