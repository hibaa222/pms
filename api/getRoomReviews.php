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

$type_id = $_GET['type_id'] ?? null;
if (!$type_id || !is_numeric($type_id)) {
    http_response_code(400);  // Bad request
    die(json_encode(["error" => "Valid room type ID not specified"]));
}

// Get all review data including rating, comment, and date
$query = "SELECT r.review_id, r.rating, r.comment, r.review_date as date, 
                 u.name as username -- Change this to u.name if that's the correct column in users table
          FROM reviews r 
          JOIN users u ON r.user_id = u.user_id 
          WHERE r.type_id = ?
          ORDER BY r.review_date DESC";

$stmt = $conn->prepare($query);
$stmt->bind_param("i", $type_id);
$stmt->execute();
$result = $stmt->get_result();

$reviews = [];
while ($row = $result->fetch_assoc()) {
    $reviews[] = [
        'review_id' => $row['review_id'],
        'rating' => $row['rating'],
        'comment' => $row['comment'],
        'date' => $row['date'],
        'username' => $row['username']  // Or $row['name'] if you changed the query
    ];
}

echo json_encode(['success' => true, 'reviews' => $reviews]);

$stmt->close();
$conn->close();
?>