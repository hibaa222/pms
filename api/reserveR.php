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

// Read raw JSON input
$input = json_decode(file_get_contents("php://input"), true);

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "You must be logged in to make a reservation"]);
    exit();
}

$user_id = $_SESSION['user_id'];
$start_date_time = $input['start_date_time'] ?? null;
$end_date_time = $input['end_date_time'] ?? null;
$nb_guests = $input['nb_guests'] ?? 'none';
$requests = isset($input['requests']) && trim($input['requests']) !== '' ? $input['requests'] : 'none';


if (!$start_date_time || !$end_date_time || !$nb_guests) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit();
}

// Prepare insert query
$query = "INSERT INTO resto_reserve (user_id, start_date_time, end_date_time, nb_guests, requests, payment_status)
          VALUES (?, ?, ?, ?, ?, 'pending')";

$stmt = mysqli_prepare($link, $query);
mysqli_stmt_bind_param($stmt, "issis", $user_id, $start_date_time, $end_date_time, $nb_guests, $requests);

if ($stmt && mysqli_stmt_execute($stmt)) {
    $reservation_id = mysqli_insert_id($link);
    echo json_encode(["success" => true, "message" => "Reservation successful", "reservation_id" => $reservation_id]);
} else {
    echo json_encode(["success" => false, "message" => "Reservation failed"]);
}

mysqli_stmt_close($stmt);
mysqli_close($link);
?>
