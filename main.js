#!/usr/bin/env node

var express = require('express');
var fs = require('fs');

var file = "blog.db";
var exists = fs.existsSync(file);

var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');

////////////////
//  Blog's API //
////////////////
var blog = require('./api.js');

///////////////////////
//  Http Server Code //
///////////////////////
app.use(bodyParser.json());
app.use(cors());

app.post('/', function(req, res){
    console.log('POST /');

    var data = req.body;
    console.dir(data);

    res.writeHead(200, {'Content-Type': 'application/json',
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'});

    switch(data.action){
      case "register":
        blog.register(res,data.name,data.username,data.password,data.email);
        break;
      case "login":
        blog.login(res, data.username, data.password);
        break;
      case "logout":
        blog.logout(res, data.accesstoken);
        break;
      case "getposts":
        blog.getPosts(res);
        break;
      case "getpost":
        blog.getPost(res, data.post_id);
        break;
      case "publishpost":
        blog.publishPost(res,data.title,data.content,data.category,data.accesstoken);
        break;
      case "editpost":
        blog.editPost(res,data.post_id,data.title,data.content,data.category,data.accesstoken);
        break;
      case "deletepost":
        blog.deletePost(res,data.post_id,data.accesstoken);
        break;
      default:
        break;
    }

    //res.end('thanks');
});

port = 8000;
app.listen(port);
console.log('Listening at http://localhost:' + port);
