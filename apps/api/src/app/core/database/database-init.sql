DROP DATABASE IF EXISTS sugarrush;
CREATE DATABASE sugarrush;

CREATE USER IF NOT EXISTS 'sugarrush'@'%' IDENTIFIED
WITH mysql_native_password BY 'Localdr0p1234';

GRANT ALL PRIVILEGES ON sugarrush.* TO 'sugarrush'@'%';

USE sugarrush;