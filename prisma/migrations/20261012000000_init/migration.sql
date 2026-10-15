-- CreateEnum
CREATE TYPE "consent_type" AS ENUM ('TERMS', 'HEALTH_DATA', 'AI', 'RESEARCH');

-- CreateEnum
CREATE TYPE "severity" AS ENUM ('MILD', 'MODERATE', 'SEVERE');

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "display_name" VARCHAR(80) NOT NULL,
    "time_zone" VARCHAR(64) NOT NULL,
    "country_code" CHAR(2),
    "period_tracking_enabled" BOOLEAN NOT NULL DEFAULT false,
    "age_confirmed_at" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consent_records" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "type" "consent_type" NOT NULL,
    "version" VARCHAR(32) NOT NULL,
    "granted" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consent_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "symptom_types" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "slug" VARCHAR(64) NOT NULL,
    "label" VARCHAR(80) NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "use_in_check_in" BOOLEAN NOT NULL DEFAULT true,
    "use_in_periods" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "symptom_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "check_ins" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "mood" SMALLINT NOT NULL,
    "energy" SMALLINT NOT NULL,
    "sleep_minutes" SMALLINT,
    "sleep_quality" SMALLINT,
    "stress" SMALLINT NOT NULL,
    "note" VARCHAR(500),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "check_ins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "check_in_symptoms" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "check_in_id" UUID NOT NULL,
    "symptom_type_id" UUID NOT NULL,
    "severity" "severity" NOT NULL,
    "custom_label" VARCHAR(60),

    CONSTRAINT "check_in_symptoms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rate_limit_hits" (
    "key" VARCHAR(200) NOT NULL,
    "window_start" TIMESTAMPTZ(6) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "rate_limit_hits_pkey" PRIMARY KEY ("key","window_start")
);

-- CreateIndex
CREATE INDEX "consent_records_user_id_type_created_at_idx" ON "consent_records"("user_id", "type", "created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "symptom_types_slug_key" ON "symptom_types"("slug");

-- CreateIndex
CREATE INDEX "check_ins_user_id_date_idx" ON "check_ins"("user_id", "date" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "check_ins_user_id_date_key" ON "check_ins"("user_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "check_in_symptoms_check_in_id_symptom_type_id_key" ON "check_in_symptoms"("check_in_id", "symptom_type_id");

-- CreateIndex
CREATE INDEX "rate_limit_hits_window_start_idx" ON "rate_limit_hits"("window_start");

-- AddForeignKey
ALTER TABLE "consent_records" ADD CONSTRAINT "consent_records_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_in_symptoms" ADD CONSTRAINT "check_in_symptoms_check_in_id_fkey" FOREIGN KEY ("check_in_id") REFERENCES "check_ins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_in_symptoms" ADD CONSTRAINT "check_in_symptoms_symptom_type_id_fkey" FOREIGN KEY ("symptom_type_id") REFERENCES "symptom_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
