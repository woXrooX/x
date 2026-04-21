-- ------------------------------------
-- ------------------------------------ Location (Place): More advanced place structure
-- ------------------------------------

-- Typical hierarchy:
-- Country →
-- First-level division →
-- Second-level division →
-- City/Town/Village →
-- Neighborhood/District →
-- Street


-- USA: Country → State → County → City → Neighborhood
-- UK: Country → Region → County → District → Town/Village
-- France: Country → Région → Département → Commune
-- Uzbekistan: Country → Region (viloyat) → District (tuman) → City/Village
-- Japan: Country → Prefecture → City/District → Town → Chōme (block)
-- Germany: Country → Bundesland → Kreis → Gemeinde


-- For Uzbekistan, the tree would look like:
--
-- Uzbekistan (country)
-- └── Tashkent viloyat (region_type: "viloyat", level: 1)
-- 		└── Tashkent tuman (region_type: "tuman", level: 2)
-- 			└── Tashkent city (region_type: "city", level: 3)

-- For the USA:
--
-- United States (country)
-- └── California (region_type: "state", level: 1)
-- 		└── Los Angeles County (region_type: "county", level: 2)
-- 			└── Los Angeles (region_type: "city", level: 3)


\! echo "-------------------------- place_division_types";
CREATE TABLE IF NOT EXISTS "place_division_types" (
	"id" INT GENERATED ALWAYS AS IDENTITY,

	"parent_division" INT NULL,

	"name" VARCHAR(255) NOT NULL,

	FOREIGN KEY ("parent_division") REFERENCES "place_division_types"("id"),

	UNIQUE KEY "unique_parent_division_name" ("parent_division", "name"),

	PRIMARY KEY ("id")
);


\! echo "-------------------------- place_divisions";
CREATE TABLE IF NOT EXISTS "place_divisions" (
	"id" INT GENERATED ALWAYS AS IDENTITY,

	"place_division_type" INT NOT NULL,

	-- ISO 3166-1 alpha-2
	"ISO_alpha_2_code" CHAR(2) NOT NULL UNIQUE,

	-- ISO 3166-1 alpha-3
	"ISO_alpha_3_code" CHAR(3) NOT NULL UNIQUE,

	"code_name" VARCHAR(255) NOT NULL,
	"native_name" VARCHAR(255) NOT NULL,

	"coordinates" POINT NULL,

	FOREIGN KEY ("place_division_type") REFERENCES "place_division_types"("id"),

	CHECK ("ISO_alpha_2_code" = UPPER("ISO_alpha_2_code") AND "ISO_alpha_2_code" ~ '^[A-Z]{2}$'),
	CHECK ("ISO_alpha_3_code" = UPPER("ISO_alpha_3_code") AND "ISO_alpha_3_code" ~ '^[A-Z]{3}$'),
	CHECK ("code_name" = LOWER("code_name") AND "code_name" ~ '^[a-z0-9_]+$'),

	PRIMARY KEY ("id")
);
