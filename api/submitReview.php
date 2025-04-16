<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$dbhost = "localhost";
$dbuser = "root";
$dbpassword = "";
$dbname = "pms";

require_once 'session.php';
$link = mysqli_connect($dbhost, $dbuser, $dbpassword, $dbname); 
if (!$link) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit();
}

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "You must be logged in to book a service"]);
    exit();
}

// Get POST data
$data = $_POST;

// Validate required fields
if (empty($data['type_id']) || empty($data['rating'])) {
    http_response_code(400);
    die(json_encode(['success' => false, 'message' => 'Missing required fields']));
}



// Prepare and execute query
$stmt = $link->prepare("INSERT INTO reviews (user_id, type_id, rating, comment, review_date) VALUES (?, ?, ?, ?, NOW())");
$stmt->bind_param("iiis", $_SESSION['user_id'], $data['type_id'], $data['rating'], $data['comment']);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Review submitted successfully']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to submit review']);
}

$stmt->close();
$link->close();
?>