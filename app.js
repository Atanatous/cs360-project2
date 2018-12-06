// CS360 project#2
var express = require('express');
var session = require('express-session');
var app = express();
var bodyParser = require('body-parser')
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

    var query = connection.query ('select * from pokemon', function (err, rows) {
        if (err) { console.error (err); throw err; }
        res.render ('index', {
            data: rows,
            length: rows.length,
            name : sess.name
        });
    });
});

// login & register
app.get('/login', function (req, res) {
    var sess = req.session;
    var name = sess.name;

    res.render ('login', {
        name: sess.name
    })
});

// mypage  & its function
app.get('/mypage', function (req, res) {
    var sess = req.session;
    var name = sess.name;
    var queryState = "SELECT P.img_path, P.name, Possess.atk, T.gold FROM Pokemon P, Trainer T, POSSESS WHERE T.user_id = Possess.user_id AND Possess.poke_no = P.poke_no AND T.user_id = ?";
    var aggregateSQL = "SELECT AVG(atk) AS avgAtk FROM POSSESS WHERE user_id = ?";

    var query = connection.query (queryState, name, function (err, myInfo) {
        if (err) { console.error (err); throw err; }

        // aggregation query. To show average attak of pokemons.
        connection.query (aggregateSQL, [name], function (err, average) {
            res.render ('mypage', {
                name: sess.name,
                gold: myInfo[0].gold,
                myPokemons: myInfo,
                length: myInfo.length,
                avgAtk: average[0].avgAtk
            });
        });
    });
});

