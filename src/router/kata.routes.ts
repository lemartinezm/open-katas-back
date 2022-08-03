import express, { Request, Response } from 'express';
import { KataController } from '../controllers/kata.controllers';
import verifyToken from '../middlewares/verifyToken.middleware';
import { LogInfo } from '../utils/Logger';

const kataRouter = express.Router();
kataRouter.use(express.json());

kataRouter.route('/')
  // * Get Katas
  .get(verifyToken, async (req: Request, res: Response) => {
    const id: any = req?.query?.id;
    const loggedUserId: any = res.locals.userId;
    // Filters
    const filter: any = {};
    const level: any = req?.query?.level;
    const language: any = req?.query?.language;
    if (level) {
      filter.level = level;
      LogInfo(`[Query Params]: level ${level}`);
    }
    if (language) {
      filter.language = language;
      LogInfo(`[Query Params]: language ${language}`);
    }
    // Sorts
    const sortType: any = req?.query?.sortType;
    const sort: any = {};
    // Example of sortType: level_asc
    if (sortType) {
      const [sortField, sortOrder] = sortType.split('_');
      LogInfo(`[Query Params] Field: ${sortField}, Order: ${sortOrder}`);
      if (sortOrder === 'asc') {
        sort[sortField] = 1;
      } else {
        sort[sortField] = -1;
      }
    }
    // Pagination
    const page: any = req?.query?.page || 1;
    const limit: any = req?.query?.limit || 10;
    // Controller
    const controller: KataController = new KataController();
    const response = await controller.getKatas(loggedUserId, page, limit, id, filter, sort);
    return res.status(response.status).send(response);
  })

  // * Delete Kata by ID
  .delete(verifyToken, async (req: Request, res: Response) => {
    // Logged user ID
    const loggedUserId: string = res.locals.userId;
    const isAdmin: boolean = res.locals.isAdmin;
    // Query Params
    const id: any = req?.query?.id;
    if (id) {
      const controller = new KataController();
      const response = await controller.deleteKata(id, loggedUserId, isAdmin);
      return res.status(response.status).send(response);
    } else {
      return res.status(400).send({
        message: 'Please, provide an ID to delete'
      });
    }
  })

  // * Create Kata
  .post(verifyToken, async (req: Request, res: Response) => {
    // User Id
    const loggedUserId: string = res.locals.userId;

    // Params por body
    const name: any = req?.body?.name;
    const description: any = req?.body?.description;
    const level: any = req?.body?.level;
    const intents: any = req?.body?.intents || 0;
    // const stars: any = req?.body?.stars || 0
    const creator: any = res.locals.userId;
    const language: any = req?.body?.language;
    const solution: any = req?.body?.solution;
    const participants: any = req?.body?.participants || [];

    // Se ejecuta solo si tiene todos los campos llenos
    if (name && description && level && intents >= 0 && creator && language && solution && participants.length >= 0) {
      // Controller
      const controller: KataController = new KataController();
      const response = await controller.createKatas({
        name,
        description,
        level,
        intents,
        stars: 0,
        creator: {
          creatorId: creator,
          creatorName: ''
        },
        language,
        solution,
        participants,
        numValorations: 0,
        allValorations: 0
      }, loggedUserId);
      return res.status(response.status).send(response);
    } else {
      return res.status(400).send({
        message: 'Please, complete all the fields for Kata'
      });
    }
  })

  // * Update Kata
  .put(verifyToken, async (req: Request, res: Response) => {
    const loggedUserId: string = res.locals.userId;
    const isAdmin: boolean = res.locals.isAdmin;
    // Query Params
    const id: any = req?.query?.id;
    // Params por body
    const name: any = req?.body?.name;
    const description: any = req?.body?.description;
    const level: any = req?.body?.level;
    const intents: any = req?.body?.intents;
    const stars: any = req?.body?.stars;
    const language: any = req?.body?.language;
    const solution: any = req?.body?.solution;
    const participants: any = req?.body?.participants;

    if (id) {
      const controller: KataController = new KataController();
      const response = await controller.updateKatas(id, loggedUserId, isAdmin, {
        name,
        description,
        level,
        intents,
        stars,
        language,
        solution,
        participants
      });
      return res.status(response.status).send(response);
    } else {
      return res.status(400).send({
        message: 'Please, provide an ID and Kata Entity to update'
      });
    }
  });

// * Vote Kata
kataRouter.route('/vote')
  .put(verifyToken, async (req: Request, res: Response) => {
    const kataId: any = req?.query?.id;
    const loggedUserId: any = res.locals.userId;
    const valoration: any = req?.body?.valoration;
    if (kataId && valoration > 0) {
      const controller: KataController = new KataController();
      const response = await controller.voteKatas(loggedUserId, kataId, valoration);
      return res.status(response.status).send(response);
    } else {
      return res.send({
        message: 'Please, provide ID and valoration for kata'
      });
    }
  });

// * Solve Kata
kataRouter.route('/solve')
  .put(verifyToken, async (req: Request, res: Response) => {
    const loggedUserId: any = res.locals.userId;
    // ID de la kata por Query Param
    const kataId: any = req?.query?.id;
    // Obtener la solución del body
    // TODO: podría persistir la solución en DB
    const solution: any = req?.body?.solution;
    console.log('### Solution', solution);
    let response: any = {};
    if (kataId && solution.length >= 10) {
      // Controlador
      const controller: KataController = new KataController();
      response = await controller.solveKatas(kataId, loggedUserId);
    } else {
      response.status = 400;
      response.message = 'Please, provide the kata ID and your solution';
    }
    return res.status(response.status).send(response);
  });
export default kataRouter;
