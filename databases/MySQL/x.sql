\! clear
\! echo "============================== x ==============================";
\W

DROP DATABASE IF EXISTS [NAME];
CREATE DATABASE IF NOT EXISTS [NAME] CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE [NAME];

SET NAMES utf8mb4;






-- ------------------------------------
-- ------------------------------------ App settings
-- ------------------------------------

\! echo "-------------------------- currencies";
-- https://en.wikipedia.org/wiki/List_of_circulating_currencies
-- decimal_digits is The number of digits after the decimal separator (By wikipedia)
-- UZS https://en.wikipedia.org/wiki/Uzbekistani_so%CA%BBm
-- RUB https://en.wikipedia.org/wiki/Russian_ruble

CREATE TABLE IF NOT EXISTS `currencies` (
	`id` INT NOT NULL UNIQUE auto_increment,
	`code` VARCHAR(3) NOT NULL UNIQUE,
	`decimal_digits` INT NULL,
	`fractional_unit` VARCHAR(10) NULL,
	`symbol` VARCHAR(3) NULL,
	`native_name` VARCHAR(30) NULL,
	PRIMARY KEY (`id`)
);
INSERT INTO currencies (id, code, decimal_digits, fractional_unit, symbol, native_name)
	VALUES
		(1, "UZS", 2, "Tiyin", NULL, "Oʻzbek soʻmi"),
		(2, "USD", 2, "Cent", "$", "United States dollar"),
		(3, "RUB", 2, "Копейка", "₽", "Российский рубль")
;

\! echo "-------------------------- languages";
CREATE TABLE IF NOT EXISTS `languages` (
	`id` INT NOT NULL UNIQUE auto_increment,
	`code` VARCHAR(3) NOT NULL UNIQUE,
	`native_name` VARCHAR(50) NULL,
	PRIMARY KEY (`id`)
);
INSERT INTO languages (id, code, native_name)
	VALUES
		(1, "en", "English"),
		(2, "uz", "Uzbek, Ўзбек, أۇزبېك‎"),
		(3, "ru", "Русский язык"),
		(4, "ja", "日本語 (にほんご／にっぽんご)")
;

\! echo "-------------------------- app_color_modes";
-- 1 Is For Dark Mode
-- 2 Is For Light Mode

CREATE TABLE IF NOT EXISTS `app_color_modes` (
	`id` INT NOT NULL UNIQUE auto_increment,
	`name` VARCHAR(10) NOT NULL UNIQUE,
	PRIMARY KEY (`id`)
);
INSERT INTO app_color_modes (id, name)
	VALUES
		(1, "dark"),
		(2, "light")
;





-- ------------------------------------
-- ------------------------------------ users
-- ------------------------------------

\! echo "-------------------------- user_authenticity_statuses";
CREATE TABLE IF NOT EXISTS `user_authenticity_statuses` (
	`id` INT NOT NULL UNIQUE auto_increment,
	`name` VARCHAR(20) NOT NULL UNIQUE,
	PRIMARY KEY (`id`)
);
INSERT INTO user_authenticity_statuses (id, name)
	VALUES
		(1, "unauthenticated"),
		(2, "unauthorized"),
		(3, "authorized")
;

\! echo "-------------------------- user_plans";
CREATE TABLE IF NOT EXISTS `user_plans` (
	`id` INT NOT NULL UNIQUE auto_increment,
	`name` VARCHAR(10) NOT NULL UNIQUE,
	PRIMARY KEY (`id`)
);

