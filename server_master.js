//mysql부분
var fs = require('fs');
var ejs = require('ejs');
var mysql = require('mysql');

var express = require('express');

//mysql부분 폼태그데이터 넘겨받기
var bodyParser = require('body-parser');

//mysql 연결~
var client = mysql.createConnection({
    user:'root',
    password:'비미르번호를 입력하세요',
    database: 'Post'
});

var app = express();

//mysql 바디파서관련
app.use(bodyParser.urlencoded({
    extended: false
}));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.use(express.static(__dirname + '/public'));
app.use('/show_kitten', function(request, response){
    response.writeHead(200, {'content-Type':'text/html'});
    response.end('<img src="/kitten.jpg">');
});

//create form get
app.get('/create', function(request, response){
    fs.readFile('create.ejs', 'utf8', function(error,data) {
        response.send(data);
    });
});

//create form post
app.post('/create', function(request, response){
    var body = request.body;

    client.query('INSERT INTO posts (user, contents) VALUES (?, ?)', [body.user, body.contents], function(){
        response.redirect('/read')
    });
});

//read post
app.get('/read', function(request, response){
    fs.readFile('read.ejs','utf8',function(error,data){
        client.query('SELECT * FROM posts', function(error, results){
            response.send(ejs.render(data, {
                data: results
            }));
        });
    });
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});