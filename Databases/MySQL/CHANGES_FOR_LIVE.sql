\! clear
\W

USE [NAME];

ALTER TABLE disabled_notification_events
	ADD COLUMN `via_in_app` BIT(1) NOT NULL DEFAULT b'0' AFTER `event`,
	ADD COLUMN `via_eMail` BIT(1) NOT NULL DEFAULT b'0' AFTER `via_in_app`,
	ADD COLUMN `via_SMS` BIT(1) NOT NULL DEFAULT b'0' AFTER `via_eMail`;