-- Drop Tables if they exist (Reverse dependency order)
DROP TABLE IF EXISTS `AdminAction`;
DROP TABLE IF EXISTS `Payment`;
DROP TABLE IF EXISTS `LoanRepayment`;
DROP TABLE IF EXISTS `LoanApplication`;
DROP TABLE IF EXISTS `LoanProduct`;
DROP TABLE IF EXISTS `UserDocument`;
DROP TABLE IF EXISTS `User`;

-- Create User Table
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `dob` DATETIME(3) NULL,
    `address` TEXT NULL,
    `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create UserDocument Table
CREATE TABLE `UserDocument` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `documentType` VARCHAR(191) NOT NULL,
    `documentUrl` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'VERIFIED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `uploadedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create LoanProduct Table
CREATE TABLE `LoanProduct` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `interestRate` DECIMAL(65, 30) NOT NULL,
    `maxAmount` DECIMAL(65, 30) NOT NULL,
    `minAmount` DECIMAL(65, 30) NOT NULL,
    `tenureMonths` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create LoanApplication Table
CREATE TABLE `LoanApplication` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `amount` DECIMAL(65, 30) NOT NULL,
    `tenure` INTEGER NOT NULL,
    `interestRate` DECIMAL(65, 30) NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'DISBURSED', 'CLOSED') NOT NULL DEFAULT 'PENDING',
    `appliedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create LoanRepayment Table
CREATE TABLE `LoanRepayment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `loanId` INTEGER NOT NULL,
    `dueDate` DATETIME(3) NOT NULL,
    `amountDue` DECIMAL(65, 30) NOT NULL,
    `amountPaid` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `paymentStatus` ENUM('PENDING', 'PAID', 'LATE') NOT NULL DEFAULT 'PENDING',
    `paidAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create Payment Table
CREATE TABLE `Payment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `repaymentId` INTEGER NOT NULL,
    `transactionId` VARCHAR(191) NULL,
    `amount` DECIMAL(65, 30) NOT NULL,
    `method` ENUM('CARD', 'UPI', 'NETBANKING') NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'success',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create AdminAction Table
CREATE TABLE `AdminAction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `adminId` INTEGER NOT NULL,
    `loanId` INTEGER NULL,
    `action` ENUM('APPROVE', 'REJECT', 'VERIFY_DOCUMENT') NOT NULL,
    `note` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Add Foreign Keys
ALTER TABLE `UserDocument` ADD CONSTRAINT `UserDocument_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `LoanApplication` ADD CONSTRAINT `LoanApplication_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `LoanApplication` ADD CONSTRAINT `LoanApplication_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `LoanProduct`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `LoanRepayment` ADD CONSTRAINT `LoanRepayment_loanId_fkey` FOREIGN KEY (`loanId`) REFERENCES `LoanApplication`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `Payment` ADD CONSTRAINT `Payment_repaymentId_fkey` FOREIGN KEY (`repaymentId`) REFERENCES `LoanRepayment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `AdminAction` ADD CONSTRAINT `AdminAction_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `AdminAction` ADD CONSTRAINT `AdminAction_loanId_fkey` FOREIGN KEY (`loanId`) REFERENCES `LoanApplication`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
