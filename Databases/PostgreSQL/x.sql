\! clear
\! echo "============================== x =============================="
\set ON_ERROR_STOP 1

DROP DATABASE IF EXISTS "test_x_sql";

CREATE DATABASE "test_x_sql";
\c  "test_x_sql"



-- ------------------------------------
-- ------------------------------------ Location (Place)
-- ------------------------------------



\! echo "-------------------------- countries"
CREATE TABLE IF NOT EXISTS "countries" (
	"id" INT GENERATED ALWAYS AS IDENTITY,

	-- ISO 3166-1 alpha-2
	"ISO_alpha_2_code" CHAR(2) NOT NULL UNIQUE,

	-- ISO 3166-1 alpha-3
	"ISO_alpha_3_code" CHAR(3) NOT NULL UNIQUE,

	"code_name" VARCHAR(255) NOT NULL UNIQUE,
	"native_name" VARCHAR(255) NOT NULL,

	CHECK ("ISO_alpha_2_code" = UPPER("ISO_alpha_2_code") AND "ISO_alpha_2_code" ~ '^[A-Z]{2}$'),
	CHECK ("ISO_alpha_3_code" = UPPER("ISO_alpha_3_code") AND "ISO_alpha_3_code" ~ '^[A-Z]{3}$'),
	CHECK ("code_name" = LOWER("code_name") AND "code_name" ~ '^[a-z0-9_]+$'),

	PRIMARY KEY ("id")
);

INSERT INTO "countries" ("id", "ISO_alpha_2_code", "ISO_alpha_3_code", "code_name", "native_name") OVERRIDING SYSTEM VALUE VALUES
(1, 'UZ', 'UZB', 'uzbekistan', 'O''zbekiston'),
(2, 'CA', 'CAN', 'canada', 'Canada');



-- Not sure about the table name yet
\! echo "-------------------------- middle_level_divisions"
CREATE TABLE IF NOT EXISTS "middle_level_divisions" (
	"id" BIGINT GENERATED ALWAYS AS IDENTITY,

	"country" INT NOT NULL,

	-- Not sure what data will be stored in the middle yet

	"coordinates" POINT NULL,

	FOREIGN KEY ("country") REFERENCES "countries"("id"),

	PRIMARY KEY ("id")
);


\! echo "-------------------------- cities"
CREATE TABLE IF NOT EXISTS "cities" (
	"id" BIGINT GENERATED ALWAYS AS IDENTITY,

	"middle_level_division" BIGINT NOT NULL,

	"code_name" VARCHAR(255) NOT NULL,
	"native_name" VARCHAR(255) NOT NULL,

	"coordinates" POINT NULL,

	FOREIGN KEY ("middle_level_division") REFERENCES "middle_level_divisions"("id"),

	CHECK ("code_name" = LOWER("code_name") AND "code_name" ~ '^[a-z0-9_]+$'),

	PRIMARY KEY ("id")
);


\! echo "-------------------------- languages"
CREATE TABLE IF NOT EXISTS "languages" (
	"id" INT GENERATED ALWAYS AS IDENTITY,
	"code" VARCHAR(3) NOT NULL UNIQUE,
	"native_name" VARCHAR(50) NULL,
	PRIMARY KEY ("id")
);

INSERT INTO "languages" ("id", "code", "native_name") OVERRIDING SYSTEM VALUE VALUES
(1, 'en', 'English'),
(2, 'uz', 'Uzbek, Ўзбек, أۇزبېك‎'),
(3, 'ru', 'Русский язык'),
(4, 'ja', '日本語 (にほんご／にっぽんご)');

\! echo "-------------------------- currencies"
CREATE TABLE IF NOT EXISTS "currencies" (
	"id" INT GENERATED ALWAYS AS IDENTITY,
	"code" VARCHAR(3) NOT NULL UNIQUE,

	-- The number of digits after the decimal separator
	"decimal_digits" INT NULL,

	"fractional_unit" VARCHAR(10) NULL,
	"symbol" VARCHAR(10) NULL,
	"native_name" VARCHAR(30) NULL,
	PRIMARY KEY ("id")
);

