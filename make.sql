DROP DATABASE IF EXISTS scoreboard;
DROP USER IF EXISTS scoreboard_user@localhost;

CREATE DATABASE scoreboard CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER scoreboard_user@localhost IDENTIFIED BY '#SNAK78quol093edd2';
GRANT ALL PRIVILEGES ON scoreboard.* TO scoreboard_user@localhost;
