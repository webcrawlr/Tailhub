<?php
require_once 'HTTP/Request2.php';
	
if(isset($_POST['Register'])){
	$firstname = $_SESSION['firstname'];
	$lastname = $_SESSION['lastname']
    $email = $_SESSION['email'];
	$username = $_SESSION['username'];
    $password = $_SESSION['password'];
    $month = $_SESSION['month'];
	$day = $_SESSION['day'];
	$year = $_SESSION['year'];
	$gender = $_SESSION['gender'];
}

    //user details for new account
    $request=new HTTP_Request2('https://tailhub.herokuapp.com/createProfile', HTTP_Request2::METHOD_POST);
    $request->addPostParameter('fname', $firstname);
    $request->addPostParameter('lname', $lastname);
	$request->addPostParameter('email', $email);
	$request->addPostParameter('username', $username);
    $request->addPostParameter('password', $password);
    $request->addPostParameter('month', $month);
    $request->addPostParameter('day', $day);
    $request->addPostParameter('year', $year);
    $request->addPostParameter('gender', $gender);
    //fix the SSL issue
    $request->setConfig(array(
         'ssl_verify_peer'   => FALSE,
         'ssl_verify_host'   => FALSE
    ));
	
	$response=$request->send();
	//$data = json_decode($response, true);
	$baseurl = "www.tailhub.com/";
	$url = $baseurl . $username
		
	header('Location: $url'); //replace * with profile.html page
	exit();
?>
