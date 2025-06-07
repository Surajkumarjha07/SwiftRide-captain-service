-- AlterTable
ALTER TABLE `captains` MODIFY `latitude` DOUBLE NULL DEFAULT 0.00,
    MODIFY `longitude` DOUBLE NULL DEFAULT 0.00;

-- CreateIndex
CREATE INDEX `captains_latitude_longitude_idx` ON `captains`(`latitude`, `longitude`);
