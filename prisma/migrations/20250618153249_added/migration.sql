/*
  Warnings:

  - You are about to drop the column `is_vehicle_verified` on the `captains` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `captains` DROP COLUMN `is_vehicle_verified`,
    ADD COLUMN `vehicle_verified` BOOLEAN NOT NULL DEFAULT false;
