-- AlterTable
ALTER TABLE `Peer` ADD COLUMN `channel` INTEGER NULL,
    ADD COLUMN `country_code` VARCHAR(191) NULL,
    ADD COLUMN `hw_mode` VARCHAR(191) NULL,
    ADD COLUMN `wifi_preference` VARCHAR(191) NULL,
    ADD COLUMN `wpa_passphrase` VARCHAR(191) NULL;
