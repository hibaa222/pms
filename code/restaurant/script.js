document.addEventListener("DOMContentLoaded", function() {
    console.log("Restaurant reservation system loaded");

    const RESTAURANT_SLOT_DURATION = 60; // 2 hours per reservation
    const RESTAURANT_BUFFER_TIME = 15; // 30 minutes between reservations
    const RESTAURANT_OPENING_TIME = "06:00:00";
    const RESTAURANT_CLOSING_TIME = "23:00:00";

    // Get elements
    const modal = document.getElementById("reservation-modal");
    const mButton = document.getElementById("Mbutton");
    const closeBtn = document.querySelector(".close");
    const reserveBtn = document.getElementById("reserve-btn");
    const dateInput = document.getElementById("date");
    const guestsInput = document.getElementById("guests");
    const requestsInput = document.getElementById("requests");
    const timeSlotSelect = document.getElementById("timeSlotSelect");
    const timeSelectionDiv = document.getElementById("timeSelection");

    // Mbutton - Login check and modal display
    mButton.addEventListener("click", async function(e) {
        e.preventDefault();
        
        try {
            const response = await fetch('../../api/check_session.php');
            if (!response.ok) throw new Error('Network error');
            
            const data = await response.json();
            
            if (data.logged_in) {
                modal.style.display = "flex";
                
                // Initialize date picker
                const today = new Date().toISOString().split('T')[0];
                dateInput.min = today;
                dateInput.value = today;
                
                // Load time slots for today
                await loadTimeSlots(today);
            } else {
                alert("Please login to make reservations");
                window.location.href = `../login/login.html?redirect=${encodeURIComponent(window.location.href)}`;
            }
        } catch (error) {
            console.error("Login check failed:", error);
            alert("Error checking login status");
        }
    });

    // Date change handler
    dateInput.addEventListener("change", async function() {
        if (dateInput.value) {
            await loadTimeSlots(dateInput.value);
        }
    });

    // Load available time slots
    async function loadTimeSlots(date) {
        timeSlotSelect.innerHTML = '<option value="" disabled selected>Loading available slots...</option>';
        timeSelectionDiv.style.display = 'block';
        
        try {
            const bookedSlots = await fetchBookedSlots(date);
            const allSlots = generateAllSlots();
            const availableSlots = filterAvailableSlots(allSlots, bookedSlots);
            populateTimeSlots(availableSlots);
        } catch (error) {
            console.error("Error loading time slots:", error);
            timeSlotSelect.innerHTML = '<option value="" disabled>Error loading slots</option>';
        }
    }

    // Fetch booked slots from API
    async function fetchBookedSlots(date) {
        const url = `http://localhost/hilysa/api/getBookedSlotsR.php?date=${date}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return Array.isArray(data.booked_slots) ? data.booked_slots : [];
    }

    // Generate all possible time slots for restaurant
    function generateAllSlots() {
        const slots = [];
        const [openHour, openMinute] = RESTAURANT_OPENING_TIME.split(':').map(Number);
        const [closeHour, closeMinute] = RESTAURANT_CLOSING_TIME.split(':').map(Number);
        
        let currentMinutes = openHour * 60 + openMinute;
        const endMinutes = closeHour * 60 + closeMinute;
        const interval = RESTAURANT_SLOT_DURATION + RESTAURANT_BUFFER_TIME;
        
        while (currentMinutes + RESTAURANT_SLOT_DURATION <= endMinutes) {
            const startHours = Math.floor(currentMinutes / 60);
            const startMins = currentMinutes % 60;
            const endTimeMinutes = currentMinutes + RESTAURANT_SLOT_DURATION;
            const endHours = Math.floor(endTimeMinutes / 60);
            const endMins = endTimeMinutes % 60;
            
            slots.push({
                start: `${padZero(startHours)}:${padZero(startMins)}:00`,
                end: `${padZero(endHours)}:${padZero(endMins)}:00`,
                display: `${formatHour(startHours)}:${padZero(startMins)} - ${formatHour(endHours)}:${padZero(endMins)}`
            });
            
            currentMinutes += interval;
        }
        
        return slots;
    }

    // Filter out booked slots
    function filterAvailableSlots(allSlots, bookedSlots) {
        return allSlots.filter(slot => {
            const slotStart = new Date(`${dateInput.value}T${slot.start}`);
            const slotEnd = new Date(`${dateInput.value}T${slot.end}`);
            
            return !bookedSlots.some(booked => {
                const bookedStart = new Date(booked.start_date_time);
                const bookedEnd = new Date(booked.end_date_time);
                return slotStart < bookedEnd && slotEnd > bookedStart;
            });
        });
    }

    // Populate time slot dropdown
    function populateTimeSlots(slots) {
        timeSlotSelect.innerHTML = slots.length > 0
            ? '<option value="" disabled selected>Select a time slot</option>'
            : '<option value="" disabled>No available slots for this date</option>';
            
        slots.forEach(slot => {
            const option = document.createElement('option');
            option.value = `${dateInput.value} ${slot.start}`;
            option.dataset.endTime = `${dateInput.value} ${slot.end}`;
            option.textContent = slot.display;
            timeSlotSelect.appendChild(option);
        });
    }

    // Reserve button handler
    reserveBtn.addEventListener("click", async function(e) {
        e.preventDefault();
        
        // Validate inputs
        if (!dateInput.value) {
            alert("Please select a date");
            return;
        }
        
        if (!timeSlotSelect.value) {
            alert("Please select a time slot");
            return;
        }
        
        if (!guestsInput.value || guestsInput.value < 1) {
            alert("Please enter number of guests");
            return;
        }

        try {
            // Get selected time slot values
            const selectedOption = timeSlotSelect.options[timeSlotSelect.selectedIndex];
            const datePart = timeSlotSelect.value.split(' ')[0]; // "YYYY-MM-DD"
            const startTime = timeSlotSelect.value.split(' ')[1]; // "HH:MM:00"
            const endTime = selectedOption.dataset.endTime.split(' ')[1]; // "HH:MM:00"
        
            // Prepare reservation data with proper datetime format
            const reservationData = {
                start_date_time: `${datePart} ${startTime}`,
                end_date_time: `${datePart} ${endTime}`,
                nb_guests: parseInt(guestsInput.value),
                requests: requestsInput.value.trim() || null // No length limit, empty becomes null
            };
        
            // Debug log before sending
            console.log("📤 Reservation data being sent:", reservationData);
        
            // Send to API
            const response = await fetch('http://localhost/hilysa/api/reserveR.php', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reservationData)
            });
        
            // Check for HTTP errors
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        
            const result = await response.json();
            
            // Check for API-level errors
            if (!result.success) {
                throw new Error(result.message || "Reservation failed");
            }
            else{alert(`Reservation successful!`/*Your booking reference: ${result.reservation_id}*/);
            window.location.href = "confirmation.html";}
            // Success handling
            
            modal.style.display = "none";
            document.querySelector("#reservation-modal form").reset();
        
        } catch (error) {
            console.error("Reservation error:", error);
            alert("Reservation failed: " + error.message);
        }
    });

    // Helper functions
    function padZero(num) {
        return num.toString().padStart(2, '0');
    }
    
    function formatHour(hours) {
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        return `${displayHours}${ampm}`;
    }

    // Modal close handlers
    closeBtn.addEventListener("click", () => modal.style.display = "none");
    window.addEventListener("click", (e) => e.target === modal && (modal.style.display = "none"));
});