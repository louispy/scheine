import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1726030477502 implements MigrationInterface {
    name = 'Init1726030477502'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "scheine" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL, "name" character varying NOT NULL, "patient_id" uuid NOT NULL, "doctor_id" uuid NOT NULL, CONSTRAINT "PK_a6d08effa21fa1d7e3c3f8fd037" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "doctor" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL, "name" character varying NOT NULL, "doctor_number" character varying NOT NULL, "signature" character varying NOT NULL, "medical_practice_number" character varying NOT NULL, CONSTRAINT "PK_ee6bf6c8de78803212c548fcb94" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "scheine_form" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL, "scheine_type" character varying, "parent_id" uuid, "field" character varying NOT NULL, "data_type" character varying NOT NULL, "required" boolean NOT NULL, CONSTRAINT "PK_44a5d95a033332e6ad6a9abf646" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "patient" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL, "name" character varying NOT NULL, "date_of_birth" date NOT NULL, "insurance_number" character varying NOT NULL, CONSTRAINT "PK_8dfa510bb29ad31ab2139fbfb99" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "patient"`);
        await queryRunner.query(`DROP TABLE "scheine_form"`);
        await queryRunner.query(`DROP TABLE "doctor"`);
        await queryRunner.query(`DROP TABLE "scheine"`);
    }

}
