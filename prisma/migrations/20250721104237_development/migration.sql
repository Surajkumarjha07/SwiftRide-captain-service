-- CreateTable
CREATE TABLE `captains` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `captainId` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `vehicle_type` ENUM('bike', 'car', 'SUV') NULL,
    `vehicle_number` VARCHAR(191) NULL,
    `vehicle_verified` ENUM('VERIFIED', 'NOT_VERIFIED') NOT NULL DEFAULT 'NOT_VERIFIED',
    `latitude` DOUBLE NOT NULL DEFAULT 0.00,
    `longitude` DOUBLE NOT NULL DEFAULT 0.00,
    `is_available` ENUM('AVAILABLE', 'UNAVAILABLE') NOT NULL DEFAULT 'AVAILABLE',
    `total_earnings` DOUBLE NOT NULL DEFAULT 0.00,

    UNIQUE INDEX `captains_captainId_key`(`captainId`),
    UNIQUE INDEX `captains_email_key`(`email`),
    UNIQUE INDEX `captains_vehicle_number_key`(`vehicle_number`),
    INDEX `captains_latitude_longitude_idx`(`latitude`, `longitude`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
