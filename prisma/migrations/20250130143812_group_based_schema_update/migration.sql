/*
  Warnings:

  - You are about to drop the column `user_id` on the `category` table. All the data in the column will be lost.
  - The primary key for the `groups` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `month_history` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user_id` on the `month_history` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `transactions` table. All the data in the column will be lost.
  - The primary key for the `year_history` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user_id` on the `year_history` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[group_id]` on the table `user_settings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `group_id` to the `category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by` to the `groups` table without a default value. This is not possible if the table is not empty.
  - Added the required column `group_id` to the `month_history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `group_id` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Made the column `group_id` on table `user_settings` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `group_id` to the `year_history` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `category` DROP FOREIGN KEY `category_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `month_history` DROP FOREIGN KEY `month_history_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `transactions` DROP FOREIGN KEY `transactions_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `year_history` DROP FOREIGN KEY `year_history_user_id_fkey`;

-- DropIndex
DROP INDEX `category_user_id_fkey` ON `category`;

-- DropIndex
DROP INDEX `transactions_user_id_fkey` ON `transactions`;

-- AlterTable
ALTER TABLE `category` DROP COLUMN `user_id`,
    ADD COLUMN `group_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `groups` DROP PRIMARY KEY,
    ADD COLUMN `created_by` INTEGER NOT NULL,
    MODIFY `group_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`group_id`);

-- AlterTable
ALTER TABLE `month_history` DROP PRIMARY KEY,
    DROP COLUMN `user_id`,
    ADD COLUMN `group_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`group_id`, `year`, `month`);

-- AlterTable
ALTER TABLE `transactions` DROP COLUMN `user_id`,
    ADD COLUMN `group_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user_settings` MODIFY `group_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `year_history` DROP PRIMARY KEY,
    DROP COLUMN `user_id`,
    ADD COLUMN `group_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`group_id`, `year`);

-- CreateIndex
CREATE UNIQUE INDEX `user_settings_group_id_key` ON `user_settings`(`group_id`);

-- AddForeignKey
ALTER TABLE `user_settings` ADD CONSTRAINT `user_settings_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `groups`(`group_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `category` ADD CONSTRAINT `category_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `groups`(`group_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `month_history` ADD CONSTRAINT `month_history_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `groups`(`group_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `groups`(`group_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `year_history` ADD CONSTRAINT `year_history_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `groups`(`group_id`) ON DELETE CASCADE ON UPDATE CASCADE;
