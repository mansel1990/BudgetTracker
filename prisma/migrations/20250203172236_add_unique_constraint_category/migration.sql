/*
  Warnings:

  - A unique constraint covering the columns `[group_id,name,type]` on the table `category` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `category_group_id_name_type_key` ON `category`(`group_id`, `name`, `type`);
