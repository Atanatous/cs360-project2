USE cs360_team10;

LOAD DATA LOCAL INFILE "PokeDB.csv"
INTO TABLE POKEBOOK
FIELDS TERMINATED BY ","
IGNORE 1 LINES;

LOAD DATA LOCAL INFILE "PokeSkillDB.csv" INTO TABLE SKILLS
FIELDS TERMINATED BY ',';


INSERT INTO MAPS (map_name, gold, time) VALUES ("city", 100, 5);
INSERT INTO MAPS (map_name, gold, time) VALUES ("desert", 150, 10);
INSERT INTO MAPS (map_name, gold, time) VALUES ("right_mountain", 200, 20);
INSERT INTO MAPS (map_name, gold, time) VALUES ("left_mountain", 200, 20);
INSERT INTO MAPS (map_name, gold, time) VALUES ("temple", 250, 25);
INSERT INTO MAPS (map_name, gold, time) VALUES ("grassland", 300, 30);
INSERT INTO MAPS (map_name, gold, time) VALUES ("ruin", 600, 60);