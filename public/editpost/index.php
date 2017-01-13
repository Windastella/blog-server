<?php
require $_SERVER['DOCUMENT_ROOT']."/header.php";
/*
Title: Blog Edit Post
Author: Nik Mirza
Desc: Handle edit posts by author from frontend.
Perimeter: post_id ,title, content, accesstoken, category
Return Value: {status:1,msg:"Edit Successful"}
Status: -1:login expired,1:success, 2:edit failed, 0:fail, 
*/
	if (!isset($_POST["post_id"])||!isset($_POST["title"])||!isset($_POST["content"])||!isset($_POST["accesstoken"])||!isset($_POST["category"])){
		$msg->msg = "Perimeter Not Define";
		die(json_encode($msg));
	}
	
	$post_id = $_POST["post_id"];
	$title = $_POST["title"];
	$content = $_POST["content"];
	$token = $_POST["accesstoken"];
	$category = $_POST["category"];
	
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
		$sql= "UPDATE `post` SET `title`='".$title."',`content`='".$content."' 
		WHERE `post_id`=".$post_id.";";
		if ($conn->query($sql) === TRUE) {
			$msg->status = 1;
			$msg->msg = "Edit successfull";
			echo(json_encode($msg));
		} else {
			$msg->status = 2;
			$msg->msg = "Edit fail";
			die(json_encode($msg));
		}
		
		$sql = "DELETE FROM `post_to_category` WHERE `post_id` = ".$post_id.";";
		$result = $conn->query($sql);
		
		foreach($category as $cat){
			$sql = "SELECT `category_id` ID FROM `category` WHERE LOWER(`name`) = '".strtolower($cat)."';";
			$result = $conn->query($sql);
		
			if($result->num_rows > 0){
				while($row = $result->fetch_assoc()){
					$sql = "INSERT INTO `post_to_category`(`post_id`,`category_id`) 
							VALUES (".$id.", ".$row["ID"].");";
					$result = $conn->query($sql);
				}
			}
		}
	} else {
		$msg->status = -1;
		$msg->msg = "Login Expired";
		die(json_encode($msg));
	}

require $_SERVER['DOCUMENT_ROOT']."/footer.php";
?>