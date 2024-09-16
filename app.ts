import { AppDataSource } from './db/data-source';
import { Doctor } from './entity/doctor.entity';
import { Patient } from './entity/patients.entity';
import { Scheine } from './entity/scheine.entity';
import { ScheineForm } from './entity/scheine.form.entity';
import { AppContainer } from './interfaces/app.container';
import { PdfService } from './services/pdf.service';
import { ScheineFormService } from './services/scheine.form.service';
import { ScheineService } from './services/scheine.service';
import { generateMustersammlungDeEnPdf } from './template/templateFunc/mustersammlung.de.en.template';
import { generateVerordnung_einer_krankenbeforderungdeenPdf } from './template/templateFunc/Verordnung_einer_krankenbeforderung.de.en';

export const getContainer = (): AppContainer => {
  const scheineRepository = AppDataSource.getRepository(Scheine);
  const scheineFormRepository = AppDataSource.getRepository(ScheineForm);
  const patientRepository = AppDataSource.getRepository(Patient);
  const doctorRepository = AppDataSource.getRepository(Doctor);
  const scheineFormService = new ScheineFormService(AppDataSource);

  const pdfTemplate = {
    'Mustersammlung.de.en': generateMustersammlungDeEnPdf,
    'Verordnung_einer_krankenbeforderung.de.en':
      generateVerordnung_einer_krankenbeforderungdeenPdf,
  };
  const pdfService = new PdfService(pdfTemplate);
  const scheineService = new ScheineService(
    scheineRepository,
    patientRepository,
    doctorRepository,
    scheineFormRepository,
    pdfService,
  );

  return {
    pdfService,
    scheineService,
    scheineFormService,
  } as AppContainer;
};
