var fs = require("fs");
var file = "blog.db";
var exists = fs.existsSync(file);

if(!exists) {
  console.log("Creating DB file.");
  fs.openSync(file, "w");
}

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);

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

db.close();
