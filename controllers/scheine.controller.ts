import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { Request, Response } from 'express';

import { handleAPIError } from '../lib/errors';
import { CreateScheinePayload } from '../models/scheine.payload';
import { ScheineService } from '../services/scheine.service';

export class ScheineController {
  constructor(private readonly scheineService: ScheineService) {}

  async getAll(req: Request, res: Response) {
    try {
      const data = await this.scheineService.getAll();

      return res.json({ data });
    } catch (error) {
      return handleAPIError(error, res);
    }
  }

  async create(req: Request, res: Response) {
    try {
      const payload = plainToInstance(CreateScheinePayload, req.body);
      await validateOrReject(payload);
      const data = await this.scheineService.create(payload);

      return res.json({ data });
    } catch (error) {
      return handleAPIError(error, res);
    }
  }
}
