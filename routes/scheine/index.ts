import { Router } from 'express';

import { ScheineController } from '../../controllers/scheine.controller';
import { AppDataSource } from '../../db/data-source';
import { Doctor } from '../../entity/doctor.entity';
import { Patient } from '../../entity/patients.entity';
import { Scheine } from '../../entity/scheine.entity';
import { ScheineForm } from '../../entity/scheine.form.entity';
import { ScheineService } from '../../services/scheine.service';

const scheineRouter = (): Router => {
  const router = Router();

  const scheineRepository = AppDataSource.getRepository(Scheine);
  const scheineFormRepository = AppDataSource.getRepository(ScheineForm);
  const patientRepository = AppDataSource.getRepository(Patient);
  const doctorRepository = AppDataSource.getRepository(Doctor);
  const scheineService = new ScheineService(
    scheineRepository,
    patientRepository,
    doctorRepository,
    scheineFormRepository,
  );
  const scheineController = new ScheineController(scheineService);

  router
    .route('/scheine')
    .get(scheineController.getAll.bind(scheineController))
    .post(scheineController.create.bind(scheineController));

  return router;
};

export default scheineRouter;
