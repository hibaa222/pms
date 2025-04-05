<?php
header('Content-Type: application/json'); 
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$dbhost = "localhost";
$dbuser = "root";
$dbpassword = "";
$dbname = "pms";

$link = mysqli_connect($dbhost, $dbuser, $dbpassword, $dbname);

if (!$link) {
    die(json_encode(["success" => false, "message" => "Database connection failed: " . mysqli_connect_error()]));
}

$name = $_POST["name"]; 
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';

if (empty($name) || empty($email) || empty($password) || empty($phone)) {
    echo json_encode(["success" => false, "message" => "Name, email, phone, and password are required."]);
    exit;
}

$query = "SELECT email FROM Users WHERE email = ?";
$stmt = mysqli_prepare($link, $query);
mysqli_stmt_bind_param($stmt, "s", $email);
mysqli_stmt_execute($stmt);
mysqli_stmt_store_result($stmt);

if (mysqli_stmt_num_rows($stmt) > 0) {
    echo json_encode(["success" => false, "message" => "Email already exists."]);
    exit;
}

mysqli_stmt_close($stmt);

$hashed_password = password_hash($password, PASSWORD_DEFAULT);

$insert_query = "INSERT INTO Users (name, email, phone, password, role) VALUES (?, ?, ?, ?, 'client')";
$stmt = mysqli_prepare($link, $insert_query);
mysqli_stmt_bind_param($stmt, "ssss", $name, $email, $phone, $hashed_password);

if (mysqli_stmt_execute($stmt)) {
    echo json_encode(["success" => true, "message" => "User created successfully."]);
} else {
    echo json_encode(["success" => false, "message" => "Error creating user: " . mysqli_error($link)]);
}

mysqli_stmt_close($stmt);
mysqli_close($link);
?>
