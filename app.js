// CS360 project#2

var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var mysql = require('mysql'); // MySQL module on node.js

// var connection = mysql.createConnection({
//     host     : 'localhost',
//     port     : 3306,
//     user     : 'tester',
//     password : '1234',
//     database : 'cs360_team10',
// });

// connection.connect(); // Connection to MySQL

app.use('/', express.static(__dirname + '/public')); // you may put public js, css, html files if you want...
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended : true }));

// "node app.js" running on port 3000
app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});

// base url action: "http://localhost/" -> send "index.html" file.
app.get('/', function (req, res) {
	res.sendFile(__dirname + "/index.html");
});

