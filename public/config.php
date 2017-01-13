<?php
// Enable CORS
header('Content-Type: application/json;charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: DELETE, HEAD, GET, OPTIONS, POST, PUT');
header('Access-Control-Allow-Headers: Content-Type, Content-Range, Content-Disposition, Content-Description');
header('Access-Control-Max-Age: 1728000');
	
	// Api Metadata
	$api_username = "blog";
	$api_password = "b10g";
	
	// Database Metadata
	$db_servername = "localhost";
	$db_name = "blog";
	$db_username = "root";
	$db_password = "";

?>