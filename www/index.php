<!DOCTYPE html>
<html>
<head>
	<?php include("includes/head.php");?>
</head>
<body>


	<div class="overlay"></div>
	<div class="video-container">
	<video autoplay muted loop id="myVideo" src="resources/cover_vid.mp4" type="video/mp4"></video>
	</div>
	<div class="container">

		<div class="outer">
  <div class="middle">
    <div class="inner">
      		<div class='text-center'>
			<div class="text-white">
				<h3>Hi! We're glad you're here.</h3>
				<p>Our automated software will help you figure out what you need to do next.<br>
				First, take a picture of the court document you received in the mail.</p>
			</div>

			<form action="result.php" method="post" enctype="multipart/form-data">
			    <label for="userFile">
			    	<div class="btn btn-outline-light">
			    		<?php
			    			if($detect->isMobile()) {
			    				echo "Take Picture";
			    			}
			    			else {
			    				echo "Upload File";
			    			}
			    		?>
			    	</div>
			    </label>
			    <input class="file-upload" type="file" name="userFile" onchange="this.form.submit()" id="userFile" capture>
			</form>
		</div>
    </div>
  </div>
</div>


	</div>

	<?php include("includes/footer.php") ?>
</body>
</html>