INSERT INTO "currencies" ("id", "code", "decimal_digits", "fractional_unit", "symbol", "native_name") OVERRIDING SYSTEM VALUE VALUES
(1, 'UZS', 2, 'Tiyin', NULL, 'Oʻzbek soʻmi'),
(2, 'USD', 2, 'Cent', '$', 'United States dollar'),
(3, 'RUB', 2, 'Копейка', '₽', 'Российский рубль'),
(4, 'EUR', 2, 'Cent', '€', 'Euro'),
(5, 'GBP', 2, 'Penny', '£', 'Pound sterling'),
(6, 'JPY', 0, 'Sen', '¥', '日本円'),
(7, 'CAD', 2, 'Cent', '$', 'Canadian dollar'),
(8, 'AUD', 2, 'Cent', '$', 'Australian dollar'),
(9, 'CHF', 2, 'Rappen', 'Fr', 'Schweizer Franken'),
(10, 'CNY', 2, 'Fen', '¥', '人民币'),
(11, 'KRW', 0, 'Jeon', '₩', '대한민국 원'),
(12, 'SEK', 2, 'Öre', 'kr', 'Svensk krona'),
(13, 'NZD', 2, 'Cent', '$', 'New Zealand dollar'),
(14, 'INR', 2, 'Paisa', '₹', 'भारतीय रुपया'),
(15, 'SGD', 2, 'Cent', '$', 'Singapore dollar'),
(16, 'HKD', 2, 'Cent', '$', '港元'),
(17, 'NOK', 2, 'Øre', 'kr', 'Norske kroner'),
(18, 'MXN', 2, 'Centavo', '$', 'Peso mexicano'),
(19, 'KWD', 3, 'Fils', 'د.ك', 'دينار كويتي'),
(20, 'BHD', 3, 'Fils', 'BD', 'دينار بحريني'),
(21, 'OMR', 3, 'Baisa', 'ر.ع.', 'ريال عماني'),
(22, 'TND', 3, 'Millime', 'د.ت', 'دينار تونسي'),
(23, 'DKK', 2, 'Øre', 'kr', 'Danske kroner'),
(24, 'PLN', 2, 'Grosz', 'zł', 'Polski złoty'),
(25, 'CZK', 2, 'Haléř', 'Kč', 'Koruna česká'),
(26, 'HUF', 0, 'Fillér', 'Ft', 'Magyar forint'),
(27, 'THB', 2, 'Satang', '฿', 'บาทไทย'),
(28, 'TRY', 2, 'Kuruş', '₺', 'Türk lirası'),
(29, 'ZAR', 2, 'Cent', 'R', 'South African rand'),
(30, 'BRL', 2, 'Centavo', 'R$', 'Real brasileiro');


\! echo "-------------------------- app_color_modes"
CREATE TABLE IF NOT EXISTS "app_color_modes" (
	"id" INT GENERATED ALWAYS AS IDENTITY,
	"name" VARCHAR(10) NOT NULL UNIQUE,
	PRIMARY KEY ("id")
);

INSERT INTO "app_color_modes" ("id", "name") OVERRIDING SYSTEM VALUE VALUES
(1, 'dark'),
(2, 'light');





-- ------------------------------------
-- ------------------------------------ users
-- ------------------------------------

\! echo "-------------------------- user_authenticity_statuses"
CREATE TABLE IF NOT EXISTS "user_authenticity_statuses" (
	"id" INT GENERATED ALWAYS AS IDENTITY,
	"name" VARCHAR(20) NOT NULL UNIQUE,
	PRIMARY KEY ("id")
);

INSERT INTO "user_authenticity_statuses" ("id", "name") OVERRIDING SYSTEM VALUE VALUES
(1, 'unauthenticated'),
(2, 'unauthorized'),
(3, 'authorized');

