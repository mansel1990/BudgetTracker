/*
  Warnings:

  - You are about to drop the column `balance` on the `accounts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `accounts` DROP COLUMN `balance`;

-- AlterTable
ALTER TABLE `fund_transactions` ADD COLUMN `amount_in_market` DECIMAL(10, 2) NULL;
