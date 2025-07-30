-- This file contains optional trigger helpers/templates

------------------------------------
------------------------------------ Audit logs
------------------------------------

\! echo "-------------------------- x_audit_log";
CREATE TABLE IF NOT EXISTS `x_audit_log` (
	`id` BIGINT UNSIGNED NOT NULL UNIQUE AUTO_INCREMENT,
	`by_user` INT NULL,

	-- 1 = INSERT
	-- 2 = UPDATE
	-- 3 = DELETE
	`event` INT NOT NULL,

	`table_name` VARCHAR(64) NOT NULL,
	`table_primary_key` INT NOT NULL,
	`table_columns` JSON NOT NULL,

	`timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	FOREIGN KEY (`by_user`) REFERENCES users(`id`),

	PRIMARY KEY (`id`)

-- ENGINE = ARCHIVE -> Makes a table “append‑only” so that rows can be inserted but never updated or deleted.
) ENGINE = ARCHIVE;



\! echo "-------------------------- x_trigger_insert_table_name";
DELIMITER //

CREATE TRIGGER x_trigger_insert_table_name
AFTER INSERT ON table_name
FOR EACH ROW
BEGIN
	INSERT INTO x_audit_log (by_user, event, table_name, table_primary_key, table_columns)
	VALUES (
		COALESCE(@x_triggered_by_user, NULL),
		1,
		'table_name',
		NEW.id,
		JSON_OBJECT(
			'col_1', NEW.col_1
		)
	);
END //

DELIMITER ;

DROP TRIGGER x_trigger_insert_table_name;



\! echo "-------------------------- x_trigger_update_table_name";
DELIMITER //

CREATE TRIGGER `x_trigger_update_table_name`
AFTER UPDATE ON `table_name`
FOR EACH ROW
BEGIN
	DECLARE JSON_TMP JSON DEFAULT JSON_OBJECT();

	-- Use the NULL‑safe operator <=> or add explicit IS NULL checks.
	IF NOT (OLD.col_1 <=> NEW.col_1) THEN
		SET JSON_TMP = JSON_SET(JSON_TMP, '$.col_1', JSON_ARRAY(OLD.col_1, NEW.col_1));
	END IF;

	IF JSON_LENGTH(JSON_TMP) > 0 THEN
		INSERT INTO x_audit_log (by_user, event, table_name, primary_key, table_columns)
		VALUES (COALESCE(@x_triggered_by_user, NULL), 2, 'table_name', OLD.id, JSON_TMP);
	END IF;
END //

DELIMITER;

DROP TRIGGER x_trigger_update_table_name;



\! echo "-------------------------- x_trigger_delete_table_name";
DELIMITER //

CREATE TRIGGER x_trigger_delete_table_name
AFTER DELETE ON table_name
FOR EACH ROW
BEGIN
	INSERT INTO x_audit_log (by_user, event, table_name, table_primary_key, table_columns)
	VALUES (
		COALESCE(@x_triggered_by_user, NULL),
		3,
		'table_name',
		OLD.id,
		JSON_OBJECT(
			'col_1', OLD.col_1
		)
	);
END //

DELIMITER ;

DROP TRIGGER x_trigger_delete_table_name;






-- Sample automation for trigger delete and re creating when new columns added to tables

-- DELIMITER //

-- CREATE PROCEDURE regen_user_update_trigger()
-- BEGIN
-- 	DECLARE v_cols   TEXT DEFAULT '';
-- 	DECLARE v_done   BOOL DEFAULT FALSE;
-- 	DECLARE cur CURSOR FOR
-- 		SELECT COLUMN_NAME
-- 		FROM   INFORMATION_SCHEMA.COLUMNS
-- 		WHERE  TABLE_SCHEMA = DATABASE()
-- 		AND  TABLE_NAME   = 'users'

-- 		-- skip sensitive column
-- 		AND  COLUMN_NAME <> 'password';

-- 	DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_done = TRUE;

-- 	OPEN cur;
-- 	read_loop:
-- 	LOOP
-- 		FETCH cur INTO @c;
-- 		IF v_done THEN LEAVE read_loop; END IF;

-- 		SET v_cols = CONCAT(
-- 			v_cols,
-- 			'IF NOT (OLD.', @c, ' <=> NEW.', @c, ') THEN ',
-- 				'SET j = JSON_SET(j, ''$.', @c, ''', JSON_ARRAY(OLD.', @c, ', NEW.', @c, ')); ',
-- 			'END IF; '
-- 		);
-- 	END LOOP;
-- 	CLOSE cur;

-- 	SET @sql = CONCAT(
-- 		'CREATE TRIGGER trg_users_upd AFTER UPDATE ON users FOR EACH ROW ',
-- 		'BEGIN ',
-- 			' DECLARE j JSON DEFAULT JSON_OBJECT(); ',
-- 			v_cols,
-- 			' IF JSON_LENGTH(j) > 0 THEN ',
-- 				'   INSERT INTO x_audit_log(by_user,event,table_name,table_primary_key,table_columns) ',
-- 				'   VALUES (COALESCE(@x_triggered_by_user,NULL),2,''users'',OLD.id,j); ',
-- 			' END IF; ',
-- 		'END'
-- 	);

-- 	DROP TRIGGER IF EXISTS trg_users_upd;
-- 	PREPARE stmt FROM @sql;
-- 	EXECUTE stmt;
-- 	DEALLOCATE PREPARE stmt;
-- END //

-- DELIMITER ;