\! echo "-------------------------- user_plans"
CREATE TABLE IF NOT EXISTS "user_plans" (
	"id" INT GENERATED ALWAYS AS IDENTITY,
	"name" VARCHAR(10) NOT NULL UNIQUE,
	PRIMARY KEY ("id")
);

\! echo "-------------------------- users"
CREATE TABLE IF NOT EXISTS "users" (
	"id" INT GENERATED ALWAYS AS IDENTITY,

	"username" VARCHAR(100) NULL UNIQUE,
	"password" VARCHAR(100) NOT NULL,
	"password_salt" VARCHAR(100),

	"eMail" VARCHAR(100) NULL UNIQUE,
	"eMail_verified" BIT(1) NOT NULL DEFAULT B'0',
	"eMail_verification_code" INT NULL,
	"eMail_verification_attempts_count" INT NOT NULL DEFAULT 0,

	"phone_number" VARCHAR(15) NULL UNIQUE,
	"phone_number_verified" BIT(1) NOT NULL DEFAULT B'0',
	"phone_number_verification_code" INT NULL,
	"phone_number_verification_attempt" INT NOT NULL DEFAULT 0,

	"first_name" VARCHAR(100),
	"last_name" VARCHAR(100),
	"birth_date" DATE NULL,

	-- 0 = Male
	-- 1 = Female
	-- NULL = Not specified
	"gender" BIT(1) DEFAULT NULL,

	"profile_picture" VARCHAR(100) NULL,
	"cover_picture" VARCHAR(100) NULL,
	"background_picture" VARCHAR(100) NULL,

	"authenticity_status" INT NULL,
	"plan" INT NULL,

	"currency" INT NULL,
	"app_language" INT NULL,
	"app_color_mode" INT NULL DEFAULT 1,

	"last_heartbeat_at" TIMESTAMP NULL DEFAULT NULL,

	-- Here using CURRENT_TIMESTAMP postgreSQL doesn't have ON UPDATE
	"last_update" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

	-- Deleted flag
	-- Temporarily keeps the unique columns
	"flag_deleted" TIMESTAMP NULL DEFAULT NULL,
	"flag_deleted_by_user" INT NULL,
	"flag_deleted_username" VARCHAR(100) NULL,
	"flag_deleted_eMail" VARCHAR(100) NULL,
	"flag_deleted_phone_number" VARCHAR(100) NULL,

	FOREIGN KEY ("authenticity_status") REFERENCES "user_authenticity_statuses"("id") ON DELETE SET NULL,
	FOREIGN KEY ("plan") REFERENCES "user_plans"("id") ON DELETE SET NULL,

	FOREIGN KEY ("currency") REFERENCES "currencies"("id") ON DELETE SET NULL,
	FOREIGN KEY ("app_language") REFERENCES "languages"("id") ON DELETE SET NULL,
	FOREIGN KEY ("app_color_mode") REFERENCES "app_color_modes"("id") ON DELETE SET NULL,

	PRIMARY KEY ("id")
);

\! echo "-------------------------- user_roles"
CREATE TABLE IF NOT EXISTS "user_roles" (
	"id" INT GENERATED ALWAYS AS IDENTITY,
	"name" VARCHAR(20) NOT NULL UNIQUE,
	PRIMARY KEY ("id")
);

INSERT INTO "user_roles" ("id", "name") OVERRIDING SYSTEM VALUE VALUES
(1, 'root'),
(2, 'dev'),
(3, 'admin');

\! echo "-------------------------- users_roles"
CREATE TABLE IF NOT EXISTS "users_roles" (
	"user" INT NOT NULL,
	"role" INT NOT NULL,

	FOREIGN KEY ("user") REFERENCES "users"("id") ON DELETE CASCADE,
	FOREIGN KEY ("role") REFERENCES "user_roles"("id") ON DELETE CASCADE,

	CONSTRAINT "unique_users_roles" UNIQUE ("user", "role")
);

