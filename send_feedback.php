<?php
$feedback = $_POST['feedback'];
$to = 'jadetindoy@hotmail.com'; // Your email address
$subject = 'Feedback from Your Site';
$message = "You have received new feedback:\n\n" . $feedback;
$headers = 'From: webmaster@example.com'; // Change this to your domain-specific email address

if (mail($to, $subject, $message, $headers)) {
    echo "Feedback sent successfully.";
} else {
    echo "Failed to send feedback.";
}
?>
