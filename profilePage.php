<!DOCTYPE html>
<?php		
	session_start();

	 require_once 'HTTP/Request2.php';
	 
	$request=new HTTP_Request2('https://tailhub.herokuapp.com/getFriends', HTTP_Request2::METHOD_POST);
	
	$request->addPostParameter('username', kazookid);
	
	$request->setConfig(array(
		'ssl_verify_peer' => FALSE,
		'ssl_verify_host' => FALSE
	));
	
	$response=$request->send();
	$friends=$response->getBody();
			
					
	$request=new HTTP_Request2('https://tailhub.herokuapp.com/getFollowers', HTTP_Request2::METHOD_POST);
	
	$request->addPostParameter('username', kazookid);
	
	$request->setConfig(array(
		'ssl_verify_peer' => FALSE,
		'ssl_verify_host' => FALSE
	));
	
	$response=$request->send();
	$followers=$response->getBody();
	
					
	$request=new HTTP_Request2('https://tailhub.herokuapp.com/getFollowing', HTTP_Request2::METHOD_POST);
	
	$request->addPostParameter('username', kazookid);
	
	$request->setConfig(array(
		'ssl_verify_peer' => FALSE,
		'ssl_verify_host' => FALSE
	));
	
	$response=$request->send();
	$following=$response->getBody();
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
            
            /* Sidebar content */
            .sideBar {
    			height: 80px;
   				width: 250px; /* should be added to width of "main" margin-right */
    			position: fixed;
    			z-index: 1;
    			top: 100px;
    			right: 14px;
    			background-color: #FFFFFF;
    			overflow: hidden;
    			overflow-y: scroll;
    			padding-top: 20px;
                	border: solid;
                	border-width: 1px;
            }
            
            .sideBar a {
    			padding: 0px 12px 0px;
    			text-decoration: none;
    			font-size: 16px;
    			color: #000;
    			display: block;
		}
			
            /* Sidebar Header */
            .sideBarTop{
            	height: 30px;
                	width: 250px;
                	position: fixed;
               	right: 14px;
                	z-index: 1;
                	border: solid;
                	border-width: 1px;
            }
            
            .sideBarTop a {
    			font-size: 18px;
    			color: #000;
    			display: block;
                	position: absolute;
                	top: 50%;
  			left: 50%;
                	transform: translate(-50%, -50%);
		}
			
            .sideBarTop p {
    			font-size: 18px;
    			color: #000;
    			display: block;
                	position: absolute;
  			left: 50%;
                	transform: translate(-50%, -50%);
			}
			
          	/* style for profile info component */
            .container{
            	display: table;
            	width: 100%;
                	background-color: #ffffff;
            }
            
            .left-half{
            	position: fixed;
            	left: 0px;
            	width: 250px;
                	background-color: #d9d9d9;
                	z-index: 1;
                	height: 100%;
            }
            
            section{
            	text-align: center;
            }
            
            box{
            	position: relative;
            	top: 150px;
            }
            
            h1{
            	font-size: 1.75rem;
            	margin: 0 0 0.75rem 0;
            }
            
            div2{
            	background-color: #ffffff;
            }
		/* style for postCreate component */
		.postCreate {
			background-color: lightgray;
			margin-top: 50px;
			margin-left: auto;
			margin-right: auto;
			width: 40%;
			float: center;
		}
	
		/* style for postView component */
		.postView {
			background-color: lightgray;
			margin-top: 50px;
			margin-left: auto;
			margin-right: auto;
			width: 40%;
			float: center;
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
        
        
        	<!-- Profile info on left side-->
		<section class="container">
  			<div class="left-half div2">
    				<box>
      				<!-- image component -->
					<img src="pet.jpg" alt="My Image" height="170" width="170">
      				<p> <b>Osaki Shi</b> </p>
      				<br> 
      				<p>Species: Dog </p>
      				<p>Breed: Shiba Inu</p>
      				<p>Age: 8</p>
      				<p>Country: Kanigawa, Japan</p>
      				<br>
      				<a href="petpics.com/photos">Photos</a>
      				<br> <br>
      				<a href="petpics.com/videos">Videos</a>
      				<br> <br>
      				<a href="petpics.com/friends">Friends</a>
      				<br> <br>
	  				<a href="petpics.com/followers">Followers</a>
	  				<br> <br>
     					<a href="petpics.com/followings">Followings</a>
   				</box>
  			</div>
		</section>

    
		<section class = "postCreate">
			<div class = "center">
				<form action="postProcess.php" method="post">
					<br>
    					<textarea name="text" rows="5" cols="80"></textarea>
    					<br />
    					<input type="submit" name="submitPost" value="Post">
				</form>
				<form action="upload.php" method="post" enctype="multipart/form-data">
    					<br>
    					<input type="file" name="file" id="file" /> 
    					<input type="submit" value="Upload Image" name="submitPic">
				</form>
			</div>
		</section>

		<section class = "postView">
			<div class = "center">
				<div id = "username">
					<br>
 	 				<p> <b> Osaki Shi </b> </p> 
				</div>
				<div id = "text">
 	 				<p> Text post will go here....................... </p> 
				</div>
				<div id = "location">
  					<p> Osaka, Japan </p> 
				</div>

		<!-- image component
		<img src="pet.jpg" alt="Pet Face" width="320" height="240">
 		-->
 
				<!-- video component -->
				<video width="320" height="240" controls>
 	 			<source src="movie.mp4" type="video/mp4">
  				<!--	<source src="movie.ogg" type="video/ogg"> -->
  				Your browser does not support the video tag.
				</video>

			<div id = "paw5">
  				<button type="button">Paw5!</button>
  			
				<!-- Ads Share count component -->
  				<button type="button">Share</button>
			</div>
	
			<!-- Comment component -->
			<div id = "commentBox">
  				<form action="postComment.php" method="post">
    					<textarea name="text" rows="5" cols="80"></textarea>
    					<br />
    					<input type="submit" name="comment" value="Comment">
				</form>
			</div>
	
			</div>
		</section>
        
        <!-- Ads Sidebar -->
		<div id = "nav" class = "sideBarTop" style = "top:70px">
            	<p>Ads</p>
        	</div>
        	<div class= "sideBar">
            	<center> Some random ads... <center>
        	</div>
        
					<!-- Friends Sidebar -->
			
			        <div id = "nav" class = "sideBarTop" style = "top:226px">
			            <a href="petpics.com/friends">Friends</a>
			        </div>
			        <div class= "sideBar" style = "top:256px">
			            <ul><?php echo $friends ?></ul>
			        </div>
        
			        <!-- Followers Sidebar -->

			        <div id = "nav" class = "sideBarTop" style = "top:381px">
			            <a href="petpics.com/followers">Followers</a>
			        </div>
			        <div class= "sideBar" style = "top:411px">
			            <ul><?php echo $followers ?></ul>
			        </div>
        
			        <!-- Following Sidebar -->
			
			        <div id = "nav" class = "sideBarTop" style = "top:536px">
			            <a href="petpics.com/following">Following</a>
			        </div>
			        <div class= "sideBar" style = "top:566px">
			            <ul><?php echo $following ?></ul>
			        </div>
			?>
        
        	<!-- Bottom Bar -->
        	<div id = "nav" class="stickyBottom" style = "padding:3px">
            	Copyright © Acme Inc.  All rights reser- okay, we didn't actually copyright anything.  Pls don't steal.
        	</div>   
	</body>
</html>