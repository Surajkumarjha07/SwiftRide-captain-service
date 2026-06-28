-- CreateEnum
CREATE TYPE "availability" AS ENUM ('AVAILABLE', 'UNAVAILABLE');

-- CreateEnum
CREATE TYPE "vehicles" AS ENUM ('bike', 'car', 'SUV');

-- CreateEnum
CREATE TYPE "vehicleVerified" AS ENUM ('VERIFIED', 'NOT_VERIFIED');

-- CreateTable
CREATE TABLE "captains" (
    "id" SERIAL NOT NULL,
    "captainId" TEXT,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "vehicle_type" "vehicles",
    "vehicle_number" TEXT,
    "vehicle_verified" "vehicleVerified" NOT NULL DEFAULT 'NOT_VERIFIED',
    "latitude" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "longitude" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "is_available" "availability" NOT NULL DEFAULT 'AVAILABLE',
    "total_earnings" DOUBLE PRECISION NOT NULL DEFAULT 0.00,

    CONSTRAINT "captains_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "captains_captainId_key" ON "captains"("captainId");

-- CreateIndex
CREATE UNIQUE INDEX "captains_email_key" ON "captains"("email");

-- CreateIndex
CREATE UNIQUE INDEX "captains_vehicle_number_key" ON "captains"("vehicle_number");

-- CreateIndex
CREATE INDEX "captains_latitude_longitude_idx" ON "captains"("latitude", "longitude");
