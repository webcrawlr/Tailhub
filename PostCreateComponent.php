
<!-- Put this in the profile --> 
<!-- Make sure file_uploads = on in php.ini, or pictures/media won't work!-->

<!-- Make sure session is started at the top; if it is, we can remove this bit-->
<?php 
    session_start();
?>
<form action="postProcess.php" method="post">
    <textarea name="text" rows="8" cols="80"></textarea>
    <br />
    <input type="submit" name="submitPost" value="Post">
</form>
<form action="upload.php" method="post" enctype="multipart/form-data">
    Select media to upload:
    <input type="file" name="file" id="file" /> 
    <input type="submit" value="Upload Image" name="submitPic">

</form>
