<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'session.php';

$dbhost = "localhost";
$dbuser = "root";
$dbpassword = "";
$dbname = "pms";

$link = mysqli_connect($dbhost, $dbuser, $dbpassword, $dbname);

if (!$link) {
    echo json_encode([]);
    exit();
}

$service_id = $_GET['service_id'] ?? null;
$date = $_GET['date'] ?? null;

if (!$service_id || !$date) {
    echo json_encode([]);
    exit();
}

// Get all bookings for this service on this date
$query = "SELECT start_date_time, end_date_time 
          FROM booked_services 
          WHERE service_id = ? 
          AND DATE(start_date_time) = ?";
$stmt = mysqli_prepare($link, $query);
mysqli_stmt_bind_param($stmt, "is", $service_id, $date);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$bookedSlots = [];
while ($row = mysqli_fetch_assoc($result)) {
    $bookedSlots[] = $row;
}

echo json_encode($bookedSlots);
mysqli_close($link);
?>