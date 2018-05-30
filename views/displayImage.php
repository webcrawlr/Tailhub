<?php
/**
 * Created by PhpStorm.
 * User: Steven
 * Date: 5/30/18
 * Time: 2:56 PM
 */




//Stores post values in session

//This method is used to store payment.php data
if($_POST['Desired_Action'] == "Order")
    $_SESSION['username'] = $_POST['username'];


require_once 'HTTP/Request2.php';

validCheck();

$request = new HTTP_Request2('https://project2-node-js.herokuapp.com/storeData');
$request->setMethod(HTTP_Request2::METHOD_POST)

    // Sending all post Variables to node js
    ->addPostParameter('username', $_SESSION['username'])
;

// ######### To Fix the SSL issue ###########

$request->setConfig(array(
    'ssl_verify_peer'   => FALSE,
    'ssl_verify_host'   => FALSE
));

// ########################################


try {

    $response = $request->send(); //SENDING request

    if (200 == $response->getStatus()) {//GETTING RESPONSE
        echo $response->getBody();

    } else {

        echo 'Unexpected HTTP status: ' . $response->getStatus() . ' ' .

            $response->getReasonPhrase();

    }

} catch (HTTP_Request2_Exception $e) {
    echo 'Error: ' . $e->getMessage();

}


$data = json_decode($response, true);


echo $data;


?>