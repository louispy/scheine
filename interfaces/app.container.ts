import { PdfService } from '../services/pdf.service';
import { ScheineFormService } from '../services/scheine.form.service';
import { ScheineService } from '../services/scheine.service';

export interface AppContainer {
  scheineFormService: ScheineFormService;
  scheineService: ScheineService;
  pdfService: PdfService;
}
