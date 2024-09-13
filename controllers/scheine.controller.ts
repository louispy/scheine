import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { Request, Response } from 'express';

import { handleAPIError } from '../lib/errors';
import {
  CreateScheinePayload,
  GetScheineQuery,
} from '../models/scheine.payload';
import { ScheineService } from '../services/scheine.service';

export class ScheineController {
  constructor(private readonly scheineService: ScheineService) {}

  async getAll(req: Request, res: Response) {
    try {
      const query = plainToInstance(GetScheineQuery, req.query);
      await validateOrReject(query);
      const data = await this.scheineService.getAll(query);

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

  async getPreview(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const data = await this.scheineService.getPreview(id);
      return res.send(data);
    } catch (error) {
      return handleAPIError(error, res);
    }
  }
}
