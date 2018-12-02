USE cs360_team10;

LOAD DATA LOCAL INFILE "C:/Users/chldl/Desktop/cs360-project2/PokeDB.csv"
INTO TABLE POKEMON
FIELDS TERMINATED BY ","
IGNORE 1 LINES;

LOAD DATA LOCAL INFILE "C:/Users/chldl/Desktop/cs360-project2/PokeSkillDB.csv" INTO TABLE SKILLS
FIELDS TERMINATED BY ',';


INSERT INTO MAPS (map_name, type, gold, exp) VALUES ("city", "city", 100, 50);
INSERT INTO MAPS (map_name, type, gold, exp) VALUES ("desert", "desert", 100, 50);
INSERT INTO MAPS (map_name, type, gold, exp) VALUES ("right_mountain", "right_mountain", 100, 50);
INSERT INTO MAPS (map_name, type, gold, exp) VALUES ("left_mountain", "left_mountain", 100, 50);
INSERT INTO MAPS (map_name, type, gold, exp) VALUES ("temple", "temple", 100, 50);
INSERT INTO MAPS (map_name, type, gold, exp) VALUES ("grassland", "grassland", 100, 50);
INSERT INTO MAPS (map_name, type, gold, exp) VALUES ("ruin", "ruin", 100, 50);