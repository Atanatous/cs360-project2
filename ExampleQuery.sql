USE cs360_team10;

LOAD DATA LOCAL INFILE "C:/Users/chldl/Desktop/cs360-project2/PokeDB.csv"
INTO TABLE POKEMON
FIELDS TERMINATED BY ","
IGNORE 1 LINES;

LOAD DATA LOCAL INFILE "C:/Users/chldl/Desktop/cs360-project2/PokeSkillDB.csv" INTO TABLE SKILLS
FIELDS TERMINATED BY ',';
