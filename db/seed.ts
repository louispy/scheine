import { Doctor } from '../entity/doctor.entity';
import { Patient } from '../entity/patients.entity';
import { AppDataSource } from './data-source';

const seed = async () => {
  await AppDataSource.initialize();

  const doctorRepo = AppDataSource.getRepository(Doctor);
  const patientRepo = AppDataSource.getRepository(Patient);

  console.log('Seeding...');
  const now = new Date();
  const doctorId = '56a58120-697b-4181-831d-d0d78701ad2a';
  await doctorRepo.insert({
    id: doctorId,
    doctor_number: 'd1234',
    medical_practice_number: 'mp1234',
    name: 'M Ali',
    signature:
      'https://www.signwell.com/assets/vip-signatures/muhammad-ali-signature-3f9237f6fc48c3a04ba083117948e16ee7968aae521ae4ccebdfb8f22596ad22.svg',
    created_at: now,
    updated_at: now,
  } as Doctor);

  const patientId = 'e9dc9232-34a8-4719-a408-483d8c53ba48';
  await patientRepo.insert({
    id: patientId,
    name: 'Erika',
    date_of_birth: '09-09-2009',
    insurance_number: 'i1234',
    created_at: now,
    updated_at: now,
  } as Patient);

  console.log('Finished seeding');
};

seed();
