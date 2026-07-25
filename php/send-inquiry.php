<?php
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: ../inquiry.html");
    exit;
}

$to = "info@inkzionspectrumads.com";

$name = htmlspecialchars(trim($_POST["name"] ?? ""));
$email = htmlspecialchars(trim($_POST["email"] ?? ""));
$phone = htmlspecialchars(trim($_POST["phone"] ?? "N/A"));
$company = htmlspecialchars(trim($_POST["company"] ?? "N/A"));
$product = htmlspecialchars(trim($_POST["product"] ?? "N/A"));
$quantity = htmlspecialchars(trim($_POST["quantity"] ?? "N/A"));
$deadline = htmlspecialchars(trim($_POST["deadline"] ?? "N/A"));
$details = htmlspecialchars(trim($_POST["details"] ?? ""));

if (empty($name) || empty($email) || empty($details)) {
    header("Location: ../inquiry.html?status=error&msg=Name, email, and project details are required.");
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header("Location: ../inquiry.html?status=error&msg=Invalid email address.");
    exit;
}

// Handle file upload
$file_info = "";
$upload_dir = "../uploads/";
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

if (isset($_FILES["file"]) && $_FILES["file"]["error"] === UPLOAD_ERR_OK) {
    $allowed = ["ai", "psd", "pdf", "eps", "png", "jpg", "jpeg"];
    $filename = basename($_FILES["file"]["name"]);
    $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));

    if (in_array($ext, $allowed)) {
        $new_filename = uniqid("file_") . "." . $ext;
        $dest = $upload_dir . $new_filename;

        if (move_uploaded_file($_FILES["file"]["tmp_name"], $dest)) {
            $file_info = "File attached: $filename ($dest)";
        } else {
            $file_info = "File upload failed.";
        }
    } else {
        $file_info = "File type not allowed: $ext";
    }
}

$email_subject = "New Inquiry: $product - InKZion Spectrum Ads";

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
        <h2>New Product Inquiry</h2>
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
            <div class='label'>Phone:</div>
            <div class='value'>$phone</div>
        </div>
        <div class='field'>
            <div class='label'>Company:</div>
            <div class='value'>$company</div>
        </div>
        <div class='field'>
            <div class='label'>Product of Interest:</div>
            <div class='value'>$product</div>
        </div>
        <div class='field'>
            <div class='label'>Estimated Quantity:</div>
            <div class='value'>$quantity</div>
        </div>
        <div class='field'>
            <div class='label'>Target Deadline:</div>
            <div class='value'>$deadline</div>
        </div>
        <div class='field'>
            <div class='label'>Project Details:</div>
            <div class='value'>$details</div>
        </div>
        <div class='field'>
            <div class='label'>File:</div>
            <div class='value'>$file_info</div>
        </div>
    </div>
    <div class='footer'>
        <p>Sent via InKZion Spectrum Ads Inquiry Form</p>
    </div>
</body>
</html>
";

$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=UTF-8\r\n";
$headers .= "From: $email\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

if (mail($to, $email_subject, $email_body, $headers)) {
    header("Location: ../inquiry.html?status=success");
} else {
    header("Location: ../inquiry.html?status=error&msg=Failed to send inquiry. Please try again.");
}
exit;
