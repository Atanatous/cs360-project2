CREATE DATABASE IF NOT EXISTS cs360_team10;
USE cs360_team10;

CREATE USER IF NOT EXISTS 'tester'@'localhost' IDENTIFIED BY '1234';
GRANT ALL PRIVILEGES ON cs360_team10.* TO 'tester'@'localhost';

ALTER DATABASE cs360_team10 DEFAULT CHARACTER SET euckr;

CREATE TABLE IF NOT EXISTS TRAINER (
    uid         MEDIUMINT   NOT NULL AUTO_INCREMENT,
	user_id     VARCHAR(32) NOT NULL UNIQUE,
	user_pw     VARCHAR(300) NOT NULL,
	gold        INT         DEFAULT 0,
	nickname    VARCHAR(32) NOT NULL,
	PRIMARY KEY (uid)
);

CREATE TABLE IF NOT EXISTS POKEMON (
    poke_no     MEDIUMINT   NOT NULL,
    name        VARCHAR(20) NOT NULL,
    first_type  VARCHAR(20) NOT NULL,
    second_type VARCHAR(20),
    img_path    VARCHAR(100),
    height      VARCHAR(20),
    weight      VARCHAR(20),
    category    VARCHAR(20),
    prop1       VARCHAR(20),
    prop2       VARCHAR(20),
    PRIMARY KEY (poke_no)
);

CREATE TABLE IF NOT EXISTS POSSESS (
    uid         MEDIUMINT   NOT NULL,
    poke_no     MEDIUMINT   NOT NULL,
    skill1      VARCHAR(20) NOT NULL,
    skill2      VARCHAR(20),
    map         VARCHAR(20),
    atk         INT         NOT NULL,
    FOREIGN KEY (uid) REFERENCES TRAINER(uid),
    FOREIGN KEY (poke_no) REFERENCES POKEMON(poke_no)
);

CREATE TABLE IF NOT EXISTS SKILLS (
    skill_name  VARCHAR(20) NOT NULL,
    type        VARCHAR(20) NOT NULL,
    atk         INT         NOT NULL,
    PRIMARY KEY (skill_name)
);

CREATE TABLE IF NOT EXISTS MAPS (
    map_name    VARCHAR(20) NOT NULL,
    type        VARCHAR(20) NOT NULL,
    gold        INT         NOT NULL,
    exp         INT         NOT NULL,
    PRIMARY KEY (map_name)
);
