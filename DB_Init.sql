CREATE DATABASE IF NOT EXISTS cs360_team10;
USE cs360_team10;

CREATE USER IF NOT EXISTS 'tester'@'localhost' IDENTIFIED BY '1234';
GRANT ALL PRIVILEGES ON cs360_team10.* TO 'tester'@'localhost';

ALTER DATABASE cs360_team10 DEFAULT CHARACTER SET utf8;

CREATE TABLE IF NOT EXISTS TRAINER (
    uid         MEDIUMINT   NOT NULL AUTO_INCREMENT,
	user_id     VARCHAR(32) NOT NULL,
	user_pw     VARCHAR(32) NOT NULL,
	gold        INT         NOT NULL,
	nickname    VARCHAR(32) NOT NULL,
	PRIMARY KEY (uid)
);

CREATE TABLE IF NOT EXISTS POKEMON (
    poke_no     MEDIUMINT   NOT NULL,
    name        VARCHAR(20) NOT NULL,
    first_type  VARCHAR(20) NOT NULL,
    second_type VARCHAR(20),
    img_path    VARCHAR(20),
    PRIMARY KEY (poke_no)
);

CREATE TABLE IF NOT EXISTS POSSESS (
    uid         MEDIUMINT   NOT NULL,
    poke_no     MEDIUMINT   NOT NULL,
    skill1      VARCHAR(20) NOT NULL,
    skill2      VARCHAR(20),
    map         VARCHAR(20),
    FOREIGN KEY (uid) REFERENCES TRAINER(uid),
    FOREIGN KEY (poke_no) REFERENCES POKEMON(poke_no)
);

