\W

DROP DATABASE IF EXISTS template;
CREATE DATABASE IF NOT EXISTS template CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE template;

SET NAMES utf8mb4;


--
-- Table structure for table `currencies`
--

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
INSERT INTO currencies (code, decimal_digits, fractional_unit, symbol, native_name)
  VALUES
    ("UZS", 2, "Tiyin", NULL, "Oʻzbek soʻmi"),
    ("USD", 2, "Cent", "$", "United States dollar"),
    ("RUB", 2, "Копейка", "₽", "Российский рубль")
;


--
-- Table structure for table `languages`
--
CREATE TABLE IF NOT EXISTS `languages` (
  `id` INT NOT NULL UNIQUE auto_increment,
  `code` VARCHAR(3) NOT NULL UNIQUE,
  `native_name` VARCHAR(50) NULL,
  PRIMARY KEY (`id`)
);
INSERT INTO languages (code, native_name)
  VALUES
    ("en", "English"),
    ("uz", "Uzbek, Ўзбек, أۇزبېك‎"),
    ("ru", "Русский язык"),
    ("ja", "日本語 (にほんご／にっぽんご)")
;


--
-- Table structure for table `site_color_scheme`
--
CREATE TABLE IF NOT EXISTS `site_color_schemes` (
  `id` INT NOT NULL UNIQUE auto_increment,
  `name` VARCHAR(10) NOT NULL UNIQUE,
  PRIMARY KEY (`id`)
);
INSERT INTO site_color_schemes (name)
  VALUES
    ("light"),
    ("dark")
;


--
-- Table structure for table `genders`
--
CREATE TABLE IF NOT EXISTS `genders` (
  `id` INT NOT NULL UNIQUE auto_increment,
  `name` VARCHAR(10) NOT NULL UNIQUE,
  PRIMARY KEY (`id`)
);
INSERT INTO genders (name)
  VALUES
    ("unknown"),
    ("male"),
    ("female")
;


--
-- Table structure for table `user_types`
--
CREATE TABLE IF NOT EXISTS `user_types` (
  `id` INT NOT NULL UNIQUE auto_increment,
  `name` VARCHAR(10) NOT NULL UNIQUE,
  PRIMARY KEY (`id`)
);
INSERT INTO user_types (name)
  VALUES
    ("root"),
    ("admin"),
    ("user")
;


--
-- Table structure for table `user_states`
--
CREATE TABLE IF NOT EXISTS `user_states` (
  `id` INT NOT NULL UNIQUE auto_increment,
  `name` VARCHAR(10) NOT NULL UNIQUE,
  PRIMARY KEY (`id`)
);
INSERT INTO user_states (name)
  VALUES
    ("active"),
    ("inactive"),
    ("deleted")
;

--
-- Table structure for table `users`
--
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT NOT NULL UNIQUE auto_increment,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  -- `password` VARCHAR(100) NOT NULL UNIQUE COLLATE utf8_bin, -> adds case sensitiveity
  `password` VARCHAR(100) NOT NULL UNIQUE,
  `password_salt` VARCHAR(100),

  `eMail` VARCHAR(100) NOT NULL UNIQUE,
  `eMail_verification` TINYINT NOT NULL DEFAULT 0,
  `eMail_verification_code` INT NULL,
  `eMail_verification_attempt` INT NOT NULL DEFAULT 0,

  `phone_number` VARCHAR(15) NULL UNIQUE,
  `phone_number_verification` TINYINT NOT NULL DEFAULT 0,
  `phone_number_verification_code` INT NULL,
  `phone_number_verification_attempt` INT NOT NULL DEFAULT 0,

  `firstname` VARCHAR(100),
  `lastname` VARCHAR(100),
  `birthDate` DATE NULL,
  `gender` INT NULL,

  `profile_picture` VARCHAR(100) NULL,
  `cover_picture` VARCHAR(100) NULL,
  `background_picture` VARCHAR(100) NULL,

  -- NULL = customer level (but not customer more precisely equals -> not specified/undefined -> not unknown)
  `type` INT NULL,
  `state` INT NULL,

  `currency` INT NULL,
  `site_language` INT NULL,
  `site_color_scheme` INT NULL,

  `last_update` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (gender) REFERENCES genders(id) ON DELETE SET NULL,
  FOREIGN KEY (type) REFERENCES user_types(id) ON DELETE SET NULL,
  FOREIGN KEY (state) REFERENCES user_states(id) ON DELETE SET NULL,
  FOREIGN KEY (currency) REFERENCES currencies(id) ON DELETE SET NULL,
  FOREIGN KEY (site_language) REFERENCES languages(id) ON DELETE SET NULL,
  FOREIGN KEY (site_color_scheme) REFERENCES site_color_schemes(id) ON DELETE SET NULL,

  PRIMARY KEY (`id`)
);
