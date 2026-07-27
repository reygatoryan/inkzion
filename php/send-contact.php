<?php
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: ../contact.html");
    exit;
}

$to = "ryanreygato@gmail.com";

$name = htmlspecialchars(trim($_POST["name"] ?? ""));
$email = htmlspecialchars(trim($_POST["email"] ?? ""));
$subject = htmlspecialchars(trim($_POST["subject"] ?? ""));
$message = htmlspecialchars(trim($_POST["message"] ?? ""));

if (empty($name) || empty($email) || empty($subject) || empty($message)) {
    header("Location: ../contact.html?status=error&msg=All fields are required.");
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header("Location: ../contact.html?status=error&msg=Invalid email address.");
    exit;
}

$email_subject = "Contact Form: $subject - InKZion Spectrum Ads";

$email_body = "
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; }
        .field { margin-bottom: 16px; }
        .label { font-weight: 700; color: #1e293b; }
        .value { color: #475569; margin-top: 4px; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; color: #94a3b8; font-size: 12px; }
    </style>
</head>
<body>
    <div class='header'>
        <h2>New Contact Form Submission</h2>
    </div>
    <div class='content'>
        <div class='field'>
            <div class='label'>Name:</div>
            <div class='value'>$name</div>
        </div>
        <div class='field'>
            <div class='label'>Email:</div>
            <div class='value'>$email</div>
        </div>
        <div class='field'>
            <div class='label'>Subject:</div>
            <div class='value'>$subject</div>
        </div>
        <div class='field'>
            <div class='label'>Message:</div>
            <div class='value'>$message</div>
        </div>
    </div>
    <div class='footer'>
        <p>Sent via InKZion Spectrum Ads Contact Form</p>
    </div>
</body>
</html>
";

$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=UTF-8\r\n";
$headers .= "From: InKZion Spectrum Ads <ryanreygato@gmail.com>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

if (mail($to, $email_subject, $email_body, $headers)) {
    header("Location: ../contact.html?status=success");
} else {
    header("Location: ../contact.html?status=error&msg=Failed to send message. Please try again.");
}
exit;
