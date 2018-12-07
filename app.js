// CS360 project#2
var express = require('express');
var session = require('express-session');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql'); // MySQL module on node.js

var server = require('http').createServer(app);
var io = require('socket.io')(server);

var Cryptr = require('cryptr');
var session = require('express-session');

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
// app.use('/', express.static(__dirname + '/'));
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended : true }));
app.use(session({
  key: 'sid',
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 24000 * 60 * 60 // 쿠키 유효기간 24시간
  }
}));

// "node app.js" running on port 3000
// app.listen(3000, function () {
// 	console.log('Example app listening on port 3000!');
// });

server.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
// var io = require('socket.io')(server);

// base url action: "http://localhost/" -> send "index.html" file.
app.get('/', function (req, res) {
    var sess;
    sess = req.session;

    var query = connection.query ('select * from POKEBOOK', function (err, rows) {
        if (err) { console.error (err); throw err; }
        res.render ('index', {
            data: rows,
            length: rows.length,
            name : sess.nickname
        });
    });
});

// login & register
app.get('/login', function (req, res) {
    var sess = req.session;
    var name = sess.name;

    res.render ('login', {
        name: sess.name
    });
});

// mypage  & its function
app.get('/mypage', function (req, res) {
    var sess = req.session;
    var name = sess.name;
    
    if (name) {
        var queryState = "SELECT P.img_path, P.name, POKEMON.atk, T.gold FROM POKEBOOK P, Trainer T, POKEMON WHERE T.user_id = POKEMON.user_id AND POKEMON.poke_no = P.poke_no AND T.user_id = ?";
        var aggregateSQL = "SELECT AVG(atk) AS avgAtk, COUNT(*) AS cnt FROM POKEMON WHERE user_id = ?";

        var query = connection.query (queryState, name, function (err, myInfo) {
            if (err) { console.error (err); throw err; }

            // aggregation query. To show average attak of POKEBOOKs.
            connection.query (aggregateSQL, [name], function (err, average) {
                res.render ('mypage', {
                    name: sess.nickname,
                    gold: myInfo[0].gold,
                    myPokemons: myInfo,
                    length: myInfo.length,
                    avgAtk: average[0].avgAtk,
                    count: average[0].cnt
                });
            });
        });
    } 
    else { res.redirect('/login'); }
    
});

app.get('/mypage/delete', function(req, res){
    var sess = req.session;
    var name = sess.name;
    connection.query('DELETE FROM TRAINER WHERE user_id=?', [name], function(err, data, fields){
        if(err) { console.error(err); throw err; }
        sess.destroy(function(err){
            res.redirect('/');
        });
    }); 
});

app.get('/api/logout', function(req, res){
    var sess = req.session;
    sess.destroy(function(err){
        res.redirect('/');
    });
});

app.get('/register', function (req, res) {
    res.render ('register');
});

app.post ('/api/search', function (req, res) {
    var sess = req.session;
    var queryState = 'select * from POKEBOOK ';
    
    condition = '"%' + req.body.search_data.trim() + '%"';
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
            length: rows.length,
            name: sess.nickname
        });
    });
});

app.post('/api/register', function(req, res){
    var encryptedString = cryptr.encrypt(req.body.password);
    var sql = "INSERT INTO TRAINER (user_id, user_pw, nickname) VALUES ?";
    var values = [
      [req.body.name, encryptedString, req.body.nickname]
    ];
    
    connection.query(sql, [values], function (err, result) {
      if (err) {console.error (err); throw err; }
      res.redirect ('/login');

    });
});

app.post('/api/login', function(req, res, next){
    var name=req.body.name;
    var password=req.body.password;

    connection.query('SELECT * FROM TRAINER WHERE user_id = ?', [name], function (error, results, fields) {
      if (error) {
          res.json({
            status:false,
            message:'there are some error with query'
            });
      } else {
        if (results.length >0){
            decryptedString = cryptr.decrypt(results[0].user_pw);

            if (password==decryptedString){
                req.session.name = name;
                req.session.nickname = results[0]["nickname"];
                res.redirect('/');
            }
            else{
                res.redirect('/login');
            }
        }
        else{
          res.redirect('/login');
        }
      }
    });
});

