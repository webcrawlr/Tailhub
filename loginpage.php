<!DOCTYPE html>
<?php 
    session_start();
?>
<html>
    <head>
        <meta charset="utf-8" content="width=device-width, intial-scale=1">
        <title>Base Page</title>
        <!-- Font used for text containers button -->
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
            #nav input[type=text] {
                float: right;
                padding: 3px;
                border: none;
                margin-top: 14px;
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
            /* Split the website name and account creation */
            .split{
            	height: 90%;
                width: 50%;
                position: fixed;
                z-index: 1;
                top: 10%;
                overflow-x: 0;
                padding-top: 15px;
            }
            .left{
                font-size: 32px;
                float: left;
            }
            .right{
                right:0;
            }
            .center{
            	position: absolute;
                left: 50%;
                transform: translate(-50%, -50%);
    			text-align: center;
                display: block;
            }
            /* Register text fields */
            .registerText{
            	padding: 7px;
                width: 400px;
                margin: 7px;
                border-style: solid;
    			border-width: 2px;
            }
            /* Login text fields */
            .userText{
            	position: relative;
                right: 250px;
                margin: 5px;
                height: 13px;
            }
            .pwText{
            	position: relative;
                left: 170px;
                top: 13px;
                
            }
}
        </style>
    </head>
    <body>
        <!-- Top Bar -->
        <div id="nav" class="stickyTop">
            <a href="petpics.com/home" style="float: left;">Home</a>
            <div  style="float: right">
                <form method="post" action="login.php">
                	<input type="text" placeholder="User ID" name="username" class="userText">
                    <input type="password" placeholder="Password" name="password" class="pwText">
                    <input type="submit" name="Login" value="Login" class="pwText">
                </form>
                
            </div>
        </div>
        
        <!-- Bottom Bar -->
        <div id = "nav" class="stickyBottom" style ="padding:3px">
            Copyright © Acme Inc.  All rights reser- okay, we didn't actually copyright anything.  Pls don't steal.
        </div>
        
        <!-- Website Name -->
        <div class="split left">
        	<div class="center" style="top: 30%">
        		<h1>Tailhub</h1>
            </div>
        </div>
        
        <!-- Account Creation Text Fields -->
        <div class="split right">
        	<div class="center" style="top: 30%">
        		<h2>Create a New Account</h2>
                <div>
                	<form method="post" action="createProfile.php">
                	    <input type="text" placeholder="First Name" name="firstname" class="registerText">
                	    <input type="text" placeholder="Last Name" name="lastname" class="registerText">
						<input type="text" placeholder="Username" name="username" class="registerText">
                	    <input type="email" placeholder="Email" name="email" class="registerText">
                    	<input type="password" placeholder="Password" name="password" class="registerText">
                	<h2>Birthday</h2>
                	<div style = "padding-right: 360px">
  						<select id="day">
    						<option value="Jan">Jan</option>
    						<option value="Feb">Feb</option>
    						<option value="Mar">Mar</option>
    						<option value="Apr">Apr</option>
                            <option value="May">May</option>
    						<option value="June">June</option>
    						<option value="July">July</option>
    						<option value="Aug">Aug</option>
                            <option value="Sept">Sept</option>
    						<option value="Oct">Oct</option>
    						<option value="Nov">Nov</option>
    						<option value="Dec">Dec</option>
  						</select>
  						<br><br>    
                	</div>
                	<div style = "padding-right: 375px">
  						<select id="month">
    						<option value="1">01</option>
    						<option value="2">02</option>
    						<option value="3">03</option>
    						<option value="4">04</option>
                            <option value="5">05</option>
    						<option value="6">06</option>
    						<option value="7">07</option>
                            <option value="8">08</option>
    						<option value="9">09</option>
    						<option value="10">10</option>
    						<option value="11">11</option>
                            <option value="12">12</option>
    						<option value="13">13</option>
    						<option value="14">14</option>
    						<option value="15">15</option>
                            <option value="16">16</option>
    						<option value="17">17</option>
    						<option value="18">18</option>
    						<option value="19">19</option>
                            <option value="20">20</option>
    						<option value="21">21</option>
    						<option value="22">22</option>
    						<option value="23">23</option>
                            <option value="24">24</option>
    						<option value="25">25</option>
    						<option value="26">26</option>
    						<option value="27">27</option>
                            <option value="28">28</option>
    						<option value="29">29</option>
    						<option value="30">30</option>
    						<option value="31">31</option>
  						</select>
  						<br><br>        
                	</div>        
                	<div style = "padding-right: 360px">
						<select id="year">
						<?php
						    for ($i=1918; $i<=2000; $i++)
						    {
						        ?>
						            <option value="<?php echo $i; ?>"><?php echo $i;?></option>
						        <?php
						    }
						?>
						</select>
  						<br><br>
                	</div>
                	<div style = "padding-right: 350px">
  						<select id="gender">
    						<option value="female">Female</option>
    						<option value="male">Male</option>
  						</select>
  						<br><br>
                        <input type="submit" name="Register" value="Register" style= "margin-right: 5px">
					</div>
                    </form>
                </div>
            </div>
        </div>
        
    </body>
</html>
