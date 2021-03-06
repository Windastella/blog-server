#!/usr/bin/env node
//////////////////////////////////////////////////////////////////////
//  Author:Nik Mirza                                                //
//  Contact: nik96mirza[at]gmail.com                                //
//  Module Name: api.js                                             //
//  Description: A module containing the Blog's Api implementation  //
//  Date Created: 4 January 2016                                    //
//////////////////////////////////////////////////////////////////////

///////////////////////////
//  SQLite Client Library //
///////////////////////////
var os = require('os');
var fs = require("fs");
var file = os.homedir() + "/blog.db";
var exists = fs.existsSync(file);

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);

//Create if doesn't exist
if(!exists) {
  console.log("Creating DB file.");
  fs.openSync(file, "w");

  db.run("CREATE TABLE `author`\
  (`author_id` INT NOT NULL,\
    `display_name` TEXT NOT NULL,\
    `username` VARCHAR(150) NOT NULL,\
    `password` TEXT NOT NULL,\
    `email` VARCHAR(150) NOT NULL, \
    `accesstoken` TEXT,\
    PRIMARY KEY (`author_id`),\
    UNIQUE (`username`),\
    UNIQUE (`email`)\
  );",[],function(err){
    if (!err) {
  		console.log("Table author created successfully");
  	} else {
  		console.log("Error creating table: " + err);
  	}
  });

  db.run("CREATE TABLE `post`\
  (`post_id` INT NOT NULL,\
    `title` TEXT NOT NULL,\
    `content` TEXT NOT NULL,\
    `date_published` DATE NOT NULL,\
    `featured` BOOLEAN NOT NULL,\
    `enabled` BOOLEAN NOT NULL,\
    `views` INT NOT NULL,\
    `author_id` INT NOT NULL,\
    PRIMARY KEY (`post_id`),\
    FOREIGN KEY (`author_id`) REFERENCES `author`(`author_id`)\
  );",[],function(err){
    if (!err) {
  		console.log("Table post created successfully");
  	} else {
  		console.log("Error creating table: " + err);
  	}
  });

  db.run("CREATE TABLE `category`\
  (`category_id` INT NOT NULL,\
    `name` VARCHAR(150) NOT NULL,\
    `enabled` BOOLEAN NOT NULL,\
    PRIMARY KEY (`category_id`),\
    UNIQUE (`name`)\
  );",[],function(err){
    if (!err) {
  		console.log("Table category created successfully");
  	} else {
  		console.log("Error creating table: " + err);
  	}
  });

  db.run("CREATE TABLE `post_to_category`\
  (`post_id` INT NOT NULL,\
    `category_id` INT NOT NULL,\
    FOREIGN KEY (`post_id`) REFERENCES post(`post_id`),\
    FOREIGN KEY (`category_id`) REFERENCES category(`category_id`)\
  );",[],function(err){
    if (!err) {
  		console.log("Table post_to_category created successfully");
  	} else {
  		console.log("Error creating table: " + err);
  	}
  });
}

var msg = {
  status:0,
  msg:"",
  data:[]
}
//////////////////////////
//  Synchronize Library //
//////////////////////////
var sync = require('synchronize');

//////////////////////////////
//  Password Hash Algorithm //
//////////////////////////////
var bcrypt = require('bcrypt');

var passwordHash = {
  crypt:function(password) {
    return bcrypt.hashSync(password, 10);
  },
  verify:function(password, userPassword, callback) {
    return bcrypt.compareSync(password, userPassword);
 }
};

//////////////////////////////////////////////
//  Random Accesstoken Generation Algorithm //
//////////////////////////////////////////////
var rand_token = require('rand-token');

