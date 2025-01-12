import * as _ from 'lodash';
import { Between, LessThan, MoreThanOrEqual, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { Doctor } from '../entity/doctor.entity';
import { Patient } from '../entity/patients.entity';
import { Scheine } from '../entity/scheine.entity';
import { ScheineForm } from '../entity/scheine.form.entity';
import { AppError } from '../lib/errors';
import {
  CreateScheinePayload,
  GetScheineQuery,
} from '../models/scheine.payload';
import { PdfService } from './pdf.service';

export class ScheineService {
  constructor(
    private readonly scheineRepository: Repository<Scheine>,
    private readonly patientRepository: Repository<Patient>,
    private readonly doctorRepository: Repository<Doctor>,
    private readonly scheineFormRepository: Repository<ScheineForm>,
    private readonly pdfService: PdfService,
  ) {}

  async getAll(query: GetScheineQuery) {
    try {
      const criteria: any = {};

      if (query.patient_id) {
        criteria.patient_id = query.patient_id;
      }
      if (query.doctor_id) {
        criteria.doctor_id = query.doctor_id;
      }

      if (query.start_date || query.end_date) {
        if (query.start_date && query.end_date) {
          const start = new Date(query.start_date);
          const end = new Date(query.end_date);
          criteria.date_of_issue = Between(start, end);
        } else if (query.start_date) {
          const start = new Date(query.start_date);
          criteria.date_of_issue = MoreThanOrEqual(start);
        } else if (query.end_date) {
          const end = new Date(query.end_date);
          criteria.date_of_issue = LessThan(end);
        }
      }

      const res = await this.scheineRepository.find({
        where: criteria,
        relations: ['patient', 'doctor'],
      });
      return res;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async create(payload: CreateScheinePayload) {
    try {
      const patient = await this.patientRepository.findOne({
        where: { id: payload.patient_id },
      });

      if (!patient) {
        throw new AppError('Patient not found', 404);
      }
      const doctor = await this.doctorRepository.findOne({
        where: { id: payload.doctor_id },
      });

      if (!doctor) {
        throw new AppError('Doctor not found', 404);
      }

      const criteria: any = { parent_id: null };
      if (payload.form_id) {
        criteria.form_id = payload.form_id;
      } else {
        criteria.field = payload.type;
      }

      const form = await this.scheineFormRepository.findOne({
        where: criteria,
      });

      if (!form) {
        throw new AppError('form not found', 404);
      }

      const data = payload.data;
      const errors: string[] = [];
      const queue = [[form.id, '']];
      while (queue.length) {
        const cur = queue.shift();
        if (!cur) continue;

        const [id, prefix] = cur;
        const fields = await this.scheineFormRepository.find({
          where: { parent_id: id },
        });

        fields.forEach((f) => {
          const key = prefix ? `${prefix}.${f.field}` : f.field;
          const toBeValidated = _.get(data, key);
          if (f.required && _.isNil(toBeValidated)) {
            errors.push(`${key} is required`);
          } else if (!_.isNil(toBeValidated) && typeof toBeValidated !== f.data_type) {
            errors.push(`${key}: invalid data type, should be ${f.data_type}`);
          } else if (typeof toBeValidated === 'string' && f.regex) {
            const re = new RegExp(f.regex);
            if (!re.test(toBeValidated)) {
              errors.push(
                `${key}: invalid format${
                  f.format_sample ? `, format sample: ${f.format_sample}` : ''
                }`,
              );
            }
          } else if (_.isObject(toBeValidated)) {
            queue.push([f.id, key]);
          }
        });

      }

      if (errors.length) {
        throw new AppError('One or more invalid fields are found', 400, errors);
      }

      const now = new Date();
      const id = uuidv4();
      await this.scheineRepository.insert({
        id,
        patient_id: patient.id,
        doctor_id: doctor.id,
        form_id: form.id,
        scheine_type: form.field,
        date_of_issue: _.get(data, 'date', now),
        data,
        created_at: now,
        updated_at: now,
      } as Scheine);

      const resData = {
        id,
        patient: {
          id: patient.id,
          name: patient.name,
          date_of_birth: patient.date_of_birth,
          insurance_number: patient.insurance_number,
          establishment_number: patient.establishment_number,
          status: patient.status,
          financial_institution: patient.financial_institution,
          cost_unit_identification: patient.cost_unit_identification,
        },
        doctor: {
          id: doctor.id,
          name: doctor.name,
          doctor_number: doctor.doctor_number,
          medical_practice_number: doctor.medical_practice_number,
          signature: doctor.signature,
        },
        created_at: _.get(data, 'date', now),
        data,
      };
      const pdf_base64 = await this.pdfService
        .generate(form.field, resData)
        .catch(() => '');

      return {
        ...resData,
        pdf_base64,
      };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getPreview(id: string): Promise<string> {
    try {
      const schein = await this.scheineRepository.findOne({
        where: { id },
        relations: ['patient', 'doctor'],
      });

      if (!schein) {
        throw new AppError('Schein not found', 404);
      }

      const pdf_base64 = await this.pdfService.generate(
        schein.scheine_type,
        schein,
      );

      return pdf_base64;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
