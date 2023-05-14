DROP DATABASE IF EXISTS localdrop;
CREATE DATABASE localdrop;

CREATE USER IF NOT EXISTS 'localdrop'@'%' IDENTIFIED
WITH mysql_native_password BY 'Localdr0p1234';

GRANT ALL PRIVILEGES ON localdrop.* TO 'localdrop'@'%';

USE localdrop;