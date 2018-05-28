<!-- Put this in the profile --> 
<!-- Make sure file_uploads = on in php.ini, or pictures/media won't work!-->

<!-- Make sure session is started at the top; if it is, we can remove this bit-->
<?php 
    session_start();
?>
<form action="upload.php" method="post" enctype="multipart/form-data">
    <textarea name="text" rows="8" cols="80"></textarea>
    <input type="submit" name="submitPost" value="Post">
    Select media to upload:
    <input type="file" name="file" id="file" /> 
    <input type="submit" value="Upload Image" name="submitPic">

</form>
<?php
/*
Detection for post button hit
PRECONDITIONS:
    1.  Have username
    2.  Have post count
    Everything else is gotten on the fly
POSTCONDITIONS:
    1.  Have creationDate
    2.  Have postID D
    3.  Have location D
    4.  Have post (text) D
    5.  Have a paw5 list
    6.  Have a paw5 counter
    7.  Have shareCount
*/
if(isset($_POST['submitPost'])){
    //Get date and time
    $creationDate = date("Y-m-d@h:i:sa");
    //Get preconditions satisfied
    $username = $_SESSION['username'];
    $postCount = $_SESSION['postCount'];
    //Get geolocation using IP address
    //Using geoplugin
    $user_ip = getenv('REMOTE_ADDR');
    $geo = unserialize(file_get_contents("http://www.geoplugin.net/php.gp?ip=$user_ip"));
    $country = $geo["geoplugin_countryName"];
    $region = $geo["geoplugin_region"];
    $city = $geo["geoplugin_city"];

    $text = $_POST['text'];
    $postId = $username.$postCount;
    $rePost = FALSE;
    //media here
    $paw5Counter = 1;
    $paw5list = array($username);
    $shareCount = 0;
    $location = array($city, $region, $country);
    $groomFeedFlag = FALSE; //For now
}
?>
<!-- Sending off the data, code adapted from Bryce Baker's by Raymond Muller --> 
<?php
        //add the user's data to the http2 post request
        $request=new HTTP_Request2('https://tailhub.herokuapp.com/post', HTTP_Request2::METHOD_POST);
        $request->addPostParameter('username',  $username);

        //Post info
        $request->addPostParameter('postId',  $postId);
        $request->addPostParameter('rePost',  $rePost);
        $request->addPostParameter('text',  $text);
        $request->addPostParameter('paw5Counter',  $paw5Counter);
        $request->addPostParameter('paw5List',  $paw5List);
        $request->addPostParameter('location',   $location);
        $request->addPostParameter('creationDate',   $creationDate);
        $request->addPostParameter('groomFeedFlag',   $groomFeedFlag);
        $request->addPostParameter('shareCount',   $shareCount);

        //fix the SSL issue
        $request->setConfig(array(
             'ssl_verify_peer'   => FALSE,
             'ssl_verify_host'   => FALSE
        ));
?>