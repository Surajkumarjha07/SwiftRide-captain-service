/*
  Warnings:

  - A unique constraint covering the columns `[captainId]` on the table `captains` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `captains` ADD COLUMN `captainId` VARCHAR(191) NULL,
    ADD COLUMN `isAvailable` ENUM('available', 'unAvailable') NOT NULL DEFAULT 'available';

-- CreateIndex
CREATE UNIQUE INDEX `captains_captainId_key` ON `captains`(`captainId`);
