CREATE USER 'sample_user'@'localhost' IDENTIFIED BY 'sample_password';
GRANT ALL PRIVILEGES ON sample_database.* TO 'sample_user'@'localhost';
