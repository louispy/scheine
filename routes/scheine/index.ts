import { Router } from 'express';

import { ScheineController } from '../../controllers/scheine.controller';
import { AppContainer } from '../../interfaces/app.container';

const scheineRouter = (container: AppContainer): Router => {
  const router = Router();

  const scheineController = new ScheineController(container.scheineService);

  router
    .route('/scheine')
    .get(scheineController.getAll.bind(scheineController))
    .post(scheineController.create.bind(scheineController));

  return router;
};

export default scheineRouter;
