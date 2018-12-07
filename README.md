# cs360-project2

## How to start

```mysql
sudo mysql < DB_init.sql -u root -p
```

```mysql
sudo mysql < ExampleQuery.sql -u root -p --local-infile=1
```



- If you have problem in this step, you should check your file path in ExampleQuery.sql because it depends on your OS.
  - LOAD DATA LOCAL INFILE "PokeDB.csv"
  - LOAD DATA LOCAL INFILE "PokeSkillDB.csv" INTO TABLE SKILLS



```js
node app.js
```





## Contact

- If you have any problem in executing code, please contant us.
  - jihoon9030@kaist.ac.kr