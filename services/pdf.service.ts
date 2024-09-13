import { AppError } from '../lib/errors';
import { PdfTemplate } from '../models/pdf.template';

export class PdfService {
  constructor(private readonly template: PdfTemplate) {}

  async generate(templateName: string, data: any): Promise<string> {
    if (!this.template[templateName]) {
      throw new AppError('Template Not Found', 500);
    }

    return this.template[templateName](data);
  }
}
