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
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit();
}

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "You must be logged in to reserve a room."]);
    exit;
}

$room_type = $_POST['roomType'] ?? null;
$check_in = $_POST['check_in'] ?? null;
$check_out = $_POST['check_out'] ?? null;
$user_id = $_SESSION['user_id'];

$query = "INSERT INTO reservations (user_id, room_type, check_in, check_out, status, payment_status) 
          VALUES (?, ?, ?, ?, 'pending', 'unpaid')";
$stmt = mysqli_prepare($link, $query);
mysqli_stmt_bind_param($stmt, "ssss", $user_id, $room_type, $check_in, $check_out);


if ($stmt) {
    mysqli_stmt_bind_param($stmt, "ssss", $user_id, $room_type, $check_in, $check_out);
    $execute = mysqli_stmt_execute($stmt);

    if ($execute) {
        echo json_encode(["success" => true, "message" => "Reservation successful"]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to reserve room"]);
    }

    mysqli_stmt_close($stmt);
} else {
    echo json_encode(["success" => false, "message" => "Database query error"]);
}

mysqli_close($link);
?>
