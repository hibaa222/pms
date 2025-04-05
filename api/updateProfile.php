<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');


require_once 'session.php';

$dbhost = "localhost";
$dbuser = "root";
$dbpassword = "";
$dbname = "pms";

$link = mysqli_connect($dbhost, $dbuser, $dbpassword, $dbname);

if (!$link) {
    die(json_encode(["success" => false, "message" => "Database connection failed: " . mysqli_connect_error()]));
}

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "User not logged in."]);
    exit();
}

$user_id = $_SESSION['user_id'];

$email = $_POST['email'] ?? '';
$phone = $_POST['phone'] ?? '';
$address = $_POST['address'] ?? '';
$old_password = $_POST['oldPassword'] ?? '';
$new_password = $_POST['newPassword'] ?? '';

// Fetch the current password from the database
$query = "SELECT password FROM users WHERE user_id = ?";
$stmt = mysqli_prepare($link, $query);
mysqli_stmt_bind_param($stmt, "i", $user_id);
mysqli_stmt_execute($stmt);
mysqli_stmt_bind_result($stmt, $db_password);
mysqli_stmt_fetch($stmt);
mysqli_stmt_close($stmt);

// Check if the old password is correct
if ($old_password && !password_verify($old_password, $db_password)) {
    echo json_encode(["success" => false, "message" => "Old password is incorrect."]);
    exit();
}

// If there's a new password, hash it
if ($new_password) {
    $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
} else {
    $hashed_password = $db_password; // Use the old password if no new one is provided
}

// Update the user info in the database
$query = "UPDATE users SET email = ?, phone = ?, address = ?, password = ? WHERE user_id = ?";
$stmt = mysqli_prepare($link, $query);
mysqli_stmt_bind_param($stmt, "ssssi", $email, $phone, $address, $hashed_password, $user_id);

if (mysqli_stmt_execute($stmt)) {
    echo json_encode(["success" => true, "message" => "Profile updated successfully!"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to update profile."]);
}

mysqli_stmt_close($stmt);
mysqli_close($link);
?>
