<?php
header('Content-Type: application/json');

$dbhost = "localhost";
$dbuser = "root";
$dbpassword = "";
$dbname = "pms";

$conn = new mysqli($dbhost, $dbuser, $dbpassword, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed"]));
}

// Fix 1: Ensure you're only executing the query ONCE
$sql = "SELECT 
          service_id, 
          price, 
          is_available, 
          TIME_FORMAT(start_time, '%H:%i:%s') as start_time, 
          TIME_FORMAT(end_time, '%H:%i:%s') as end_time 
        FROM services 
        WHERE service_id BETWEEN 1 AND 6
        ORDER BY service_id";

$result = $conn->query($sql);

// Fix 2: Properly format the response as a single array
$services = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $services[] = [
            'id' => (int)$row['service_id'],
            'price' => (float)$row['price'],
            'is_available' => (bool)$row['is_available'],
            'start_time' => $row['start_time'],
            'end_time' => $row['end_time']
        ];
    }
}

// Fix 3: Make sure you're not accidentally nesting arrays
echo json_encode($services); // NOT json_encode([$services]) or similar
$conn->close();
?>