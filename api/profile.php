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
    die("Database connection failed: " . mysqli_connect_error());
}

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

$user_id = $_SESSION['user_id'];

// Query to fetch user profile info from the database
$query = "SELECT name, email, phone, address FROM users WHERE user_id = ?";
$stmt = mysqli_prepare($link, $query);

if ($stmt) {
    // Bind user_id as parameter
    mysqli_stmt_bind_param($stmt, "i", $user_id);

    // Execute the query
    mysqli_stmt_execute($stmt);

    // Bind the result to variables
    mysqli_stmt_bind_result($stmt, $full_name, $email, $phone, $address);

    // Fetch the result
    if (mysqli_stmt_fetch($stmt)) {
        // Split full name into first and last name
        $name_parts = explode(" ", $full_name, 2); // Split by the first space
        $first_name = $name_parts[0]; // The first part is the first name
        $last_name = isset($name_parts[1]) ? $name_parts[1] : ""; // The second part is the last name, if available

        // Return user info as JSON to frontend
        $user_info = [
            "first_name" => $first_name,
            "last_name" => $last_name,
            "email" => $email,
            "phone" => $phone,
            "address" => $address
        ];

        // Encode the user info as a JSON response
        echo json_encode(["success" => true, "user_info" => $user_info]);
    } else {
        // No user found
        echo json_encode(["success" => false, "message" => "User not found."]);
    }

    // Close the statement
    mysqli_stmt_close($stmt);
} else {
    // Query preparation failed
    echo json_encode(["success" => false, "message" => "Database query error."]);
}

// Close the database connection
mysqli_close($link);
?>
