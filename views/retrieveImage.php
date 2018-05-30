<?php

?>

<?php
/**
 * Created by PhpStorm.
 * User: Steven
 * Date: 5/30/18
 * Time: 2:52 PM
 */
?>

<?php
// Start the session
//session_start();
?>

<!doctype html>
<html>
<head>
    <link rel="stylesheet" href="http://csweb01.csueastbay.edu/~jb4522/Project1/ProductStyles.css">
    <meta charset="UTF-8">


    <title>Test</title>
</head>

<body>





<form action = "displayImage.php" method="post">


    <label>Name <input name="username" id="username" value="" size = "25" /></label><br>
    <label>Password <input name="password" id="password" value="" size = "25" /></label><br>
    <input type="hidden" name="Desired_Action" value="Order">
    <input type="submit" name="order" id="order" value="SEND"/>
</form>


</body>
</html>