\! echo "-------------------------- user_occupations"
CREATE TABLE IF NOT EXISTS "user_occupations" (
	"id" INT GENERATED ALWAYS AS IDENTITY,
	"name" VARCHAR(20) NOT NULL UNIQUE,
	PRIMARY KEY ("id")
);

\! echo "-------------------------- users_occupations"
CREATE TABLE IF NOT EXISTS "users_occupations" (
	"user" INT NOT NULL,
	"occupation" INT NOT NULL,

	FOREIGN KEY ("user") REFERENCES "users"("id") ON DELETE CASCADE,
	FOREIGN KEY ("occupation") REFERENCES "user_occupations"("id") ON DELETE CASCADE,

	CONSTRAINT "unique_users_occupations" UNIQUE ("user", "occupation")
);

\! echo "-------------------------- users_username_records"
CREATE TABLE IF NOT EXISTS "users_username_records" (
	"id" BIGINT GENERATED ALWAYS AS IDENTITY,

	"user" INT NOT NULL,

	"username" VARCHAR(100) NOT NULL,

	"timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

	FOREIGN KEY ("user") REFERENCES "users"("id"),

	PRIMARY KEY ("id")
);




-- ------------------------------------
-- ------------------------------------ Cron jobs
-- ------------------------------------

\! echo "-------------------------- Cron_Job_events"
CREATE TABLE IF NOT EXISTS "Cron_Job_events" (
	"id" INT GENERATED ALWAYS AS IDENTITY,
	"name" VARCHAR(500) NOT NULL UNIQUE,
	PRIMARY KEY ("id")
);
-- INSERT INTO "Cron_Job_events" ("id", "name") OVERRIDING SYSTEM VALUE VALUES
-- (1, 'job_A'),
-- (2, 'job_B');

\! echo "-------------------------- Cron_Job_logs"
CREATE TABLE IF NOT EXISTS "Cron_Job_logs" (
	"id" BIGINT GENERATED ALWAYS AS IDENTITY,
	"event" INT NOT NULL,

	"data_JSON" JSON NULL,

	"timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

	FOREIGN KEY ("event") REFERENCES "Cron_Job_events"("id"),

	PRIMARY KEY ("id")
);




-- ------------------------------------
-- ------------------------------------ Notifications
-- ------------------------------------

\! echo "-------------------------- notification_events"
CREATE TABLE IF NOT EXISTS "notification_events" (
	"id" INT GENERATED ALWAYS AS IDENTITY,
	"name" VARCHAR(500) NOT NULL UNIQUE,
	PRIMARY KEY ("id")
);
-- INSERT INTO "notification_events" ("id", "name") OVERRIDING SYSTEM VALUE VALUES
-- (1, 'event_name_A'),
-- (2, 'event_name_B');

CREATE TABLE IF NOT EXISTS "disabled_notification_events" (
	"id" INT GENERATED ALWAYS AS IDENTITY,
	"user" INT NOT NULL,
	"event" INT NOT NULL,

	"method_in_app" BIT(1) NOT NULL DEFAULT B'0',
	"method_eMail" BIT(1) NOT NULL DEFAULT B'0',
	"method_SMS" BIT(1) NOT NULL DEFAULT B'0',

	"timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

	FOREIGN KEY ("user") REFERENCES "users"("id") ON DELETE CASCADE,
	FOREIGN KEY ("event") REFERENCES "notification_events"("id") ON DELETE CASCADE,

	CONSTRAINT "unique_user_event" UNIQUE ("user", "event"),

	PRIMARY KEY ("id")
);

\! echo "-------------------------- notification_types"
CREATE TABLE IF NOT EXISTS "notification_types" (
	"id" INT GENERATED ALWAYS AS IDENTITY,
	"name" VARCHAR(20) NOT NULL UNIQUE,
	PRIMARY KEY ("id")
);

