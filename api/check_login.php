session_start();

function checkLogin() {
    return isset($_SESSION['user_id']) ? ["logged_in" => true, "user_id" => $_SESSION['user_id'], "email" => $_SESSION['email"]] : ["logged_in" => false];
}