\! echo "-------------------------- users";
CREATE TABLE IF NOT EXISTS `users` (
	`id` INT NOT NULL UNIQUE auto_increment,
	`username` VARCHAR(100) NULL UNIQUE,
	`password` VARCHAR(100) NOT NULL,
	`password_salt` VARCHAR(100),

	`eMail` VARCHAR(100) NULL UNIQUE,
	`eMail_verified` BIT(1) NOT NULL DEFAULT b'0',
	`eMail_verification_code` INT NULL,
	`eMail_verification_attempts_count` INT NOT NULL DEFAULT 0,

	`phone_number` VARCHAR(15) NULL UNIQUE,
	`phone_number_verified` BIT(1) NOT NULL DEFAULT 0,
	`phone_number_verification_code` INT NULL,
	`phone_number_verification_attempt` INT NOT NULL DEFAULT 0,

	`firstname` VARCHAR(100),
	`lastname` VARCHAR(100),
	`birth_date` DATE NULL,

	-- 0 = Male
	-- 1 = Female
	-- NULL = Not specified
	`gender` BIT(1) DEFAULT NULL,

	`profile_picture` VARCHAR(100) NULL,
	`cover_picture` VARCHAR(100) NULL,
	`background_picture` VARCHAR(100) NULL,

	`authenticity_status` INT NULL,
	`plan` INT NULL,

	`currency` INT NULL,
	`app_language` INT NULL,
	`app_color_mode` INT NULL DEFAULT 1,

	`last_update` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

	-- Deleted flag
	-- Temporarily keeps the unique columns
	`flag_deleted` TIMESTAMP NULL DEFAULT NULL,
	`flag_deleted_by_user` INT NULL,
	`flag_deleted_username` VARCHAR(100) NULL,
	`flag_deleted_eMail` VARCHAR(100) NULL,
	`flag_deleted_phone_number` VARCHAR(100) NULL,

	FOREIGN KEY (authenticity_status) REFERENCES user_authenticity_statuses(id) ON DELETE SET NULL,
	FOREIGN KEY (plan) REFERENCES user_plans(id) ON DELETE SET NULL,

	FOREIGN KEY (currency) REFERENCES currencies(id) ON DELETE SET NULL,
	FOREIGN KEY (app_language) REFERENCES languages(id) ON DELETE SET NULL,
	FOREIGN KEY (app_color_mode) REFERENCES app_color_modes(id) ON DELETE SET NULL,

	PRIMARY KEY (`id`)
);

\! echo "-------------------------- user_roles";
CREATE TABLE IF NOT EXISTS `user_roles` (
	`id` INT NOT NULL UNIQUE auto_increment,
	`name` VARCHAR(20) NOT NULL UNIQUE,
	PRIMARY KEY (`id`)
);
INSERT INTO user_roles (id, name)
	VALUES
		(1, "root"),
		(2, "dev"),
		(3, "admin")
;

\! echo "-------------------------- users_roles";
CREATE TABLE IF NOT EXISTS `users_roles` (
	`user` INT NOT NULL,
	`role` INT NOT NULL,

	FOREIGN KEY (`user`) REFERENCES users(`id`) ON DELETE CASCADE,
	FOREIGN KEY (`role`) REFERENCES user_roles(`id`) ON DELETE CASCADE,

	CONSTRAINT `unique_users_roles` UNIQUE (`user`, `role`)
);

\! echo "-------------------------- user_occupations";
CREATE TABLE IF NOT EXISTS `user_occupations` (
	`id` INT NOT NULL UNIQUE auto_increment,
	`name` VARCHAR(20) NOT NULL UNIQUE,
	PRIMARY KEY (`id`)
);

\! echo "-------------------------- users_occupations";
CREATE TABLE IF NOT EXISTS `users_occupations` (
	`user` INT NOT NULL,
	`occupation` INT NOT NULL,

	FOREIGN KEY (`user`) REFERENCES users(`id`) ON DELETE CASCADE,
	FOREIGN KEY (`occupation`) REFERENCES user_occupations(`id`) ON DELETE CASCADE,

	CONSTRAINT `unique_users_occupations` UNIQUE (`user`, `occupation`)
);




-- ------------------------------------
-- ------------------------------------ Notifications
-- ------------------------------------
\! echo "-------------------------- notification_events";
CREATE TABLE IF NOT EXISTS `notification_events` (
	`id` INT NOT NULL UNIQUE auto_increment,
	`name` VARCHAR(500) NOT NULL UNIQUE,
	PRIMARY KEY (`id`)
);
-- INSERT INTO notification_events (id, name)
-- 	VALUES
-- 		(1, "event_name_A"),
-- 		(2, "event_name_B")
-- ;

