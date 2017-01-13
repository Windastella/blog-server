<?php
require $_SERVER['DOCUMENT_ROOT']."/header.php";
/*
Title: Blog Get Post
Author: Nik Mirza
Desc: Handle retrieving posts blog from frontend.
Perimeter: start(optional), end(optional), post_id(optional)
Return Value: {status:1,msg:"Delete Successful"}
Status: 1:success, 0:fail,
*/

	$start = 0;
	$range = 5;

	if (isset($_POST["start"]))
		$start = $_POST["start"];
	if (isset($_POST["range"]))
		$range = $_POST["range"];

	if(isset($_POST["post_id"])){
		//single post
		$post_id = $_POST["post_id"];

		$sql= "SELECT `post_id`,`title`, `content`, `date_published`, display_name
		FROM `post` p JOIN `author` a ON p.`author_id` = a.`author_id`
		WHERE `post_id` = ".$post_id.";";

		$result = $conn->query($sql);
		$data = $result->fetch_all(MYSQLI_ASSOC);

		$msg->status = 1;
		$msg->msg = "Post Retrieved";
		$msg->data = $data;
		echo(json_encode($msg));

	} elseif(isset($_POST["start"]) || isset($_POST["range"])) {

		$sql= "SELECT `post_id`,`title`, `content`, `date_published`, display_name
		FROM `post` p JOIN `author` a ON p.`author_id` = a.`author_id`
		ORDER BY `date_published` DESC LIMIT ".$start.",".$range.";";

		$result = $conn->query($sql);
		$data = $result->fetch_all(MYSQLI_ASSOC);

		$msg->status = 1;
		$msg->msg = "Post Retrieved";
		$msg->data = $data;
		echo(json_encode($msg));
	} else {

		$sql= "SELECT `post_id`,`title`, `content`, `date_published`, display_name
		FROM `post` p JOIN `author` a ON p.`author_id` = a.`author_id`
		ORDER BY `date_published` DESC;";

		$result = $conn->query($sql);
		$data = $result->fetch_all(MYSQLI_ASSOC);

		$msg->status = 1;
		$msg->msg = "Post Retrieved";
		$msg->data = $data;
		echo(json_encode($msg));
	}

require $_SERVER['DOCUMENT_ROOT']."/footer.php";
?>
