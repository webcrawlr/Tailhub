<!DOCTYPE html>
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
    //Now that we have a response, we need to operate on it and display it.

?>
<html>
    <head>
        <meta charset="utf-8">
        <title>Search Results</title>
        <!-- Font used for search button -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <style>
            /*Navbar*/
            #nav{
                overflow: hidden;
                background-color: #d9d9d9;
            }
            /*Navbar Links*/
            #nav a{
                float: right;
                display: block;
                color: black;
                text-align: center;
                padding: 14px;
                text-decoration: none;
            }
            #nav a:hover {
                background-color: #999999;
                color: black;
            }
            #nav .search-container {
                float: left;
            }

            #nav input[type=text] {
                float: left;
                padding: 3px;
                border: none;
                margin-top: 14px;
            }
            #nav .search-container button {
              float: right;
              padding: 1px;
              margin-top: 14px;
              margin-right: 16px;
              font-size: 14px;
              background: #ffffff;
              border: none;
              cursor: pointer;
            }
            #nav .search-container button:hover {
                background: #ccc;
            }

            #resultsContainer .heading{
                width:100%;
                height:100%;
                top:50%;
                left:50%;
                margin-left:auto;
                margin-right:auto;
                margin-top: 5px;
                margin-bottom: 5px;
                background-color: #999999;
                color:black;
                text-align:center;
            }

            #resultsContainer{
                width:75%;
                height:100%;
                top:50%;
                left:50%;
                margin-left:auto;
                margin-right:auto;
                transform: translate(0, 50%);
                background-color:#ffffff;
                color:black;
            }
            body{
                background-color: #fbe5ce;
            }
            .stickyTop{
                position: fixed;
                top: 0;
                width: 100%;
            }
            .stickyBottom{
                position: fixed;
                bottom: 0;
                width: 100%;
            }

        </style>
    </head>
    <body>
        <!-- Top Bar -->
        <!-- Links modified as created when demonstrating -->
        <div id = "nav" class="stickyTop">
            <a href="petpics.com/home" style = "float:left;">Home</a>
            <a href="petpics.com/friends">Friends</a>
            <a href="petpics.com/messages">Messages</a>
            <a href="petpics.com/settings">Settings</a>
            <div class="search-container">
                <form action="<?php echo $_SERVER['PHP_Self']; ?>" method="post">
                    <input type="text" placeholder="Search..." name="search">   
                    <button type="submit" name="submitSearch"><i class="fa fa-search"></i></button>
                </form>
            </div>
        </div>
        <!-- Search Results Body-->
        <div id ="resultsContainer">
            <div class="heading">
                Search Results
            </div>
            <li><?php if(200==$response->getStatus()) {echo $response->getBody();}?></li>
            <li>User 2</li>
            <li>User 3</li>
            <li>User 4</li>
        </div>
        <!-- Bottom Bar -->
        <div id = "nav" class="stickyBottom" style = "padding:3px">
            Copyright © Acme Inc.  All rights reser- okay, we didn't actually copyright anything.  Pls don't steal.
        </div>

    </body>
</html>
