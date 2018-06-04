<?php
require_once 'HTTP/Request2.php';

//Get request URL
$request=new HTTP_Request2('https://tailhub.herokuapp.com/getFriends', HTTP_Request2::METHOD_POST);
$request->addPostParameter('username',  "chicken tendies");
$request->addPostParameter('text',  "TESTTESTTESTTESTTESTTESTTESTTEST");
$request->addPostParameter('password',  "111");
$request->addPostParameter('species',  "meme");
$request->addPostParameter('breed',  "dank");
$request->addPostParameter('age',  "42");
$request->addPostParameter('location',  "Cali");
$request->addPostParameter('email',  "email@server.com");

//fix the SSL issue
$request->setConfig(array(
    'ssl_verify_peer'   => FALSE,
    'ssl_verify_host'   => FALSE
));
$response=$request->send(); //SENDING request
echo $response->getStatus();
?>
<br><br>
<?php
//Now that we have a response, we need to operate on it and display it.
if(200==$response->getStatus()) {//GETTING RESPONSE
    //if response is successful, print success message
    echo $response->getBody();
}
?>