/*
  Warnings:

  - You are about to alter the column `isAvailable` on the `captains` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `captains` MODIFY `isAvailable` ENUM('AVAILABLE', 'UNAVAILABLE') NOT NULL DEFAULT 'AVAILABLE';
