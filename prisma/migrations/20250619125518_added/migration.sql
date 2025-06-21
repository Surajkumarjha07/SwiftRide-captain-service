/*
  Warnings:

  - You are about to alter the column `vehicle_verified` on the `captains` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `captains` MODIFY `vehicle_verified` ENUM('VERIFIED', 'NOT_VERIFIED') NOT NULL DEFAULT 'NOT_VERIFIED';
