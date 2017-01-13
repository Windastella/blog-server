<?php
require $_SERVER['DOCUMENT_ROOT']."/header.php";
/*
Title: Blog Delete Post
Author: Nik Mirza
Desc: Handle delete posts by author from frontend.
Perimeter: post_id ,accesstoken
Return Value: {status:1,msg:"Delete Successful"}
Status: -1:login expired,1:success, 2:delete failed, 0:fail, 
*/
	if (!isset($_POST["post_id"])||!isset($_POST["accesstoken"])){
		$msg->msg = "Perimeter Not Define";
		die(json_encode($msg));
	}
	
	$post_id = $_POST["post_id"];
	$token = $_POST["accesstoken"];
	
	$sql = "SELECT `accesstoken` FROM `author`;";
	$result = $conn->query($sql);

	$verified = false;
	
	while($row = $result->fetch_assoc()){
		if($row['accesstoken'] == $token){
			$verified = true;
			break;
		}
	}
	
	if (verified){
		$sql= "DELETE FROM `post` WHERE `post_id` = '".$post_id."';";
		if ($conn->query($sql) === TRUE) {
			$msg->status = 1;
			$msg->msg = "Delete successfull";
			echo(json_encode($msg));
		} else {
			$msg->status = 2;
			$msg->msg = "Delete fail";
			die(json_encode($msg));
		}
		
		$sql = "DELETE FROM `post_to_category` WHERE `post_id` = ".$post_id.";";
		$result = $conn->query($sql);
	} else {
		$msg->status = -1;
		$msg->msg = "Login Expired";
		die(json_encode($msg));
	}

require $_SERVER['DOCUMENT_ROOT']."/footer.php";
?>