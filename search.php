<?php
session_start();

if(isset($_POST['submitSearch'])){
    $username = $_POST['search'];
}
    require_once 'HTTP/Request2.php';

    //Get request URL
    $request=new HTTP_Request2('https://tailhub.herokuapp.com/getProfile', HTTP_Request2::METHOD_POST);
    $request->addPostParameter('username',  "markwatney");

    //fix the SSL issue
    $request->setConfig(array(
         'ssl_verify_peer'   => FALSE,
         'ssl_verify_host'   => FALSE
    ));
    $response=$request->send(); //SENDING request
    echo $response->getStatus();
    //Now that we have a response, we need to operate on it and display it.
    if(200==$response->getStatus()) {//GETTING RESPONSE
        //if response is successful, print success message
        echo $response->getBody();
    }

?>
