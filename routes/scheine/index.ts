import { Router } from 'express';

import { ScheineController } from '../../controllers/scheine.controller';
import { AppDataSource } from '../../db/data-source';
import { Doctor } from '../../entity/doctor.entity';
import { Patient } from '../../entity/patients.entity';
import { Scheine } from '../../entity/scheine.entity';
import { ScheineForm } from '../../entity/scheine.form.entity';
import { ScheineService } from '../../services/scheine.service';
import { PdfService } from '../../services/pdf.service';
import { generateMustersammlungDeEnPdf } from '../../template/templateFunc/mustersammlung.de.en.template';

const scheineRouter = (): Router => {
  const router = Router();

  const scheineRepository = AppDataSource.getRepository(Scheine);
  const scheineFormRepository = AppDataSource.getRepository(ScheineForm);
  const patientRepository = AppDataSource.getRepository(Patient);
  const doctorRepository = AppDataSource.getRepository(Doctor);

  const pdfTemplate = {
    'Mustersammlung.de.en': generateMustersammlungDeEnPdf,
  };
  const pdfService = new PdfService(pdfTemplate);
  const scheineService = new ScheineService(
    scheineRepository,
    patientRepository,
    doctorRepository,
    scheineFormRepository,
    pdfService,
  );
  const scheineController = new ScheineController(scheineService);

  router
    .route('/scheine')
    .get(scheineController.getAll.bind(scheineController))
    .post(scheineController.create.bind(scheineController));

  return router;
};

export default scheineRouter;
