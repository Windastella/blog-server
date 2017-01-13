<?php
require $_SERVER['DOCUMENT_ROOT']."/header.php";

/*
Title: Blog Author Registration
Author: Nik Mirza
Desc: Handle author registration from blog's front end.
Perimeter: name, username, password, email
Return Value: {status:1,msg:"Registtration Successful",data:""}
Status: 1:success, 2:registration fail, 0:fail 
*/

	$sql = "SELECT MAX(`author_id`) ID FROM `author`;";
	$result = $conn->query($sql);
	$id;
	
	while($row = $result->fetch_assoc())
		$id = $row['ID'] + 1;
	
	if (!isset($_POST["name"])||!isset($_POST["username"])||!isset($_POST["password"])||!isset($_POST["email"])){
		$msg->msg = "Perimeter Not Define";
		die(json_encode($msg));
	}
	
	$name = $_POST["name"];
	$username = strtolower($_POST["username"]);
	$password = pasword_hash($_POST["password"]);
	$email = strtolower($_POST["email"]);
	
	$sql = "SELECT `email`, `username` FROM `author`;";
	$result = $conn->query($sql);
	
	while($row = $result->fetch_assoc()){
		if($row['email'] == $email)
			$msg->status = -2;
			$msg->msg = "User Already Exist";
			die(json_encode($msg));
		if($row['username'] == $username)
			$msg->status = -3;
			$msg->msg = "Username Already Taken";
			die(json_encode($msg));
	}
	
	$sql= "INSERT INTO `author`(`author_id`,`name`,`username`,`password`,`email`) 
	VALUES ($id, $name, $username, $password, $email);";
	if ($conn->query($sql) === TRUE) {
		$msg->status = 1;
		$msg->msg = "Registration successfull";
		echo(json_encode($msg));
	} else {
		$msg->status = 2;
		$msg->msg = "Registration fail";
		echo(json_encode($msg));
	}
	
require $_SERVER['DOCUMENT_ROOT']."/footer.php";
?>