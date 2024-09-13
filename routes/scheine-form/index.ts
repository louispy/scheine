import { Router } from 'express';
import { AppDataSource } from '../../db/data-source';
import { ScheineFormService } from '../../services/scheine.form.service';
import { ScheineFormController } from '../../controllers/scheine.form.controller';
import { AppContainer } from '../../interfaces/app.container';

const scheineFormRouter = (container: AppContainer): Router => {
  const router = Router();

  const controller = new ScheineFormController(container.scheineFormService);

  router.route('/scheine-form').post(controller.create.bind(controller));

  return router;
};

export default scheineFormRouter;