app.get('/shop', function (req, res) {
    var sess = req.session;
    var name = sess.name;
    var getGoldQuery = 'SELECT gold FROM TRAINER WHERE user_id=?';
    var updateGoldQuery = 'UPDATE TRAINER SET gold=? WHERE user_id=?';
 
    var insertQuery = 'INSERT INTO POKEMON(user_id, poke_no, skill1, atk)';
    var insertSubQuery = 'SELECT ';
    insertSubQuery = insertSubQuery + "'" + name + "', ";
    insertSubQuery = insertSubQuery + 'P.poke_no, S.skill_name, S.atk + 50 FROM POKEBOOK P, SKILLS S WHERE P.first_type=S.type OR P.second_type=S.type ORDER BY RAND() LIMIT 1';
    
    var FinalQuery = insertQuery + insertSubQuery;
    
    if (name)
    {
        connection.query(getGoldQuery, [name], function(err, result){
            if (err) { console.error(err); throw err; }
            gold = result[0].gold;

            if (gold <= 100)
            {
                res.send('<script type="text/javascript"> alert("돈이 없습니다! 탐험을 하세요!"); history.go(-1); </script>');
            }
            else
            {
                gold = gold - 100;
                connection.query(updateGoldQuery, [gold, name], function (err, data) {
                    if (err) { console.error(err); throw err; }
                    connection.query (FinalQuery, function (err, result) {
                        if (err) { console.error (err); throw err; }
                        res.redirect('/mypage');
                    });
                });
            }
        });
    } 
    else { res.redirect('/login'); }
});

app.get('/adventure', function(req, res){
    var sess = req.session;
    var name = sess.name;

    if (name)
    {
        var query = connection.query ('select * from trainer where user_id=?', [name], function (err, rows) {
            if (err) { console.error (err); throw err; }
            var current_time = new Date();
        
            if (rows[0].map != null && rows[0].end_time > current_time) {
                res.render('adventure_alert');
            } 
            else {
                res.render ('adventure', {
                name : sess.nickname
                });
            }
        });
    } 
    else { res.redirect('/login'); }
});

// listener which applied to each component in adventure page.
var adv_component_listener = function(req, res) 
{
    var sess = req.session;
    var name = sess.name;
    var urlComponent = req.url.split("/");
    var component = urlComponent[urlComponent.length - 1];

    if (name) {
        connection.query('SELECT * FROM MAPS WHERE map_name = ?', [component], function(err, info){
            if(err) { console.error(err); throw err; }
            var gold = info[0].gold;
            var time = info[0].time;
            var current_time = new Date();
            var end_time = new Date(current_time.getTime() + time * 1000);

            var updateQuery = 'UPDATE TRAINER SET gold=?, map=?, end_time=? WHERE user_id=?';

            connection.query('SELECT * FROM TRAINER WHERE user_id=?', [name], function(err, data){
                if(err) { console.error(err); throw err; }
                prior_gold = data[0].gold;
                gold = gold + prior_gold;

                connection.query(updateQuery, [gold, component, end_time, name], function(err, data) {
                    if(err) { console.error(err); throw err; }
                    res.redirect('/mypage');
                });
            });
        });        
    } 
    else { res.redirect('/login'); }
};

app.post('/adventure/city', adv_component_listener);
app.post('/adventure/desert', adv_component_listener);
app.post('/adventure/right_mountain', adv_component_listener);
app.post('/adventure/left_mountain', adv_component_listener);
app.post('/adventure/temple', adv_component_listener);
app.post('/adventure/grassland', adv_component_listener);
app.post('/adventure/ruin', adv_component_listener);

app.get('/ranking', function(req, res){
    var sess = req.session;
    var name = sess.name;
    if (name)
    {
        connection.query('SELECT nickname, gold FROM TRAINER ORDER BY gold DESC', function(err, data, fields){
            if(err) { console.error(err); throw err; }
            res.render("ranking", {
                data : data,
                length : data.length,
                name : sess.nickname
            });
        });
    } 
    else { res.redirect('/login'); }
     
});