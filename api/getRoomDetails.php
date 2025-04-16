<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$dbhost = "localhost";
$dbuser = "root";
$dbpassword = "";
$dbname = "pms";

$conn = new mysqli($dbhost, $dbuser, $dbpassword, $dbname);

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Database connection failed']));
}

$roomType = $conn->real_escape_string($_GET['type']);

$query = "SELECT type_id, name, price, amenities, description FROM room_types WHERE name = ? LIMIT 1";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $roomType);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $room = $result->fetch_assoc();
    echo json_encode(['success' => true, 'room' => $room]);
} else {
    echo json_encode(['success' => false, 'message' => 'Room not found']);
}

$stmt->close();
$conn->close();
?>