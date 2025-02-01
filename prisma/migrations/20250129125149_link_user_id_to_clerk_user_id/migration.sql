/*
  Warnings:

  - The primary key for the `month_history` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `year_history` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `category` MODIFY `user_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `month_history` DROP PRIMARY KEY,
    MODIFY `user_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`user_id`, `year`, `month`);

-- AlterTable
ALTER TABLE `transactions` MODIFY `user_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `year_history` DROP PRIMARY KEY,
    MODIFY `user_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`user_id`, `year`);

-- AddForeignKey
ALTER TABLE `category` ADD CONSTRAINT `category_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user_settings`(`clerk_user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `month_history` ADD CONSTRAINT `month_history_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user_settings`(`clerk_user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user_settings`(`clerk_user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `year_history` ADD CONSTRAINT `year_history_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user_settings`(`clerk_user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
