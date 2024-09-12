import { DataSource, EntityManager } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { ScheineForm } from '../entity/scheine.form.entity';
import { ScheineFormPayload } from '../models/scheine.form.payload';

export class ScheineFormService {
  constructor(private readonly dataSource: DataSource) {}

  async create(payload: ScheineFormPayload) {
    try {
      await this.dataSource.transaction(async (txManager) => {
        this.createField(payload, null, txManager);
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  private async createField(
    field: ScheineFormPayload,
    parent_id: string | null,
    txManager: EntityManager,
  ): Promise<void> {
    const now = new Date();
    const id = uuidv4();
    const sf = {
      id,
      data_type: field.data_type,
      parent_id,
      required: field.required,
      field: field.field,
      created_at: now,
      updated_at: now,
    } as ScheineForm;
    txManager.insert(ScheineForm, sf);

    if (
      field.data_type === 'object' &&
      field.children &&
      field.children.length
    ) {
      field.children.forEach((child) => {
        this.createField(child, id, txManager);
      });
    }
  }
}
