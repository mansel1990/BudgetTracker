/*
  Warnings:

  - You are about to drop the column `price` on the `trades` table. All the data in the column will be lost.
  - Added the required column `entry_price` to the `trades` table without a default value. This is not possible if the table is not empty.
  - Added the required column `exit_price` to the `trades` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profit_loss` to the `trades` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `accounts` ADD COLUMN `balance` DECIMAL(10, 2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `fund_transactions` ADD COLUMN `notes` TEXT NULL;

-- AlterTable
ALTER TABLE `trades` DROP COLUMN `price`,
    ADD COLUMN `entry_price` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `exit_price` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `notes` TEXT NULL,
    ADD COLUMN `profit_loss` DECIMAL(10, 2) NOT NULL;
