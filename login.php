<?php

if(isset($_POST['Login'])){
    $username = $_SESSION['username'];
    $password = $_SESSION['password'];
}

    $request=new HTTP_Request2('https://tailhub.herokuapp.com/login', HTTP_Request2::METHOD_POST);
	$request->addPostParameter('email', $email);
    $request->addPostParameter('password', $password);
    //fix the SSL issue
    $request->setConfig(array(
         'ssl_verify_peer'   => FALSE,
         'ssl_verify_host'   => FALSE
    ));
		
	$response=$request->send();
	//$data = json_decode($response, true);
	
	header('Location: *'); //replace * with profile.html page 
	exit();
?>