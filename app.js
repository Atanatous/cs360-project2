// CS360 project#2

var express = require('express');
var session = require('express-session');
var app = express();
var bodyParser = require('body-parser')
var mysql = require('mysql'); // MySQL module on node.js

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
app.use(session ({
    secret: '@#@$MYSIGN#@$#$',
    resave: false,
    saveUninitialized: true
}));

// "node app.js" running on port 3000
app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});

// base url action: "http://localhost/" -> send "index.html" file.
app.get('/', function (req, res) {
    var sess;
    sess = req.session;

    var query = connection.query ('select * from pokemon', function (err, rows) {
        if (err) { console.error (err); throw err; }
        res.render ('index', {
            data: rows,
            length: rows.length,
            username: sess.username
        });
    });
});

// search function of base page
app.post('/api/search', function (req, res) {
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

// login page & its function
app.get('/login', function (req, res) {
    var sess;
    sess = req.session;

    res.render ('login', {
        username: sess.username
    });
});

app.post ('/api/login', function (req, res) {
    var sess, queryState;
    sess = req.session;
    queryState = 'select * from trainer where user_id = ';
    queryState = queryState + '"' + req.body.id + '"';

    var query = connection.query (queryState, function (err, rows) {
        if (err) { console.error (err); throw err; }
        if (rows.length == 0) {
            console.log ("There is no such ID");
            res.redirect ('/');
        } else if (req.body.password == rows[0]['user_pw']) {
            console.log(String.format("It is password : %s ", req.body.password));
            sess.username = rows[0]['nickname'];
            res.redirect('/');
        } else {
            res.redirect('/');
        }
    });
});

// registration page & its function
app.get('/sign_up', function (req, res) {
    var sess;
    sess = req.session;

    res.render('sign_up', {
        username: sess.username
    });
});

app.post('/api/sign_up', function (req, res) {
    var sess, searchQeury, registerQuery;
    searchQeury = 'select * from trainer where user_id = ';
    searchQeury = searchQeury + '"' + req.body.id + '"';
    registerQuery = 'insert into trainer(user_id, user_pw, gold, nickname) values (';
    registerQuery = registerQuery + '"' + req.body.id + '",';
    registerQuery = registerQuery + '"' + req.body.password + '", 0, ';
    registerQuery = registerQuery + '"' + req.body.nickname + '")';

    var query = connection.query (searchQeury, function (err, rows) {
        if (err) { console.error (err); throw err; }
    });
});

// if login success, show mypage.
app.get('/mypage', function (req, res) {
    var sess;
    sess = req.session;

    res.render ('mypage', {
        username: sess.username
    });
});




