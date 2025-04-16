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
    echo json_encode(["success" => false, "message" => "You must be logged in to book a service"]);
    exit();
}

$service_id = $_POST['service_id'] ?? null;
$start_date_time = $_POST['start_date_time'] ?? null;
$end_date_time = $_POST['end_date_time'] ?? null;
$user_id = $_SESSION['user_id'];

if (!$service_id || !$start_date_time) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit();
}

$query = "INSERT INTO booked_services (user_id, service_id, start_date_time, end_date_time, payment_status) 
          VALUES (?, ?, ?, ?, 'pending')";
$stmt = mysqli_prepare($link, $query);
mysqli_stmt_bind_param($stmt, "iiss", $user_id, $service_id, $start_date_time, $end_date_time);

if ($stmt && mysqli_stmt_execute($stmt)) {
    echo json_encode(["success" => true, "message" => "Booking successful"]);
} else {
    echo json_encode(["success" => false, "message" => "Booking failed"]);
}

mysqli_stmt_close($stmt);
mysqli_close($link);
?>