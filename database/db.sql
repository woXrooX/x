\W

DROP DATABASE IF EXISTS template;
CREATE DATABASE IF NOT EXISTS template CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE template;

SET NAMES utf8mb4;

--
-- Table structure for table `users`
--
-- CREATE TABLE IF NOT EXISTS `users` (
--   `id` INT NOT NULL UNIQUE auto_increment,
--   `username` VARCHAR(100) NOT NULL UNIQUE,
--   -- `password` VARCHAR(100) NOT NULL UNIQUE COLLATE utf8_bin, -> adds case sensitiveity
--   `password` VARCHAR(100) NOT NULL UNIQUE,
--   `password_salt` VARCHAR(100),
--
--   `eMail` VARCHAR(100) NOT NULL UNIQUE,
--   `eMail_verification` TINYINT NOT NULL DEFAULT 0,
--   `eMail_verification_code` INT NULL,
--   `eMail_verification_attempt` INT NOT NULL DEFAULT 0,
--
--   `phone_number` VARCHAR(15) NULL UNIQUE,
--   `phone_number_verification` TINYINT NOT NULL DEFAULT 0,
--   `phone_number_verification_code` INT NULL,
--   `phone_number_verification_attempt` INT NOT NULL DEFAULT 0,
--
--   `firstname` VARCHAR(100),
--   `lastname` VARCHAR(100),
--   `birthDate` DATE NULL,
--   `gender` INT NULL,
--
--   `account_picture` VARCHAR(100) NULL,
--   `cover_picture` VARCHAR(100) NULL,
--   `background_picture` VARCHAR(100) NULL,
--
--   -- NULL = customer level (but not customer more precisely equals -> not specified/undefined -> not unknown)
--   `type` INT NULL,
--
--   `currency` INT NULL,
--
--   `site_language` INT NULL,
--   `site_color_scheme` ENUM('light', 'dark') NOT NULL DEFAULT 'light ',
--   `state` ENUM('active', 'inactive', 'deleted') NOT NULL DEFAULT 'active',
--   `last_update` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--   `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
--
--   FOREIGN KEY (gender) REFERENCES genders(id) ON DELETE SET NULL,
--   FOREIGN KEY (type) REFERENCES user_types(id) ON DELETE SET NULL,
--   FOREIGN KEY (currency) REFERENCES currencies(id) ON DELETE SET NULL,
--   FOREIGN KEY (site_language) REFERENCES languages(id) ON DELETE SET NULL,
--
--   PRIMARY KEY (`id`)
-- );
