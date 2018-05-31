<?php
/**
 * Created by PhpStorm.
 * User: Steven
 * Date: 5/30/18
 * Time: 2:56 PM
 */

// Start the session
session_start();


//Stores post values in session

//This method is used to store payment.php data
if($_POST['Desired_Action'] == "Order")
    $_SESSION['username'] = $_POST['username'];
    $_SESSION['password'] = $_POST['password'];

    //echo $_SESSION['username'];


require_once 'HTTP/Request2.php';

validCheck();

$request = new HTTP_Request2('https://tailhub.herokuapp.com/users/login');
$request->setMethod(HTTP_Request2::METHOD_POST)

    // Sending all post Variables to node js
    //->addPostParameter('postText', 'test1')
    ->addPostParameter('username', $_SESSION['username'])
    ->addPostParameter('password', $_SESSION['password'])
;

// ######### To Fix the SSL issue ###########

$request->setConfig(array(
    'ssl_verify_peer'   => FALSE,
    'ssl_verify_host'   => FALSE
));

// ########################################


try {

    $response = $request->send(); //SENDING request
    $data = json_decode($response, true);
    //echo $data;

    if (200 == $response->getStatus()) {//GETTING RESPONSE

        //echo $response->getBody();

    } else {

        echo 'Unexpected HTTP status: ' . $response->getStatus() . ' ' .

            $response->getReasonPhrase();

    }

} catch (HTTP_Request2_Exception $e) {
    echo 'Error: ' . $e->getMessage();

}
//echo $data['something'];


?>


<!doctype html>
<html>
<head>
    <link rel="stylesheet" href="http://csweb01.csueastbay.edu/~jb4522/Project1/ProductStyles.css">
    <meta charset="UTF-8">


    <title>Test</title>
</head>

<body>
    <li>
        <?php echo"Hello World!"?>
    </li>

</body>
</html>
