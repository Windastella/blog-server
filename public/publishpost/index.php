<?php
require $_SERVER['DOCUMENT_ROOT']."/header.php";
/*
Title: Blog Publish Post
Author: Nik Mirza
Desc: Handle publish posts by author from frontend.
Perimeter: title, content, accesstoken, category
Return Value: {status:1,msg:"Publish Successful"}
Status: -1:login expired,1:success, 2:publish failed, 0:fail, 
*/
	if (!isset($_POST["title"])||!isset($_POST["content"])||!isset($_POST["accesstoken"])||!isset($_POST["category"])){
		$msg->msg = "Perimeter Not Define";
		die(json_encode($msg));
	}
	
	$sql = "SELECT MAX(`post_id`) ID FROM `post`;";
	$result = $conn->query($sql);
	$id;
	
	while($row = $result->fetch_assoc())
		$id = $row['ID'] + 1;

	$title = $_POST["title"];
	$content = $_POST["content"];
	$token = $_POST["accesstoken"];
	$author_id;
	$category = $_POST["category"];
	
	$sql = "SELECT `author_id`, `accesstoken` FROM `author`;";
	$result = $conn->query($sql);

	$verified = false;
	
	while($row = $result->fetch_assoc()){
		if($row['accesstoken'] == $token){
			$verified = true;
			$author_id = $row['author_id'];
			break;
		}
	}
	
	if (verified){
		$sql= "INSERT INTO `post`(`post_id`,`title`,`content`,`author_id`) 
		VALUES ($id, $title, $content, $author_id);";
		if ($conn->query($sql) === TRUE) {
			$msg->status = 1;
			$msg->msg = "Publish successfull";
			echo(json_encode($msg));
		} else {
			$msg->status = 2;
			$msg->msg = "Publish fail";
			die(json_encode($msg));
		}
		
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