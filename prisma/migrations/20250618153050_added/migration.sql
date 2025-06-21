/*
  Warnings:

  - You are about to drop the column `Vehicle_number` on the `captains` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `captains` DROP COLUMN `Vehicle_number`,
    ADD COLUMN `vehicle_number` VARCHAR(191) NULL;
