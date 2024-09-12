import { Router } from 'express';
import { AppDataSource } from '../../db/data-source';
import { ScheineFormService } from '../../services/scheine.form.service';
import { ScheineFormController } from '../../controllers/scheine.form.controller';

const scheineFormRouter = (): Router => {
  const router = Router();

  const service = new ScheineFormService(AppDataSource);
  const controller = new ScheineFormController(service);

  router.route('/scheine-form').post(controller.create.bind(controller));

  return router;
};

export default scheineFormRouter;
