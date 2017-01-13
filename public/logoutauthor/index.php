<?php
require $_SERVER['DOCUMENT_ROOT']."/header.php";
/*
Title: Blog Author Logout
Author: Nik Mirza
Desc: Handle author login from blog's front end.
perimeter: accesstoken
Return Value: {status:1,msg:"Logout Successful"}
Status: 1:success, 2:token expired, 0:fail, 
*/

	if (!isset($_POST["accesstoken"]))
		$msg->msg = "Perimeter Not Define";
		die(json_encode($msg));
	}
	
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
		$sql = "UPDATE `author` SET `accesstoken`= NULL WHERE `accesstoken`='".$token."';";
		$conn->query($sql);
		
		$msg->status = 1;
		$msg->msg = "Logout Successful";
		echo(json_encode($msg));
	} else {
		$msg->status = -1;
		$msg->msg = "Login Expired";
		echo(json_encode($msg));
	}
	
require $_SERVER['DOCUMENT_ROOT']."/footer.php";
?>