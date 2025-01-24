-- CreateTable
CREATE TABLE `user_settings` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `currency` VARCHAR(100) NULL,
    `group_id` INTEGER NULL,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `category` (
    `category_id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `name` VARCHAR(255) NOT NULL,
    `icon` VARCHAR(255) NULL,
    `type` VARCHAR(50) NULL,
    `user_id` INTEGER NOT NULL,

    PRIMARY KEY (`category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `month_history` (
    `user_id` INTEGER NOT NULL,
    `day` INTEGER NULL,
    `month` INTEGER NOT NULL,
    `year` INTEGER NOT NULL,
    `income` DECIMAL(10, 2) NULL,
    `expense` DECIMAL(10, 2) NULL,

    PRIMARY KEY (`user_id`, `year`, `month`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transactions` (
    `transaction_id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `amount` DECIMAL(10, 2) NULL,
    `description` TEXT NULL,
    `date` DATE NULL,
    `user_id` INTEGER NULL,
    `type` ENUM('income', 'expense') NULL,
    `category` VARCHAR(255) NULL,

    PRIMARY KEY (`transaction_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `year_history` (
    `user_id` INTEGER NOT NULL,
    `month` INTEGER NULL,
    `year` INTEGER NOT NULL,
    `income` DECIMAL(10, 2) NULL,
    `expense` DECIMAL(10, 2) NULL,

    PRIMARY KEY (`user_id`, `year`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
