\! echo "============================== Functions.sql ==============================";


-- ON UPDATE CURRENT_TIMESTAMP
CREATE OR REPLACE FUNCTION on_update_set_current_timestamp()
RETURNS TRIGGER AS $$
	BEGIN
		IF NEW IS DISTINCT FROM OLD THEN
			NEW.metadata_last_updated_at = CURRENT_TIMESTAMP;
		END IF;

		RETURN NEW;
	END;
$$ LANGUAGE plpgsql;
