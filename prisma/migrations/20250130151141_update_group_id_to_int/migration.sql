/*
  Warnings:

  - You are about to alter the column `group_id` on the `category` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `groups` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `group_id` on the `groups` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `month_history` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `group_id` on the `month_history` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `group_id` on the `transactions` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `group_id` on the `user_settings` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `year_history` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `group_id` on the `year_history` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `category` DROP FOREIGN KEY `category_group_id_fkey`;

-- DropForeignKey
ALTER TABLE `month_history` DROP FOREIGN KEY `month_history_group_id_fkey`;

-- DropForeignKey
ALTER TABLE `transactions` DROP FOREIGN KEY `transactions_group_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_settings` DROP FOREIGN KEY `user_settings_group_id_fkey`;

-- DropForeignKey
ALTER TABLE `year_history` DROP FOREIGN KEY `year_history_group_id_fkey`;

-- DropIndex
DROP INDEX `category_group_id_fkey` ON `category`;

-- DropIndex
DROP INDEX `transactions_group_id_fkey` ON `transactions`;

-- DropIndex
DROP INDEX `user_settings_group_id_key` ON `user_settings`;

-- AlterTable
ALTER TABLE `category` MODIFY `group_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `groups` DROP PRIMARY KEY,
    MODIFY `group_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`group_id`);

-- AlterTable
ALTER TABLE `month_history` DROP PRIMARY KEY,
    MODIFY `group_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`group_id`, `year`, `month`);

-- AlterTable
ALTER TABLE `transactions` MODIFY `group_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user_settings` MODIFY `group_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `year_history` DROP PRIMARY KEY,
    MODIFY `group_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`group_id`, `year`);

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
