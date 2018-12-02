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

app.get('/login', function (req, res) {
    console.log("Welcome login");
    var sess = req.session;
    var name = sess.name;
    console.log(name);
    if(name){
        res.render('mypage', {
            name : name
        });
    }else{
        res.render ('login');    
    }
});

app.get('/api/logout', function(req, res){
    var sess = req.session;
    console.log("Logout : " + sess.name);
    sess.destroy(function(err){
        res.redirect('/');
    });
});

app.get('/register', function (req, res) {
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
            length: rows.length,
            username: sess.username
        });
    });
});

app.post('/api/register', function(req, res){
    var encryptedString = cryptr.encrypt(req.body.password);
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
                console.log("Login Success, User name :" + name);
                req.session.name = name;
                res.redirect('/');
            }else{
                // res.send('<script type="text/javascript">alert("없는 아이디이거나 틀린 비밀번호입니다.");</script>');
                res.redirect('/login', );
            }
          
        }
        else{
          // res.send('<script type="text/javascript">alert("없는 아이디이거나 틀린 비밀번호입니다.");</script>');
          res.redirect('/login');
        }
      }
    });
});

app.get('/play', function(req, res){
    var sess = req.session;
    name = sess.name;
    if(name){
        connection.query('SELECT * FROM TRAINER WHERE user_id = ?', [name], function (error, results, fields) {
            console.log("In play user's nickname :" + results[0].nickname);
            sess.nickname = results[0].nickname;

            // res.render('test');
            res.render('play', {
                nickname : sess.nickname,
                name : sess.name
            });
        });    
    }else{
        res.redirect('/login');
    }
});

app.post('/api/mypage', function(req,res){
    // if(req.body.user_pw.length==0){
    //     var sql = 'UPDATE TRAINER SET nickname=?, WHERE id=?';
    //     // var encryptedString = cryptr.encrypt(req.body.password);
    //     var params = [req.body.nickname];    
    // }else{
    //     var sql = 'UPDATE TRAINER SET nickname=?, user_pw=? WHERE id=?';
    //     var encryptedString = cryptr.encrypt(req.body.password);
    //     var params = [req.body.nickname, encryptedString];    
    // }
    var sql = 'UPDATE TRAINER SET nickname=?, user_pw=? WHERE user_id=?';
    var encryptedString = cryptr.encrypt(req.body.password);
    var params = [req.body.nickname, encryptedString, req.session.name];

    connection.query(sql, params, function(err, rows, fields){
    if(err){
        console.log(err);
    } else {
        console.log(rows);
        req.session.destroy(function(err){
            res.redirect('/');
        });
    }
})
});



app.post('/wrongAlert', function(req, res, next){
    res.send('<script type="text/javascript">alert("없는 아이디이거나 틀린 비밀번호입니다.");</script>');
});


var playerList = {};

io.on('connection', function(socket){
    // var temp_socket = socket;
    // socket.on('test', function(name){
    //     console.log("TEST SOCKET");
    // });
    console.log("EMIT TEST START");
    socket.emit('testemit');
    console.log("EMIT");

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