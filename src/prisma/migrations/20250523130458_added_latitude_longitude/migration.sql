/*
  Warnings:

  - You are about to drop the column `location` on the `captains` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `captains` DROP COLUMN `location`,
    ADD COLUMN `latitude` DOUBLE NULL,
    ADD COLUMN `longitude` DOUBLE NULL;
