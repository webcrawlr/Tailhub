<!DOCTYPE html>
<?php		
	session_start();
	 require_once 'HTTP/Request2.php';
	 
	$request=new HTTP_Request2('https://tailhub.herokuapp.com/getFollowers', HTTP_Request2::METHOD_POST);
	
	$request->addPostParameter('username', doge);
	
	$request->setConfig(array(
		'ssl_verify_peer' => FALSE,
		'ssl_verify_host' => FALSE
	));
	
	$response=$request->send();
	$followers=$response->getBody();
?>


<html>
    <head>
        <meta charset="utf-8">
        <title>Base Page</title>
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
              	padding: 2.5px;
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
            
            body{
                	background-color: #fbe5ce;
            }
            
            .stickyTop{
                	position: fixed;
                	top: 0;
                	width: 100%;
                	z-index: 2;
            }
            
            .stickyBottom{
                	position: fixed;
                	bottom: 0;
                	width: 100%;
                	z-index: 2;
            }
            
            /* Friend Requests Header */
            .center{
            	height: 45px;
                width: 60%;
                position: fixed;
                right: 14px;
                z-index: 1;
                top: 15%;
                left: 50%;
                transform: translate(-50%, -50%);
                border: solid;
                border-width: 1px;
            }
            .center p {
    			font-size: 24px;
    			color: #000;
    			display: block;
                position: absolute;
  				left: 50%;
                transform: translate(-50%, -50%);
			}
            /* Requests box */
            .requests {
    			height: 60%;
   				width: 60%; 
    			position: fixed;
    			z-index: 0;
    			top: 48%;
    			left: 50%;
                transform: translate(-50%, -50%);
    			background-color: #FFFFFF;
    			overflow: hidden;
    			overflow-y: scroll;
    			padding-top: 20px;
                border: solid;
                border-width: 1px;
            }
            .requests a {
    			padding: 0px 12px 0px;
    			text-decoration: none;
    			font-size: 16px;
    			color: #000;
    			display: block;
			}
        </style>
	</head>
	<body>
        	<!-- Top Bar -->
        	<!-- Links modified as created when demonstrating -->
		<div id = "nav" class="stickyTop">
            	<a href="petpics.com/home" style = "float:left;">Home</a>
            	<a href="petpics.com/logout">Logout</a>
            	<a href="petpics.com/settings">Settings</a>
            	<a href="petpics.com/notify">Notify</a>
            	<a href="petpics.com/messages">Messages</a>
            	<a href="petpics.com/profile">Profile</a>
            	<a href="petpics.com/newsfeed">Newsfeed</a>
            	<div class="search-container">
                		<form action="search.php">
                    		<input type="text" placeholder="Search..." name="search">   
                   		 <button type="submit"><i class="fa fa-search"></i></button>
                		</form>
            	</div>
      	</div>
        
        	<!-- Requested data box -->
        <div id="nav" class="center">
        	<p>Friend Requests</p>
        </div>
        <div class="requests">
        	<ul><?php echo $followers ?></ul>
        </div>
        	
        	<!-- Bottom Bar -->
        	<div id = "nav" class="stickyBottom" style = "padding:3px">
            	Copyright © Acme Inc.  All rights reser- okay, we didn't actually copyright anything.  Pls don't steal.
        	</div>   
	</body>
</html>