app.get ('/mypage/edit', function (req, res) {
    var sess = req.session;
    
    res.render ('mypage-edit', {
        name: sess.name
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
    var queryState = 'select * from pokemon ';
    
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
            name: sess.name
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

app.get('/skills', function (req, res) {
    var query = connection.query ('select * from skills', function (err, rows) {
        if (err) { console.error (err); throw err; }
        res.render ('skill_index', {
            rows: rows
        });
    });
});

app.post('/api/mypage', function(req,res){
    var sql = 'UPDATE TRAINER SET nickname=?, user_pw=? WHERE user_id=?';
    var encryptedString = cryptr.encrypt(req.body.password);
    var params = [req.body.nickname, encryptedString, req.session.name];

    connection.query(sql, params, function(err, rows, fields) {
        if(err){ console.error(err); throw (err); }
        console.log(rows);
        req.session.destroy(function(err) {
            res.redirect('/');
        });
    });
});

app.get('/shop', function (req, res) {
    var sess = req.session;
    var name = sess.name;
    var getGoldQuery = 'SELECT gold FROM TRAINER WHERE user_id=?';
    var updateGoldQuery = 'UPDATE TRAINER SET gold=? WHERE user_id=?';
 
    var insertQuery = 'INSERT INTO POSSESS(user_id, poke_no, skill1, atk)';
    var insertSubQuery = 'SELECT ';
    insertSubQuery = insertSubQuery + "'" + name + "', ";
    insertSubQuery = insertSubQuery + 'P.poke_no, S.skill_name, S.atk FROM POKEMON P, SKILLS S WHERE P.first_type=S.type OR P.second_type=S.type ORDER BY RAND() LIMIT 1';
    
    var FinalQuery = insertQuery + insertSubQuery;
    
    if (name)
    {
        connection.query(getGoldQuery, [name], function(err, result){
            if (err) { console.error(err); throw err; }
            gold = result[0].gold;

            if (gold <= 100)
            {
                // TODO: 돈 없을 시 확인창 띄우기로 변경.
                res.redirect('/adventure');
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
    var sess;
    sess = req.session;

    var query = connection.query ('select * from pokemon', function (err, rows) {
        if (err) { console.error (err); throw err; }
        res.render ('adventure', {
            data: rows,
            length: rows.length,
            name : sess.name
        });
    });
});

// listener which applied to each component in adventure page.
var adv_component_listener = function(req, res) 
{
    var sess = req.session;
    var name = sess.name;
    var urlComponent = req.url.split("/");
    var component = urlComponent[urlComponent.length - 1];

    if (name) {
        connection.query('SELECT * FROM POSSESS WHERE user_id = ?', [name], function (err, myInfo) {
            if(err) { console.error(err); throw err; }

            pokemonNum = myInfo.length;
            randNum = getRandomInt(0, myInfo.length-1);
            name = myInfo[randNum].user_id;

            connection.query('SELECT * FROM MAPS WHERE map_name = ?', [component], function(err, info){
                if(err) { console.error(err); throw err; }
                console.log(info);
                gold = info[0].gold;
                sql_gold = 'UPDATE TRAINER SET gold=? WHERE user_id=?';
                sql_map = 'UPDATE POSSESS SET map=? WHERE user_id=?';

                connection.query('SELECT * FROM TRAINER WHERE user_id = ?', [name], function(err, data){
                    if(err) { console.error(err); throw err; }
                    prior_gold = data[0].gold;
                    gold = gold + prior_gold;

                    connection.query(sql_gold, [gold, name], function(err, data){
                        if(err) { console.error(err); throw err; }
                        connection.query(sql_map, ["city", name], function(err, data){
                            if(err) { console.error(err); throw err; }
                            res.redirect('/adventure');
                        });
                    });
                });
            });        
        }); 
    } 
    else { res.redirect('/login'); }
}

app.get('/adventure/city', adv_component_listener);
app.get('/adventure/desert', adv_component_listener);
app.get('/adventure/right_mountain', adv_component_listener);
app.get('/adventure/left_mountain', adv_component_listener);
app.get('/adventure/temple', adv_component_listener);
app.get('/adventure/grassland', adv_component_listener);
app.get('/adventure/ruin', adv_component_listener);


/************************
    PlayGround Functions
*************************/

function getRandomInt(min, max) { //min ~ max 사이의 임의의 정수 반환
    return Math.floor(Math.random() * (max - min)) + min;
}

app.post('/wrongAlert', function(req, res, next){
    res.send('<script type="text/javascript">alert("없는 아이디이거나 틀린 비밀번호입니다.");</script>');
});


var playerList = {};

app.get('/play', function(req, res){
    var sess = req.session;
    name = sess.name;
    if(name){
        connection.query('SELECT * FROM TRAINER WHERE user_id = ?', [name], function (error, results, fields) {
            console.log("In play user's nickname :" + results[0].nickname);
            sess.nickname = results[0].nickname;
            res.render('play', {
                nickname : sess.nickname,
                name : sess.name
            });
        });
    }else{
        res.redirect('/login');
    }
});

io.on('connection', function(socket){
    socket.on('nameCheck', function(name){
        console.log("nameCheck IN");
        function chkNameDuplicated(name){
          for(var p in playerList)
            if(playerList[p].name == name)
              return false;
          return false;
    }
    if(chkNameDuplicated(name)){
      console.log("Name "+name+" duplicate");
      socket.emit('loginFail', null);
      return;
    }
    console.log("To loginSuccess server");
    socket.emit('loginSuccess', name);
  });

  socket.on('login', function(data){
    console.log("Client logged-in:\n name:"+data.name+"\n socket id: "+socket.id);

    socket.name = data.name;
    socket.broadcast.emit('anotherUser', data);

    for(var socketid in playerList){
      var playerData = playerList[socketid];
      console.log("user already exists : "+playerData.name);
      socket.emit('anotherUser', playerData);
    }
    playerList[socket.id] = data;
  });

  socket.on('move', function(data){
    socket.broadcast.emit('move', data);
  });

  socket.on('chat', function (data) {
    console.log('Messsage from '+ data.name+' : '+data.chat);
    socket.broadcast.emit('chat', data);
  });
  socket.on('msg', function(data){
    console.log('Message from '+ data.from + " to " + data.to +" "+ data.chat);
    let flag = true;
    for(var socketid in playerList){
      var playerData = playerList[socketid];
      if(playerData.name == data.to){
        flag = false;
        io.to(socketid).emit('msg', data);
      }
    }
    if(flag){
      socket.emit('noUser', data);
      console.log('There is no '+ data.to);
    }
  });

  socket.on('forceDisconnect', function () {
    socket.disconnect();
  });

  socket.on('disconnect', function () {
    console.log('user disconnected: '+socket.name);
    delete playerList[socket.id];
    io.emit('logout', socket.name);
  });
});

app.get('/play/mypage', function(req, res){
    res.redirect('/');
});

app.get('/play/return', function(req,res){
    res.redirect('/');
});

app.get('/play/logout', function(req,res){
    res.redirect('/api/logout');
});
