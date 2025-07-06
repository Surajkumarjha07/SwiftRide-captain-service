/*
  Warnings:

  - A unique constraint covering the columns `[vehicle_number]` on the table `captains` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `captains_vehicle_number_key` ON `captains`(`vehicle_number`);