/////////////////////////////
// Blog API Implementation //
/////////////////////////////
module.exports = {

  register:function(res, name, username, password, email){
    sync.fiber(function(){
      var id = 0;
      var rows;

      username = username.toLowerCase();
      email = email.toLowerCase();
      password = passwordHash.crypt(password);

      rows = sync.await(db.all('SELECT MAX(`author_id`) ID FROM `author`;',[],sync.defer()));
      id = rows[0].ID + 1;

      rows = sync.await(db.all("SELECT `email`, `username` FROM `author`;",[],sync.defer()));

      for(var i = 0; i < rows.length; i++ ){
        if (rows[i].email == email || rows[i].username == username){
          msg.msg = "User Already exist";
          msg.status = 0;
          msg.data = [];
          res.end(JSON.stringify(msg));
          break;
        }
      }

      sync.await(db.run("INSERT INTO `author`(`author_id`,`display_name`,`username`,`password`,`email`)\
    	VALUES (?,?,?,?,?);",[id,name,username,password,email],sync.defer()));

      msg.msg = "Register Successfull";
      msg.status = 1;
      msg.data = [];
      res.end(JSON.stringify(msg));
    });
  },

  login:function(res,username,password){
    sync.fiber(function(){
      username = username.toLowerCase();

      var verified = false;
      var id = 0;

      var rows = sync.await(db.all("SELECT `author_id` ID,`email`, `username`,`password` FROM `author`;",[],sync.defer()));
      //console.log(rows);
      for(var i = 0; i <rows.length; i++){
        if (rows[i].email == username || rows[i].username == username){
          if(passwordHash.verify(password,rows[i].password)){
            verified = true;
            id = rows[i].ID;
            break;
          }
        }
      }

      if(verified){
        var accesstoken = rand_token.generate(16);
        sync.await(db.run("UPDATE `author`\
        SET `accesstoken`=?\
        WHERE `author_id`=?;",[accesstoken,id],sync.defer()));

        msg.msg = "Login Successfull";
        msg.status = 1;
        msg.data = {accesstoken:accesstoken};
        res.end(JSON.stringify(msg));

      }else{
        msg.msg = "Not Registered";
        msg.status = 0;
        msg.data = [];
        res.end(JSON.stringify(msg));
      }
    });
  },

  logout:function(res, accesstoken){
    sync.fiber(function(){
      var verified = false;
      var id = 0;

      var rows = sync.await(db.all("SELECT `author_id` ID, `accesstoken` TOKEN FROM `author`;",[],sync.defer()));
      for(var i = 0; i <rows.length; i++){
        if (rows[i].TOKEN == accesstoken){
          verified = true;
          id = rows[i].ID;
          break;
        }
      }

      if(verified){
        sync.await(db.run("UPDATE `author`\
        SET `accesstoken`=NULL\
        WHERE `author_id`= ?;",[id],sync.defer()));

        msg.msg = "User Logged Out";
        msg.status = 1;
        msg.data = [];
        res.end(JSON.stringify(msg));

      }else{
        msg.msg = "Login Expired";
        msg.status = 0;
        msg.data = [];
        res.end(JSON.stringify(msg));
      }
    });
  },

  getPosts:function (res){
    sync.fiber(function(){
      var rows = sync.await(db.all("SELECT `post_id`,`title`, `content`, `date_published`, display_name\
      FROM `post` p JOIN `author` a ON p.`author_id` = a.`author_id`\
      WHERE `enabled` = 1\
      ORDER BY `date_published` DESC;",[], sync.defer()));

      var cats = sync.await(db.all("SELECT `name`, `post_id` id\
      FROM `post_to_category` p JOIN `category` c ON p.`category_id` = c.`category_id`"
      ,[],sync.defer()));

      //console.log(cats);
      var dat =  cats.reduce(function(obj, item) {
        if(obj[item.id]){
          if(Array.isArray(obj[item.id])){
            obj[item.id].push(item.name);
          }else{
            obj[item.id] = [obj[item.id]];
            obj[item.id].push(item.name);
          }
        }else{
          obj[item.id] = item.name;
        }
        return obj;
      }, {});

      for(var i = 0; i<rows.length; i++){
        rows[i]['category'] = dat[rows[i].post_id];
      }

      msg.msg = "Post Send";
      msg.status=1;
      msg.data = rows;
      console.log(msg);
      res.end(JSON.stringify(msg));
    });
  },
  getPost:function (res,post_id){
    sync.fiber(function(){
      var rows = sync.await(db.all("SELECT `post_id`,`title`, `content`, `date_published`, display_name\
      FROM `post` p JOIN `author` a ON p.`author_id` = a.`author_id`\
      WHERE `enabled` = 1 AND `post_id` = ?\
      ORDER BY `date_published` DESC;", [post_id] , sync.defer()));

      var cats = sync.await(db.all("SELECT `name`, `post_id` id\
      FROM `post_to_category` p \
      JOIN `category` c ON p.`category_id` = c.`category_id`\
      WHERE `post_id` = ?;",[post_id],sync.defer()));

      //console.log(cats);
      var dat =  cats.reduce(function(obj, item) {
        if(obj[item.id]){
          if(Array.isArray(obj[item.id])){
            obj[item.id].push(item.name);
          }else{
            obj[item.id] = [obj[item.id]];
            obj[item.id].push(item.name);
          }
        }else{
          obj[item.id] = item.name;
        }
        return obj;
      }, {});

      for(var i = 0; i<rows.length; i++){
        rows[i]['category'] = dat[rows[i].post_id];
      }

      //console.log(rows[0].category);

      msg.msg = "Post Send";
      msg.status=1;
      msg.data = rows;
      console.log(msg);
      res.end(JSON.stringify(msg));
    });
    //console.log(dat);
  },
  publishPost:function (res,title,content,category,accesstoken){
    sync.fiber(function(){
      var verified = false;
      var id = 0;
      var author_id = 0;

      var rows = sync.await(db.all('SELECT MAX(`post_id`) ID FROM `post`;',[],sync.defer()));

      id = rows[0].ID + 1;

      rows = sync.await(db.all("SELECT `author_id` ID, `accesstoken` TOKEN FROM `author`;",[],sync.defer()));
      for(var i = 0; i <rows.length; i++){
        if (rows[i].TOKEN == accesstoken){
          verified = true;
          author_id = rows[i].ID;
          break;
        }
      }

      if(verified){
        var date = new Date().toISOString().slice(0, 19).replace('T', ' ');

        sync.await(db.run("INSERT INTO `post`\
        (`post_id`,`title`,`content`,`date_published`,`featured`,`enabled`,`views`,`author_id`)\
        VALUES(?,?,?,?,?,?,?,?);",[id,title,content,date,0,1,0,author_id],sync.defer()));

        for(var i = 0; i<category.length;i++){
          sync.await(db.run("INSERT INTO `post_to_category`\
          (`post_id`,`category_id`)\
          VALUES(?,?);",[id,category[i]],sync.defer()));
        }

        msg.msg = "Post Published";
        msg.status = 1;
        msg.data = [];
        res.end(JSON.stringify(msg));

      }else{
        msg.msg = "Login Expired";
        msg.status = 0;
        msg.data = [];
        res.end(JSON.stringify(msg));
      }
    });
  },
  editPost:function (res,post_id,title,content,category,accesstoken){
    sync.fiber(function(){
      var verified = false;
      var author_id = true;
      msg.msg = "Login Expired";

      var rows = sync.await(db.all("SELECT `author_id`, `accesstoken` TOKEN FROM `author`;",[],sync.defer()));
      for(var i = 0; i <rows.length; i++){
        if (rows[i].TOKEN == accesstoken){
          author_id = rows[i].author_id;
          break;
        }
      }

      var rows = sync.await(db.all("SELECT `author_id` FROM `post` \
      WHERE `post_id` = ?;",[post_id],sync.defer()));
      if (rows[0].author_id == author_id){
        verified = true;
      } else {
        msg.msg = "Cannot Edit Post";
      }

      if(verified){

        sync.await(db.run("UPDATE `posts` \
        SET `title`=?, `content`=? \
        WHERE post_id = ?;",[title,content,post_id],sync.defer()));

        sync.await(db.run("DELETE FROM `post_to_category`\
        WHERE `post_id` = ?;",[post_id],sync.defer()));

        for(var i = 0; i<category.length;i++){
          sync.await(db.run("INSERT INTO `post_to_category`\
          (`post_id`,`category_id`)\
          VALUES(?,?);",[post_id, id,category[i]],sync.defer()));
        }

        msg.msg = "Post Edited";
        msg.status = 1;
        msg.data = [];
        res.end(JSON.stringify(msg));
      } else {
        msg.status = 0;
        msg.data = [];
        res.end(JSON.stringify(msg));
      }
    });
  },
  deletePost:function (res,post_id,accesstoken){
    sync.fiber(function(){
      var verified = false;
      msg.msg = "Login Expired";

      var rows = sync.await(db.all("SELECT `author_id`, `accesstoken` TOKEN FROM `author`;",[],sync.defer()));
      for(var i = 0; i <rows.length; i++){
        if (rows[i].TOKEN == accesstoken){
          author_id = rows[i].author_id;
          break;
        }
      }

      var rows = sync.await(db.all("SELECT `author_id` FROM `post` \
      WHERE `post_id` = ?;",[post_id],sync.defer()));
      if (rows[0].author_id == author_id){
        verified = true;
      }else{
        msg.msg = "Cannot Delete Post";
      }

      if(verified){
        sync.await(db.run("DELETE FROM `post_to_category` WHERE `post_id` = ?;",[post_id],sync.defer()));

        sync.await(db.run("DELETE FROM `post` WHERE post_id = ?;",[post_id],sync.defer()));

        msg.msg = "Post Deleted";
        msg.status = 1;
        msg.data = [];
        res.end(JSON.stringify(msg));

      } else {
        msg.status = 0;
        msg.data = [];
        res.end(JSON.stringify(msg));
      }
    });
  }
}