\! echo "-------------------------- notification_types";
CREATE TABLE IF NOT EXISTS `notification_types` (
	`id` INT NOT NULL UNIQUE auto_increment,
	`name` VARCHAR(20) NOT NULL UNIQUE,
	PRIMARY KEY (`id`)
);
INSERT INTO notification_types (id, name)
	VALUES
		(1, "success"),
		(2, "info"),
		(3, "warning"),
		(4, "error"),
		(5, "important"),
		(6, "urgent")
;

\! echo "-------------------------- notifications";
CREATE TABLE IF NOT EXISTS `notifications` (
	`id` INT NOT NULL UNIQUE auto_increment,

	-- NULL = System
	`sender` INT NULL,
	`recipient` INT NOT NULL,
	`content_TEXT` TEXT NULL,
	`content_JSON` JSON NULL,
	`seen` BIT(1) NOT NULL DEFAULT 0,

	`event` INT NULL,

	-- NULL = No type
	`type` INT NULL,

	`last_update` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

	`flag_deleted` TIMESTAMP NULL DEFAULT NULL,
	`flag_deleted_by_user` INT NULL,

	FOREIGN KEY (`sender`) REFERENCES users(`id`),
	FOREIGN KEY (`recipient`) REFERENCES users(`id`) ON DELETE CASCADE,

	FOREIGN KEY (`event`) REFERENCES notification_events(`id`),
	FOREIGN KEY (`type`) REFERENCES notification_types(`id`),

	PRIMARY KEY (`id`)
);





-- ------------------------------------
-- ------------------------------------ Login tools
-- ------------------------------------

\! echo "-------------------------- log_in_records";
CREATE TABLE IF NOT EXISTS `log_in_records` (
	`id` BIGINT UNSIGNED NOT NULL UNIQUE AUTO_INCREMENT,

	-- NULL = Unsuccessful attempt
	-- id = Successful login
	`user` INT NULL DEFAULT NULL,

	`ip_address` VARCHAR(45) NULL DEFAULT NULL,

	`x_forwarded_for` TEXT NULL DEFAULT NULL,

	`user_agent` TEXT NULL DEFAULT NULL,

	`message` VARCHAR(1000) NULL DEFAULT NULL,

	`timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

	PRIMARY KEY (`id`)
);

\! echo "-------------------------- password_recoveries";
CREATE TABLE IF NOT EXISTS `password_recoveries` (
	`id` BIGINT UNSIGNED NOT NULL UNIQUE AUTO_INCREMENT,

	`user` INT NULL,

	`token` VARCHAR(100) NOT NULL UNIQUE,

	-- Details of requester
	`ip_address_first` VARCHAR(45),
	`user_agent_first` TEXT,
	`timestamp_first` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

	-- Details of eMail owner
	`ip_address_last` VARCHAR(45),
	`user_agent_last` TEXT,
	`timestamp_last` TIMESTAMP NULL,

	`password_old` VARCHAR(100) NULL,
	`password_new` VARCHAR(100) NULL,

	FOREIGN KEY (user) REFERENCES users(id),

	PRIMARY KEY (`id`)
);





-- ------------------------------------
-- ------------------------------------ Feedback
-- ------------------------------------
\! echo "-------------------------- feedback";
CREATE TABLE IF NOT EXISTS `feedback` (
	`id` BIGINT UNSIGNED NOT NULL UNIQUE AUTO_INCREMENT,

	`ip_address` VARCHAR(45),
	`user_agent` TEXT,
	`feedback_left_page` VARCHAR(500) NULL,

	`created_by_user` INT NULL,

	`fullname` VARCHAR(200) NULL,
	`eMail` VARCHAR(100) NULL,
	`feedback_text` LONGTEXT NOT NULL,

	`timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

	PRIMARY KEY (`id`)
);
