<!doctype html>

<html>
<head>

	<?php include("includes/head.php");?>
	<?php
		$tmp_name = $_FILES['userFile']['tmp_name'];
		$dst_name = __DIR__.'/uploads/'.$_FILES["userFile"]['name'];
		if (move_uploaded_file($tmp_name, $dst_name)) {
			$command = escapeshellcmd('python3.7 get_title.py '.$dst_name);
			$output = shell_exec($command);
			if ($output != '') {
				$myarr = explode("\n", $output);
				$file_title = $myarr[0];
				$type = $myarr[1];
				if($type == "complaint" || $type == "motion" || $type == "summons") {
					$success = true;
				}
				else {
					$success = false;
				}


			}
			else {
				$success = false;
			}
		} else {
			$success = false;
		}
	?>

</head>
<body>
	<?php include("includes/topbar.php") ?>
	<div class="container">
		<?php if($success): ?>
			<div class="col-12">
				<div class="section-body">

					<?php if($type == "complaint" || $type == "summons"):?>
						<p>Ok, looks like the document you received is
							<?php
								if($type == "complaint") {
									echo "Complaint";
								}
								else {
									echo "Summons";
								}?>. </p>

						<p>With that document, you should have also received
							<?php
								if($type == "complaint") {
									echo "Summons";
								}
								else {
									echo "Complaint";
								}
							?>.</p>

						<p>You have 21 days--from the day the summons and complaint were served--to file your next document so that you don't miss your deadline.</p>

						<p>You must file <a href="resources/answer.pdf" target="_blank">an answer to the complaint</a> or you will lose automatically.</p>

						<p>If you would like, you may also submit <a href="resources/counterclaim.pdf" target="_blank">a counterclaim</a> with <a href="resources/coversheet.pdf" target="_blank">a coversheet</a>.</p>

					<?php elseif ($type == "motion"):?>
						<p>Ok, it looks like the document you received is a <?php echo $file_title;?>. </p>

						<p>You have 14 days--from the day the motion was served--to file your next document so that you don't miss your deadline.</p>

						<p>Most people file <a href="resources/memorandum.pdf" target="_blank">a Memorandum Opposed to the Motion</a>.</p>

						<p>If you agree with everything in the motion you can submit <a href="resources/stipulation.pdf" target="_blank">a Stipulation to the Motion</a> instead.</p>


					<?php endif?>
					<p>You can fill it out with the links above, file it with the court, and send it to the opposing party. It must be sent as a paper document through the mail.</p>

						<p>We can print, file, and serve it for you for $15.</p>
					<div class="text-center">
						<div id="file-btn" class="btn btn-outline-secondary">File it for me!</div>
					</div>
				</div>
			</div>

			<div id="upload-section" class="col-12">
				<div class="section-body">
					<div class="text-center">
						<label for="userFile">
			    	<div class="btn btn-outline-secondary">Upload Form
			    	</div>
			    </label>
			    <input class="file-upload" type="file" name="userFile" onchange="$('#pay-section').show();" id="userFile" capture>
					</div>
				</div>
			</div>

			<div id="pay-section" class="col-12">
				<div class="section-body">
					<div class="text-center">
						<form action="your-server-side-code" method="POST">
						  <script
						    src="https://checkout.stripe.com/checkout.js" class="stripe-button"
						    data-key="pk_test_TYooMQauvdEDq54NiTphI7jx"
						    data-amount="1500"
						    data-name="Stripe.com"
						    data-description="Example charge"
						    data-image="https://stripe.com/img/documentation/checkout/marketplace.png"
						    data-locale="auto"
						    data-zip-code="true">
						  </script>
						</form>
					</div>
				</div>
			</div>
		<?php else: ?>
			<p>
				We were unable to receive the file you uploaded, please <a href="index.php">try again</a>.
			</p>
		<?php endif ?>
	</div>

	<?php include("includes/footer.php") ?>
	<script>
		$(document).ready(function() {
			$("#upload-section").hide();
			$("#pay-section").hide();
			$("#file-btn").click(function() {
				$("#upload-section").show();
			});
			$("#upload-btn").click(function() {
				$("#pay-section").show();
			});

		});
	</script>
</body>
</html>