INSERT INTO "notification_types" ("id", "name") OVERRIDING SYSTEM VALUE VALUES
(1, 'success'),
(2, 'info'),
(3, 'warning'),
(4, 'error'),
(5, 'important'),
(6, 'urgent');

\! echo "-------------------------- notifications"
CREATE TABLE IF NOT EXISTS "notifications" (
	"id" INT GENERATED ALWAYS AS IDENTITY,

	-- NULL = System
	"sender" INT NULL,
	"recipient" INT NOT NULL,
	"content_TEXT" TEXT NULL,
	"content_JSON" JSON NULL,
	"seen" BIT(1) NOT NULL DEFAULT B'0',

	"event" INT NULL,

	-- NULL = No type
	"type" INT NULL,

	"last_update" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

	"flag_deleted" TIMESTAMP NULL DEFAULT NULL,
	"flag_deleted_by_user" INT NULL,

	FOREIGN KEY ("sender") REFERENCES "users"("id"),
	FOREIGN KEY ("recipient") REFERENCES "users"("id") ON DELETE CASCADE,

	FOREIGN KEY ("event") REFERENCES "notification_events"("id"),
	FOREIGN KEY ("type") REFERENCES "notification_types"("id"),

	PRIMARY KEY ("id")
);




-- ------------------------------------
-- ------------------------------------ Login tools
-- ------------------------------------

\! echo "-------------------------- log_in_records"
CREATE TABLE IF NOT EXISTS "log_in_records" (
	"id" BIGINT GENERATED ALWAYS AS IDENTITY,

	-- NULL = Unsuccessful attempt
	-- id = Successful login
	"user" INT NULL DEFAULT NULL,

	"ip_address" VARCHAR(45) NULL DEFAULT NULL,

	"user_agent" TEXT NULL DEFAULT NULL,

	"message" VARCHAR(1000) NULL DEFAULT NULL,

	"timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

	PRIMARY KEY ("id")
);

\! echo "-------------------------- password_reset_requests"
CREATE TABLE IF NOT EXISTS "password_reset_requests" (
	"id" BIGINT GENERATED ALWAYS AS IDENTITY,

	"user" INT NULL,

	"token" VARCHAR(100) NOT NULL UNIQUE,

	-- Details of requester
	"ip_address_first" VARCHAR(45),
	"user_agent_first" TEXT NULL DEFAULT NULL,
	"timestamp_first" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

	-- Details of eMail owner
	"ip_address_last" VARCHAR(45),
	"user_agent_last" TEXT NULL DEFAULT NULL,
	"timestamp_last" TIMESTAMP NULL,

	"old_password" VARCHAR(100) NULL,
	"new_password" VARCHAR(100) NULL,

	FOREIGN KEY ("user") REFERENCES "users"("id"),

	PRIMARY KEY ("id")
);





-- ------------------------------------
-- ------------------------------------ Feedbacks
-- ------------------------------------
\! echo "-------------------------- feedbacks"
CREATE TABLE IF NOT EXISTS "feedbacks" (
	"id" BIGINT GENERATED ALWAYS AS IDENTITY,

	"ip_address" VARCHAR(45),
	"user_agent" TEXT NULL DEFAULT NULL,
	"feedback_left_page" VARCHAR(500) NULL,

	"created_by_user" INT NULL,

	"fullname" VARCHAR(200) NULL,
	"eMail" VARCHAR(100) NULL,
	"feedback_text" TEXT NOT NULL,

	"timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

	"flag_deleted" TIMESTAMP NULL DEFAULT NULL,
	"flag_deleted_by_user" INT NULL,

	PRIMARY KEY ("id")
);




-- ------------------------------------
-- ------------------------------------ Stripe
-- ------------------------------------

\! echo "-------------------------- Stripe_customers_users"
CREATE TABLE IF NOT EXISTS "Stripe_customers_users" (
	"id" BIGINT GENERATED ALWAYS AS IDENTITY,
	"last_update" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

	"user" INT NOT NULL UNIQUE,
	"Stripe_customer_id" VARCHAR(255) NOT NULL UNIQUE,

	FOREIGN KEY ("user") REFERENCES "users"("id"),

	PRIMARY KEY ("id")
);

