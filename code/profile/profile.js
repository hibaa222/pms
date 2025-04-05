document.addEventListener("DOMContentLoaded", function () {
    // Check if the user is logged in
    fetch('http://localhost/hilysa/api/profile.php')
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                // If not logged in, redirect to login page
                window.location.href = 'http://localhost/hilysa/code/login/login.html';
                return;
            }

            // If logged in, populate the form with user data
            const userInfo = data.user_info;

            document.getElementById("firstName").value = userInfo.first_name;
            document.getElementById("lastName").value = userInfo.last_name;
            document.getElementById("email").value = userInfo.email;
            document.getElementById("phone").value = userInfo.phone;
            document.getElementById("address").value = userInfo.address;
        })
        .catch(error => {
            console.error('Error:', error);
        });

    // Save profile changes
    document.getElementById('saveProfile').addEventListener('click', function (e) {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;
        const address = document.getElementById("address").value;
        const oldPassword = document.getElementById("oldPassword").value;
        const newPassword = document.getElementById("newPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        // Validate password
        if (newPassword !== confirmPassword) {
            alert("New passwords do not match!");
            return;
        }

        // Create form data to send via POST
        const formData = new FormData();
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('address', address);
        formData.append('oldPassword', oldPassword);
        formData.append('newPassword', newPassword);

        fetch('http://localhost/hilysa/api/updateProfile.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Profile updated successfully!');
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});


document.addEventListener("DOMContentLoaded", function () {
    let sidebarItems = document.querySelectorAll(".sidebar li"); // Selecting all li items
    let contentSections = document.querySelectorAll(".content-section"); // Content sections

    if (!sidebarItems.length || !contentSections.length) return;

    // Set default active tab (Info)
    sidebarItems.forEach(i => i.classList.remove("active"));
    sidebarItems[0].classList.add("active"); // Make the first item active by default
    showSection("info"); // Show Info by default

    // Function to show the content for a given section
    function showSection(section) {
        // Hide all content sections
        contentSections.forEach(sec => sec.style.display = "none");

        // Show the content of the selected section
        let activeSection = document.getElementById(section);
        if (activeSection) {
            activeSection.style.display = "block";
        }
    }

    // Add event listeners to sidebar items
    sidebarItems.forEach(item => {
        item.addEventListener("click", function () {
            // Remove active class from all items
            sidebarItems.forEach(i => i.classList.remove("active"));

            // Add active class to the clicked item
            this.classList.add("active");

            // Show the corresponding content section
            showSection(this.getAttribute("data-section"));
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // This will display the "My Reservations" section when clicked in the sidebar
    const reservationsBtn = document.querySelector('li[data-section="reservations"]');
    const reservationsSection = document.getElementById('reservations');

    reservationsBtn.addEventListener('click', function () {
        // Hide the info section and show the reservations section
        document.getElementById('info').style.display = 'none';
        reservationsSection.style.display = 'block';

        // Fetch and display reservations
        fetchReservations();
    });

    function fetchReservations() {
        // Replace with your actual API endpoint
        fetch('your_api_endpoint_here')
            .then(response => response.json())
            .then(data => {
                const reservationsTableBody = document.querySelector('#reservationsTable tbody');
                reservationsTableBody.innerHTML = ''; // Clear the table

                // Iterate over the data and insert rows into the table
                data.forEach(reservation => {
                    const row = document.createElement('tr');

                    // Add room type (leave empty for now)
                    const roomTypeCell = document.createElement('td');
                    row.appendChild(roomTypeCell);

                    // Add status
                    const statusCell = document.createElement('td');
                    statusCell.textContent = reservation.status;
                    row.appendChild(statusCell);

                    // Add period (e.g., start_date to end_date)
                    const periodCell = document.createElement('td');
                    periodCell.textContent = `${reservation.start_date} - ${reservation.end_date}`;
                    row.appendChild(periodCell);

                    // Add payment status
                    const paymentStatusCell = document.createElement('td');
                    paymentStatusCell.textContent = reservation.payment_status;
                    row.appendChild(paymentStatusCell);

                    // Append the row to the table body
                    reservationsTableBody.appendChild(row);
                });
            })
            .catch(error => console.error('Error fetching reservations:', error));
    }
});

function logout() {
    fetch('http://localhost/hilysa/api/logout.php', {
        method: 'POST',
        credentials: 'include' // Ensure cookies are sent
    }).then(() => {
        window.location.href = 'http://localhost/hilysa/code/homepage/index.html';
    }).catch(error => console.error('Logout failed:', error));
}

