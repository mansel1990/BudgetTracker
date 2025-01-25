/*
  Warnings:

  - A unique constraint covering the columns `[clerk_user_id]` on the table `user_settings` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `user_settings_clerk_user_id_key` ON `user_settings`(`clerk_user_id`);
