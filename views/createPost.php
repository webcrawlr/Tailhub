<?php
require_once 'HTTP/Request2.php';

$request = new HTTP_Request2('https://tailhub.herokuapp.com/users/post');
$request->setMethod(HTTP_Request2::METHOD_POST);
$request->addPostParameter('username',  "namae");
$request->setConfig(array(
    'ssl_verify_peer'   => FALSE,
    'ssl_verify_host'   => FALSE
));

try {
    $response = $request->send(); //SENDING request
    echo "sent";
    if (200 == $response->getStatus()) {//GETTING RESPONSE

    $data = json_decode($response, true);
    echo $data['response'];

    } else {
        echo 'Unexpected HTTP status: ' . $response->getStatus() . ' ' .
        $response->getReasonPhrase();
    }
}catch(HTTP_Request2_Exception $e){echo 'Error: ' . $e->getMessage();}
?>