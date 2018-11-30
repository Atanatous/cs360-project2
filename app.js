// CS360 project#2
var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var mysql = require('mysql'); // MySQL module on node.js

var Cryptr = require('cryptr');
cryptr = new Cryptr('myTotalySecretKey');

var connection = mysql.createConnection({
    host     : 'localhost',
    port     : 3306,
    user     : 'tester',
    password : '1234',
    database : 'cs360_team10',
});

connection.connect(); // Connection to MySQL

// setting to template engine as 'ejs'
app.set ('views', __dirname + '/views');
app.set ('view engine', 'ejs');
app.engine ('html', require('ejs').renderFile);

app.use('/', express.static(__dirname + '/public')); // you may put public js, css, html files if you want...
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended : true }));

// "node app.js" running on port 3000
app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});

// base url action: "http://localhost/" -> send "index.html" file.
app.get('/', function (req, res) {
    var query = connection.query ('select * from pokemon', function (err, rows) {
        if (err) { console.error (err); throw err; }
        res.render ('index', {
            data: rows,
            length: rows.length
        });
    });
});

app.get('/login', function (req, res) {
    console.log("login");
    res.render ('status');
});

app.get('/register', function (req, res) {
    console.log("register");
    res.render ('register');
});


app.post ('/api/search', function (req, res) {
    var queryState = 'select * from pokemon ';
    condition = '"%' + req.body.search_data + '%"';
    queryState = queryState + 'where name like ' + condition;
    queryState = queryState + ' or prop2 like ' + condition;
    queryState = queryState + ' or prop1 like ' + condition;
    queryState = queryState + ' or category like ' + condition;
    queryState = queryState + ' or first_type like ' + condition;
    queryState = queryState + ' or second_type like ' + condition;
    
    var query = connection.query (queryState, function (err, rows) {
        if (err) { console.error (err); throw err; }
        res.render ('index', {
            data: rows,
            length: rows.length
        });
    });
});

app.post('/api/register', function(req, res){
    var encryptedString = cryptr.encrypt(req.body.password);
    var users={
        "name":req.body.name,
        "nickname":req.body.nickname,
        "password":encryptedString
    }
    var sql = "INSERT INTO TRAINER (user_id, user_pw, gold ,nickname) VALUES ?";
    var values = [
      [req.body.name, encryptedString, 0, req.body.nickname]
    ];
    console.log("Insert query: " + values);
    connection.query(sql, [values], function (err, result) {
      if (err) throw err;
      console.log("Number of records inserted: " + result.affectedRows);
    });
    res.redirect('/login');
});


app.post('/api/login', function(req, res, next){
    var name=req.body.name;
    var password=req.body.password;
   
    connection.query('SELECT * FROM TRAINER WHERE user_id = ?', [name], function (error, results, fields) {
      if (error) {
          res.json({
            status:false,
            message:'there are some error with query'
            })
      }else{
       
        if(results.length >0){
            console.log(results[0].user_pw);
            decryptedString = cryptr.decrypt(results[0].user_pw);
            console.log(decryptedString);
            if(password==decryptedString){
                res.redirect('/');
            }else{
                res.send('<script type="text/javascript">alert("없는 아이디이거나 틀린 비밀번호입니다.");</script>');
                // res.redirect('/login');
            }
          
        }
        else{
          res.send('<script type="text/javascript">alert("없는 아이디이거나 틀린 비밀번호입니다.");</script>');
          // res.redirect('/login');
        }
      }
    });
});


app.post('/wrongAlert', function(req, res, next){
    res.send('<script type="text/javascript">alert("없는 아이디이거나 틀린 비밀번호입니다.");</script>');
});
