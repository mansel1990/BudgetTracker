/*
  Warnings:

  - The primary key for the `month_history` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `year_history` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `day` on table `month_history` required. This step will fail if there are existing NULL values in that column.
  - Made the column `month` on table `year_history` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `month_history` DROP PRIMARY KEY,
    MODIFY `day` INTEGER NOT NULL,
    ADD PRIMARY KEY (`group_id`, `year`, `month`, `day`);

-- AlterTable
ALTER TABLE `year_history` DROP PRIMARY KEY,
    MODIFY `month` INTEGER NOT NULL,
    ADD PRIMARY KEY (`group_id`, `year`, `month`);
