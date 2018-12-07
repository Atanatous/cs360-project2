CREATE DATABASE IF NOT EXISTS cs360_team10;
USE cs360_team10;

CREATE USER IF NOT EXISTS 'tester'@'localhost' IDENTIFIED BY '1234';
GRANT ALL PRIVILEGES ON cs360_team10.* TO 'tester'@'localhost';

ALTER DATABASE cs360_team10 DEFAULT CHARACTER SET euckr;

CREATE TABLE IF NOT EXISTS MAPS (
    map_name    VARCHAR(20) NOT NULL,
    gold        INT         NOT NULL,
    time        INT         NOT NULL,
    PRIMARY KEY (map_name)
);

CREATE TABLE IF NOT EXISTS TRAINER (
	user_id     VARCHAR(32)  NOT NULL ,
	user_pw     VARCHAR(300) NOT NULL,
	gold        INT          DEFAULT 0,
	nickname    VARCHAR(32)  NOT NULL,
    map         VARCHAR(20),
    end_time    DATETIME,
	PRIMARY KEY (user_id),
    FOREIGN KEY (map)       REFERENCES MAPS(map_name)
);

CREATE TABLE IF NOT EXISTS POKEBOOK (
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

CREATE TABLE IF NOT EXISTS POKEMON (
    user_id     VARCHAR(32) NOT NULL,
    poke_no     MEDIUMINT   NOT NULL,
    skill1      VARCHAR(20) NOT NULL,
    skill2      VARCHAR(20),
    atk         INT,
    FOREIGN KEY (user_id) REFERENCES TRAINER(user_id) ON DELETE CASCADE,
    FOREIGN KEY (poke_no) REFERENCES POKEBOOK(poke_no)
);

CREATE TABLE IF NOT EXISTS SKILLS (
    skill_name  VARCHAR(20) NOT NULL,
    type        VARCHAR(20) NOT NULL,
    atk         INT         NOT NULL,
    PRIMARY KEY (skill_name)
);

DELIMITER //
CREATE TRIGGER after_register 
    AFTER INSERT ON TRAINER
    FOR EACH ROW 
BEGIN
    DECLARE pokeNo MEDIUMINT;
    DECLARE skill VARCHAR(20);
    DECLARE attack INT;
    DECLARE type1 VARCHAR (20);
    DECLARE type2 VARCHAR (20);

    SELECT poke_no, first_type, second_type INTO pokeNO, type1, type2 from POKEBOOK ORDER BY RAND() LIMIT 1;
    SELECT skill_name, atk INTO skill, attack from SKILLS where type=type1 or type=type2 LIMIT 1;
    
    INSERT INTO POKEMON(user_id, poke_no, skill1, atk) VALUES (NEW.user_id, pokeNo, skill, attack);
END //
DELIMITER ;
    