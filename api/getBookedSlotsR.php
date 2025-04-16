<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

session_start();
require_once 'session.php';

// Database configuration
$dbhost = "localhost";
$dbuser = "root";
$dbpassword = "";
$dbname = "pms";

// Create connection
$conn = mysqli_connect($dbhost, $dbuser, $dbpassword, $dbname);

if (!$conn) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit();
}

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "You must be logged in"]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $date = $_GET['date'] ?? null;
    
    if (!$date) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Date parameter is required"]);
        exit();
    }
    
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Invalid date format"]);
        exit();
    }
    
    $query = "SELECT start_date_time, end_date_time FROM resto_reserve WHERE DATE(start_date_time) = ?";
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "s", $date);
    mysqli_stmt_execute($stmt);
    
    $result = mysqli_stmt_get_result($stmt);
    $bookedSlots = [];
    
    while ($row = mysqli_fetch_assoc($result)) {
        $bookedSlots[] = [
            'start_date_time' => $row['start_date_time'],
            'end_date_time' => $row['end_date_time']
        ];
    }
    
    echo json_encode(["success" => true, "booked_slots" => $bookedSlots]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Invalid JSON"]);
        exit();
    }
    
    $requiredFields = ['start_date_time', 'end_date_time', 'nb_guests'];
    foreach ($requiredFields as $field) {
        if (empty($data[$field])) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Missing $field"]);
            exit();
        }
    }
    
    // Validate date/time formats
    $start_date_time = mysqli_real_escape_string($conn, $data['start_date_time']);
    $end_date_time = mysqli_real_escape_string($conn, $data['end_date_time']);
    $nb_guests = (int)$data['nb_guests'];
    $requests = $data['requests'] ?? null;
    $user_id = $_SESSION['user_id'];

    // Add this right after you get the POST data:
if (!DateTime::createFromFormat('Y-m-d H:i:s', $start_date_time) || 
!DateTime::createFromFormat('Y-m-d H:i:s', $end_date_time)) {
http_response_code(400);
echo json_encode([
    "success" => false,
    "message" => "Invalid datetime format. Required format: YYYY-MM-DD HH:MM:SS"
]);
exit();
}
}

http_response_code(405);
echo json_encode(["success" => false, "message" => "Method not allowed"]);
?>