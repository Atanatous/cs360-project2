USE cs360_team10;

LOAD DATA LOCAL INFILE "C:/Users/chldl/OneDrive/Workspace/Assignment/DBProject/PokeDB.csv"
INTO TABLE POKEMON
FIELDS TERMINATED BY ","
IGNORE 1 LINES;

LOAD DATA LOCAL INFILE "C:/Users/chldl/OneDrive/Workspace/Assignment/DBProject/PokeSkillDB.csv" INTO TABLE SKILLS
FIELDS TERMINATED BY ',';
