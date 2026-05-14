-- ------------------------------------
-- ------------------------------------ Stripe
-- ------------------------------------

\! echo "-------------------------- Stripe_customers_users"
CREATE TABLE IF NOT EXISTS "Stripe_customers_users" (
	"id" BIGINT GENERATED ALWAYS AS IDENTITY,

	"metadata_last_updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"metadata_created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

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

SELECT setval(
	pg_get_serial_sequence('Stripe_event_types', 'id'),
	(SELECT MAX("id") FROM "Stripe_event_types")
);


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

SELECT setval(
	pg_get_serial_sequence('Stripe_object_types', 'id'),
	(SELECT MAX("id") FROM "Stripe_object_types")
);


\! echo "-------------------------- Stripe_webhook_logs"
CREATE TABLE IF NOT EXISTS "Stripe_webhook_logs" (
	"id" BIGINT GENERATED ALWAYS AS IDENTITY,

	"metadata_last_updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"metadata_created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

	--
	-- Event
	--

	-- Stripe's event ID (evt_...)
	"event_id" VARCHAR(255) NOT NULL UNIQUE,
	"event_type" INT NULL,

	-- Full event data as JSONB
	"event_data" JSONB,

	-- Test vs live mode
	"livemode" BIT(1) NOT NULL DEFAULT b'0',

	-- When the event was created
	"created" TIMESTAMPTZ NOT NULL,


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

CREATE INDEX IF NOT EXISTS "index_event_type" ON "Stripe_webhook_logs" USING btree ("event_type");
CREATE INDEX IF NOT EXISTS "index_created" ON "Stripe_webhook_logs" USING btree ("created");
CREATE INDEX IF NOT EXISTS "index_object_id" ON "Stripe_webhook_logs" USING btree ("object_id");
CREATE INDEX IF NOT EXISTS "index_object_type" ON "Stripe_webhook_logs" USING btree ("object_type");
CREATE INDEX IF NOT EXISTS "index_customer_id" ON "Stripe_webhook_logs" USING btree ("customer_id");
