/*
  Warnings:

  - Added the required column `clerk_user_id` to the `user_settings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user_settings` ADD COLUMN `clerk_user_id` VARCHAR(191) NOT NULL;
