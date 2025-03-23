/*
  Warnings:

  - You are about to drop the column `entry_price` on the `trades` table. All the data in the column will be lost.
  - You are about to drop the column `exit_price` on the `trades` table. All the data in the column will be lost.
  - You are about to drop the column `symbol` on the `trades` table. All the data in the column will be lost.
  - Added the required column `company_name` to the `trades` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `accounts` ADD COLUMN `is_admin` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `trades` DROP COLUMN `entry_price`,
    DROP COLUMN `exit_price`,
    DROP COLUMN `symbol`,
    ADD COLUMN `company_name` VARCHAR(255) NOT NULL,
    ADD COLUMN `company_symbol` VARCHAR(10) NULL,
    ADD COLUMN `price` DECIMAL(10, 2) NULL;

-- CreateTable
CREATE TABLE `tradeSignalAccess` (
    `access_id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `status` VARCHAR(10) NOT NULL DEFAULT 'pending',
    `expires_at` DATETIME(3) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `tradeSignalAccess_userId_key`(`userId`),
    PRIMARY KEY (`access_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `company_analysis` (
    `company_name` VARCHAR(255) NOT NULL,
    `current_market_price` DECIMAL(18, 2) NULL,
    `company_screener` VARCHAR(200) NULL,
    `median_pe` DECIMAL(10, 2) NULL,
    `pe` DECIMAL(10, 2) NULL,
    `company_symbol` VARCHAR(50) NULL,
    `company_peers` JSON NULL,
    `sector` VARCHAR(100) NULL,
    `industry` VARCHAR(100) NULL,
    `pe_score` DECIMAL(10, 2) NULL,
    `peg_score` DECIMAL(10, 2) NULL,
    `peg_ranking` INTEGER NULL,
    `de_score` DECIMAL(10, 2) NULL,
    `de_ranking` INTEGER NULL,
    `piotroski` INTEGER NULL,
    `piotroski_rank` INTEGER NULL,
    `piotroski_score` DECIMAL(10, 2) NULL,
    `daily_filter_score` DECIMAL(10, 2) NULL,
    `sales_growth` VARCHAR(300) NULL,
    `sales_rank` VARCHAR(300) NULL,
    `sales_score` DECIMAL(10, 2) NULL,
    `sales_filter_score` DECIMAL(10, 2) NULL,
    `profit_growth` VARCHAR(300) NULL,
    `profit_rank` VARCHAR(300) NULL,
    `profit_score` DECIMAL(10, 2) NULL,
    `profit_filter_score` DECIMAL(10, 2) NULL,
    `roe_10y` DECIMAL(10, 2) NULL,
    `roe_5y` DECIMAL(10, 2) NULL,
    `roe_3y` DECIMAL(10, 2) NULL,
    `roe_1y` DECIMAL(10, 2) NULL,
    `roe_rank_10y` INTEGER NULL,
    `roe_rank_5y` INTEGER NULL,
    `roe_rank_3y` INTEGER NULL,
    `roe_rank_1y` INTEGER NULL,
    `score` DECIMAL(10, 2) NULL,
    `filter_count` INTEGER NULL,
    `total_ranks` INTEGER NULL,
    `last_updated` DATETIME(0) NULL,
    `Total_Filter_Score` DECIMAL(10, 2) NULL,
    `sum_score` DECIMAL(10, 2) NULL,
    `final_score` DECIMAL(10, 2) NULL,
    `target_price` DECIMAL(18, 2) NULL,
    `Indicator` ENUM('Buy/Hold', 'Sell') NULL,
    `SellPrice` DECIMAL(18, 2) NULL,

    PRIMARY KEY (`company_name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tradeSignalAccess` ADD CONSTRAINT `tradeSignalAccess_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `accounts`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;
