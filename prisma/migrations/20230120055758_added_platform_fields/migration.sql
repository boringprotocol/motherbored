-- AlterTable
ALTER TABLE `Peer` ADD COLUMN `consumer_platform` VARCHAR(191) NULL,
    ADD COLUMN `provider_platform` VARCHAR(191) NULL;
