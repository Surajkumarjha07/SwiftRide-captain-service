/*
  Warnings:

  - You are about to drop the column `isAvailable` on the `captains` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `captains` DROP COLUMN `isAvailable`,
    ADD COLUMN `Vehicle_number` VARCHAR(191) NULL,
    ADD COLUMN `is_available` ENUM('AVAILABLE', 'UNAVAILABLE') NOT NULL DEFAULT 'AVAILABLE',
    ADD COLUMN `is_vehicle_verified` BOOLEAN NULL,
    ADD COLUMN `vehicle_type` ENUM('bike', 'car', 'SUV') NULL;
