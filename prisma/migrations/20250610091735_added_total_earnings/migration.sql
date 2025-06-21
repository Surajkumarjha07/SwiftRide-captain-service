/*
  Warnings:

  - Made the column `latitude` on table `captains` required. This step will fail if there are existing NULL values in that column.
  - Made the column `longitude` on table `captains` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `captains` ADD COLUMN `total_earnings` DOUBLE NOT NULL DEFAULT 0.00,
    MODIFY `latitude` DOUBLE NOT NULL DEFAULT 0.00,
    MODIFY `longitude` DOUBLE NOT NULL DEFAULT 0.00;
