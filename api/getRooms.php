<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$dbhost = "localhost";
$dbuser = "root";
$dbpassword = "";
$dbname = "pms";

$conn = new mysqli($dbhost, $dbuser, $dbpassword, $dbname);

if ($conn->connect_error) {
    die(json_encode(['error' => 'Database connection failed']));
}

$query = "SELECT name, price, max_occupancy, amenities, description FROM room_types";
$result = $conn->query($query);

$rooms = [];
while ($row = $result->fetch_assoc()) {
    $rooms[] = $row;
}

echo json_encode($rooms);
$conn->close();
?>