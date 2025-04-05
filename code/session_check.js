fetch('../api/check_session.php')
.then(response => response.json())
.then(data => {
    if (data.logged_in) {
        console.log("User is logged in:", data);
    } else {
        console.log("User is NOT logged in.");
    }
});
