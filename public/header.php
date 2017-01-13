<?php 
	require "config.php";
	require "utility.php";
	
	// Setting database connection
	$conn = new mysqli($db_servername, $db_username, $db_password, $db_name);

	// Check database connection
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	}
	
	$msg = new msg;
	
	if (!isset($_POST["api_username"])||!isset($_POST["api_password"])){
		$msg->msg = "Request Rejected";
		die(json_encode($msg));
	}
?>