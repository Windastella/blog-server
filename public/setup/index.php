<?php
require $_SERVER['DOCUMENT_ROOT']."/config.php";

// Create connection
$conn = new mysqli($db_servername, $db_username, $db_password);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

// Create database
$sql = "CREATE DATABASE ".$db_name;
if ($conn->query($sql) === TRUE) {
    echo "Database created successfully";
	
	echo "<br>Creating Tables";
	$conn = new mysqli($db_servername, $db_username, $db_password, $db_name);
	$sql = "CREATE TABLE `author`(`author_id` INT NOT NULL,`display_name` TEXT NOT NULL,`username` VARCHAR(150) NOT NULL,`password` TEXT NOT NULL,`email` VARCHAR(150) NOT NULL, `accesstoken` TEXT,PRIMARY KEY (`author_id`),UNIQUE (`username`),UNIQUE (`email`));";
	if ($conn->query($sql) === TRUE) {
		echo "<br>Table author created successfully";
	} else {
		echo "<br>Error creating table: " . $conn->error;
	}
	
	$sql = "CREATE TABLE `post`(`post_id` INT NOT NULL,`title` TEXT NOT NULL,`content` TEXT NOT NULL,`date_published` DATE NOT NULL,`featured` BOOLEAN NOT NULL,`enabled` BOOLEAN NOT NULL,`views` INT NOT NULL,`author_id` INT NOT NULL,PRIMARY KEY (`post_id`),FOREIGN KEY (`author_id`) REFERENCES `author`(`author_id`));";
	if ($conn->query($sql) === TRUE) {
		echo "<br>Table post created successfully";
	} else {
		echo "<br>Error creating table: " . $conn->error;
	}
	
	$sql ="CREATE TABLE `category`(`category_id` INT NOT NULL,`name` VARCHAR(150) NOT NULL,`enabled` BOOLEAN NOT NULL,PRIMARY KEY (`category_id`),UNIQUE (`name`));";
	if ($conn->query($sql) === TRUE) {
		echo "<br>Table category created successfully";
	} else {
		echo "<br>Error creating table: " . $conn->error;
	}
	
	$sql ="CREATE TABLE `post_to_category`(`post_id` INT NOT NULL,`category_id` INT NOT NULL,FOREIGN KEY (`post_id`) REFERENCES post(`post_id`),FOREIGN KEY (`category_id`) REFERENCES category(`category_id`));";
	if ($conn->query($sql) === TRUE) {
		echo "<br>Table post_to_category created successfully";
	} else {
		echo "<br>Error creating table: " . $conn->error;
	}
	
} else {
    echo "Error creating database: " . $conn->error;
}
	
$conn->close();
?>