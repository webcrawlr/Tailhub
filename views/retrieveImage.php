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

<form action = "displayImage.php" method="post" enctype="multipart/form-data">

    <label>Name <input name="name" id="name" value="" size = "25" /></label><br>
    <label>username <input name="username" id="username" value="" size = "25" /></label><br>
    <label>Password <input name="password" id="password" value="" size = "25" /></label><br>
    <label>Password <input name="password2" id="password2" value="" size = "25" /></label><br>
    <label>Email <input name="email" id="email" value="" size = "25" /></label><br>
    <label><input type="file" name="profileImg" id="profileImg" /></label>


    <input type="hidden" name="Desired_Action" value="Order">
    <input type="submit" name="order" id="order" value="SEND"/>
</form>


</body>
</html>


