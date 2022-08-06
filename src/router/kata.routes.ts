import express, { Request, Response } from 'express';
import { KataController } from '../controllers/kata.controllers';
import { verifyAdmin } from '../middlewares/verifyAdmin.middleware';
import verifyToken from '../middlewares/verifyToken.middleware';

const kataRouter = express.Router();
kataRouter.use(express.json());

kataRouter.route('/')
  // * Get Katas
  .get(verifyToken, async (req: Request, res: Response) => {
    const kataId: any = req?.query?.id;
    const loggedUserId: any = res.locals.userId;
    // Pagination
    const page: any = req?.query?.page || 1;
    const limit: any = req?.query?.limit || 10;
    // Filters
    const level: any = req?.query?.level;
    const language: any = req?.query?.language;
    // Sort
    const sortType: any = req?.query?.sortType;
    // Controller
    const controller: KataController = new KataController();
    const response = await controller.getKatas(loggedUserId, parseInt(page), parseInt(limit), kataId, level, language, sortType);
    return res.status(response.status).send(response);
  })

  // * Delete Kata by ID
  .delete(verifyToken, verifyAdmin, async (req: Request, res: Response) => {
    // Logged user ID
    const loggedUserId: string = res.locals.userId;
    const isAdmin: boolean = res.locals.isAdmin;
    // Query Params
    const id: any = req?.query?.id;
    const controller = new KataController();
    const response = await controller.deleteKata(id, loggedUserId, isAdmin);

    return res.status(response.status).send(response);
  })

  // * Create Kata
  .post(verifyToken, async (req: Request, res: Response) => {
    // User Id
    const loggedUserId: string = res.locals.userId;

    // Params por body
    const name: any = req?.body?.name;
    const description: any = req?.body?.description;
    const level: any = req?.body?.level;
    const language: any = req?.body?.language;
    const solution: any = req?.body?.solution;

    // Controller
    const controller: KataController = new KataController();
    const response = await controller.createKatas(
      name,
      description,
      level,
      loggedUserId,
      language,
      solution);
    return res.status(response.status).send(response);
  })

  // * Update Kata
  .put(verifyToken, async (req: Request, res: Response) => {
    const loggedUserId: string = res.locals.userId;
    const isAdmin: boolean = res.locals.isAdmin;
    // Query Params
    const kataId: any = req?.query?.id;
    // Params por body
    const { name, description, level, language, solution } = req?.body;

    const controller: KataController = new KataController();
    const response = await controller.updateKatas(
      kataId,
      loggedUserId,
      isAdmin,
      name,
      description,
      level,
      language,
      solution
    );
    return res.status(response.status).send(response);
  });

// * Vote Kata
kataRouter.route('/vote')
  .put(verifyToken, async (req: Request, res: Response) => {
    const kataId: any = req?.query?.id;
    const loggedUserId: any = res.locals.userId;
    const valoration: any = req?.body?.valoration;

    const controller: KataController = new KataController();
    const response = await controller.voteKatas(loggedUserId, kataId, valoration);
    return res.status(response.status).send(response);
  });

// * Solve Kata
kataRouter.route('/solve')
  .put(verifyToken, async (req: Request, res: Response) => {
    const loggedUserId: any = res.locals.userId;
    const kataId: any = req?.query?.id;
    const solution: any = req?.body?.solution;

    const controller: KataController = new KataController();
    const response = await controller.solveKatas(kataId, loggedUserId, solution);
    return res.status(response.status).send(response);
  });
export default kataRouter;
