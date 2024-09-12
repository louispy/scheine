import { validateOrReject } from 'class-validator';
import { Request, Response } from 'express';

import { ScheineFormPayload } from '../models/scheine.form.payload';
import { ScheineFormService } from '../services/scheine.form.service';
import { plainToInstance } from 'class-transformer';
import { handleAPIError } from '../lib/errors';

export class ScheineFormController {
  constructor(private readonly service: ScheineFormService) {}

  async create(req: Request, res: Response) {
    try {
      const payload = plainToInstance(ScheineFormPayload, req.body);

      await validateOrReject(payload);
      await this.service.create(payload);
      return res.status(201).json({ message: 'success' });
    } catch (error) {
      return handleAPIError(error, res);
    }
  }
}