\! echo "-------------------------- Stripe_event_types"
CREATE TABLE IF NOT EXISTS "Stripe_event_types" (
	"id" INT GENERATED ALWAYS AS IDENTITY,

	-- e.g., 'payment_intent.succeeded'
	"name" VARCHAR(100) NOT NULL UNIQUE,
	PRIMARY KEY ("id")
);

INSERT INTO "Stripe_event_types" ("id", "name") OVERRIDING SYSTEM VALUE VALUES
(1, 'payment_intent.created'),
(2, 'payment_intent.succeeded'),
(3, 'payment_intent.payment_failed'),
(4, 'charge.succeeded'),
(5, 'charge.failed'),
(6, 'charge.refunded'),
(7, 'customer.created'),
(8, 'customer.updated'),
(9, 'customer.subscription.created'),
(10, 'customer.subscription.updated'),
(11, 'customer.subscription.deleted'),
(12, 'customer.subscription.trial_will_end'),
(13, 'invoice.created'),
(14, 'invoice.finalized'),
(15, 'invoice.payment_succeeded'),
(16, 'invoice.payment_failed'),
(17, 'invoice.voided'),
(18, 'checkout.session.completed'),
(19, 'refund.created');


\! echo "-------------------------- Stripe_object_types"
CREATE TABLE IF NOT EXISTS "Stripe_object_types" (
	"id" INT GENERATED ALWAYS AS IDENTITY,

	-- 'payment_intent', 'subscription', etc.
	"name" VARCHAR(50) NOT NULL UNIQUE,
	PRIMARY KEY ("id")
);

INSERT INTO "Stripe_object_types" ("id", "name") OVERRIDING SYSTEM VALUE VALUES
(1, 'payment_intent'),
(2, 'charge'),
(3, 'subscription'),
(4, 'invoice'),
(5, 'refund'),
(6, 'customer'),
(7, 'checkout.session'),
(8, 'price'),
(9, 'product');


\! echo "-------------------------- Stripe_webhook_logs"
CREATE TABLE IF NOT EXISTS "Stripe_webhook_logs" (
	"id" BIGINT GENERATED ALWAYS AS IDENTITY,
	"last_update" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,


	--
	-- Event
	--

	-- Stripe's event ID (evt_...)
	"event_id" VARCHAR(255) NOT NULL UNIQUE,
	"event_type" INT NULL,

	-- Full event data as JSON
	"event_data" JSON,

	-- Test vs live mode
	"livemode" BIT(1) NOT NULL DEFAULT B'0',

	-- When the event was created
	"created" TIMESTAMP NOT NULL,


	--
	-- Object
	--

	-- ID of the object (pi_..., sub_..., etc.)
	"object_id" VARCHAR(255),
	"object_type" INT NULL,
	"object_status" VARCHAR(50),
	"customer_id" VARCHAR(255),

	-- Stripe stores all amounts in the smallest currency unit in integer type
	"amount" BIGINT,
	"currency" INT NULL,


	FOREIGN KEY ("event_type") REFERENCES "Stripe_event_types"("id"),
	FOREIGN KEY ("object_type") REFERENCES "Stripe_object_types"("id"),
	FOREIGN KEY ("currency") REFERENCES "currencies"("id"),

	PRIMARY KEY ("id")
);

CREATE INDEX "index_event_type" ON "Stripe_webhook_logs" ("event_type");
CREATE INDEX "index_created" ON "Stripe_webhook_logs" ("created");
CREATE INDEX "index_object_id" ON "Stripe_webhook_logs" ("object_id");
CREATE INDEX "index_object_type" ON "Stripe_webhook_logs" ("object_type");
CREATE INDEX "index_customer_id" ON "Stripe_webhook_logs" ("customer_id");