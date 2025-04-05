<?php
require_once 'session.php';

if (isset($_SESSION['user_id'])) {
    echo json_encode([
        "logged_in" => true, 
        "user_id" => $_SESSION['user_id'], 
        "email" => $_SESSION['email']
    ]);
} else {
    echo json_encode(["logged_in" => false]);
}
?>
