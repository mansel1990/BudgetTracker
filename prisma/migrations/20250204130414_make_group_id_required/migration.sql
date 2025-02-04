/*
  Warnings:

  - Made the column `group_id` on table `category` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `category` DROP FOREIGN KEY `category_group_id_fkey`;

-- AlterTable
ALTER TABLE `category` MODIFY `group_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `category` ADD CONSTRAINT `category_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `groups`(`group_id`) ON DELETE CASCADE ON UPDATE CASCADE;
