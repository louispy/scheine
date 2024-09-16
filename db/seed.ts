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
    name: 'Clint Eastwood',
    signature:
      'https://www.signwell.com/assets/vip-signatures/clint-eastwood-signature-e5a46a2363ef513d4fc0a45d8c0340943082ce60229084e3a12b82539321094b.png',
    created_at: now,
    updated_at: now,
  } as Doctor);

  const patientId = 'e9dc9232-34a8-4719-a408-483d8c53ba48';
  await patientRepo.insert({
    id: patientId,
    name: 'Erika',
    date_of_birth: '09-09-2009',
    insurance_number: 'i1234',
    cost_unit_identification: "CUI1234",
    establishment_number: "EN1234",
    status: "fully paid",
    postcode: "12345",
    place_of_residence: "Berlin",
    house_number: "12",
    account_holder: "Erika",
    iban: "1234567890",
    financial_institution: "MyInsurance",
    bic: "987654321",
    employed_at: "workplace",
    employer_address: "St. ABC 123",
    employment_termination_date: "2050-05-05",
    self_employed: true,
    unemployed: false,
    artist_publicist: false,
    signature:
      'https://www.signwell.com/assets/vip-signatures/clint-eastwood-signature-e5a46a2363ef513d4fc0a45d8c0340943082ce60229084e3a12b82539321094b.png',
    created_at: now,
    updated_at: now,
  } as Patient);

  console.log('Finished seeding');
};

seed();
