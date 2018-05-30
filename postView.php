<!DOCTYPE html>
<html>
<title> postView component</title>

<body>
<?php 
    session_start();
?>

<!-- retrieve the data --> 
<?php
	$request = new HTTP_Request2('https://tailhub.herokuapp.com/post');
	$response = $request->send();
	
	$username = $response->getUsername();
	$postID = $response->getPostId();
	$text = $response->getText();
	$paw5Counter = $response->getPaw5Counter();
	$paw5List = $response->getPaw5List();
	$location = $response->getLocation();
	$shareCount = $response->getShareCount();

      //fix the SSL issue
      $request->setConfig(array(
            'ssl_verify_peer'   => FALSE,
            'ssl_verify_host'   => FALSE
      ));
?>

<div id = "username">
  <p> <b> <?php echo $username; ?> </b> </p> 
</div>

<div id = "text">
  <p> <b> <?php echo $text; ?> </b> </p> 
</div>

<div id = "location">
  <p> <b> <?php echo $location; ?> </b> </p> 
</div>

<!-- image component -->
<img src="pet.jpg" alt="Pet Face" width="500" height="377">

<!-- video component -->
<video width="320" height="240" controls>
  <source src="movie.mp4" type="video/mp4">
  <source src="movie.ogg" type="video/ogg">
  Your browser does not support the video tag.
</video>

<div id = "paw5Counter">
  <p> <b> <?php echo $paw5Counter; ?> </b> </p> 
</div>

<div id = "shareCount">
  <p> <b> <?php echo $shareCount; ?> </b> </p> 
</div>

<div id = "comment">
  <p> <b> <?php echo $comment; ?> </b> </p> 
</div>


</body>
</html>
