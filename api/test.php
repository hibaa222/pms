<?php
session_start();
if (isset($_SESSION['user_id'])) {
    echo "User is logged in. Email: " . $_SESSION['email'];
} else {
    echo "User is NOT logged in.";
}
?>
