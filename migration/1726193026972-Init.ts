import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1726193026972 implements MigrationInterface {
    name = 'Init1726193026972'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "patient" ("id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL, "name" character varying NOT NULL, "date_of_birth" date NOT NULL, "insurance_number" character varying NOT NULL, CONSTRAINT "PK_8dfa510bb29ad31ab2139fbfb99" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "doctor" ("id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL, "name" character varying NOT NULL, "doctor_number" character varying NOT NULL, "signature" character varying NOT NULL, "medical_practice_number" character varying NOT NULL, CONSTRAINT "PK_ee6bf6c8de78803212c548fcb94" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "scheine" ("id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL, "scheine_type" character varying NOT NULL, "form_id" uuid, "patient_id" uuid NOT NULL, "doctor_id" uuid NOT NULL, "data" json NOT NULL, CONSTRAINT "PK_a6d08effa21fa1d7e3c3f8fd037" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "scheine_form" ("id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL, "parent_id" uuid, "data_type" character varying NOT NULL, "field" character varying NOT NULL, "required" boolean NOT NULL, "regex" character varying, "format_sample" character varying, CONSTRAINT "PK_44a5d95a033332e6ad6a9abf646" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "scheine" ADD CONSTRAINT "FK_a068744b10e1d98a29e3816bc28" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheine" ADD CONSTRAINT "FK_86f986b2f5131595753c047c479" FOREIGN KEY ("doctor_id") REFERENCES "doctor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scheine" DROP CONSTRAINT "FK_86f986b2f5131595753c047c479"`);
        await queryRunner.query(`ALTER TABLE "scheine" DROP CONSTRAINT "FK_a068744b10e1d98a29e3816bc28"`);
        await queryRunner.query(`DROP TABLE "scheine_form"`);
        await queryRunner.query(`DROP TABLE "scheine"`);
        await queryRunner.query(`DROP TABLE "doctor"`);
        await queryRunner.query(`DROP TABLE "patient"`);
    }

}
