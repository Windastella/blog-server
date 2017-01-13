<?php
require $_SERVER['DOCUMENT_ROOT']."/header.php";
/*
Title: Blog Author Login
Author: Nik Mirza
Desc: Handle author login from blog's front end.
Perimeter: username, password
Return Value: {status:1,msg:"Login Successful",data:{token:accesstoken}}
Status: 1:success, 2:not registered, 3:wrong password, 0:fail 
*/
	
	if (!isset($_POST["username"])||!isset($_POST["password"])){
		$msg->msg = "Perimeter Not Define";
		die(json_encode($msg));
	}
	
	$username = strtolower($_POST["username"]);
	$password = $_POST["password"];
	
	$sql = "SELECT `username`, `email`, `password` FROM `author`;";
	$result = $conn->query($sql);

	$verified = false;
	
	while($row = $result->fetch_assoc()){
		if($row['user'] == $username ||$row['email'] == $username ){
			if(password_verify($password, $row['password'])){
				$verified = true;
				break;
			} else {
				$msg->status = 3;
				$msg->msg = "Wrong Password";
				die(json_encode($msg));
			}
		}
	}
	
	$accesstoken = new accesstoken;
	
	if($verified){
		$token = $accesstoken->generate_token();
		
		$sql = "UPDATE `author` SET `accesstoken`='".$token."' WHERE `username`='".$username."' OR `email`='".$username."';";
		$conn->query($sql);
		
		$data = '{"token":"'.$token.'"}';
		
		$msg->status = 1;
		$msg->msg = "Login successfull";
		$msg->data = $data;
		echo(json_encode($msg));
	} else {
		$msg->status = 2;
		$msg->msg = "Not Registered";
		$msg->data = $data;
		echo(json_encode($msg));
	}
	
require $_SERVER['DOCUMENT_ROOT']."/footer.php";
?>