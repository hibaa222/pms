document.addEventListener('DOMContentLoaded', async function() {
    document.getElementById("reserve-btn")?.addEventListener("click", function(e) {
        e.preventDefault();
        
const startDate = document.getElementById("startDate").value; // Add this
const endDate = document.getElementById("endDate").value; // Add this
const timeSlotSelect = document.getElementById("timeSlotSelect"); // Add this
const selectedTimeSlot = timeSlotSelect.options[timeSlotSelect.selectedIndex]; // Add this
        const selectedOption = document.getElementById("serviceSelect").options[document.getElementById("serviceSelect").selectedIndex];
        const serviceId = selectedOption.dataset.serviceId;
        if (!selectedOption?.dataset) {
            alert("Please select a service");
            return;
        }
        
        // For services with time slots (massage, facial, sauna)
        if (SERVICE_CONFIG[serviceId]?.showTimeSlots) {
            if (!selectedTimeSlot?.value) {
                alert("Please select a time slot");
                return;
            }
            var start_datetime = selectedTimeSlot.value;
            var end_datetime = selectedTimeSlot.dataset.endTime;
        } 
        // For all-day services (beach, pool, gym)
        else {
            if (!startDate) {
                alert("Please select a date");
                return;
            }
            // Use service's operating hours from database
            const start_time = selectedOption.dataset.startTime;
            const end_time = selectedOption.dataset.endTime;
            start_datetime = `${startDate} ${start_time}`;
            end_datetime = endDate ? `${endDate} ${end_time}` : `${startDate} ${end_time}`;
        }

        // Change the booking data preparation to:
const bookingData = {
    service_id: serviceId,
    start_date_time: start_datetime.replace(' ', 'T') + 'Z', // Format: "YYYY-MM-DDTHH:MM:SSZ"
    end_date_time: end_datetime.replace(' ', 'T') + 'Z'     // Format: "YYYY-MM-DDTHH:MM:SSZ"
};

        console.log("Submitting booking:", bookingData);
    
        fetch('../../api/check_session.php')
        .then(response => response.json())
        .then(data => {
            if (!data.logged_in) {
                alert("You must be logged in to book a service");
                window.location.href = `../login/login.html?redirect=${encodeURIComponent(window.location.href)}`;
                return;
            }
            return fetch('http://localhost/hilysa/api/reserveS.php', {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(bookingData)
            });
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert("Booking successful!");
                window.location.href = "confirmation.html";
            } else {
                alert("Booking failed: " + result.message);
            }
        })
        .catch(error => console.error("Error:", error));
    });
    // Static service templates (images, descriptions, etc.)
    const SERVICE_TEMPLATES = {
        // Combined template for both facial care (id:1) and massage (id:2)
        "personalized_treatments": {
            name: "Personalized Treatments",
            description: "A soothing treatment to melt away stress and tension.",
            images: [
                {
                    front: "../../imgs/service/massage1.jpg",
                    backTitle: "Massage Room",
                    backDesc: "Our serene massage room designed for ultimate relaxation"
                },
                {
                    front: "../../imgs/service/massage2.jpg",
                    backTitle: "Professional Therapists",
                    backDesc: "Certified therapists providing personalized treatments"
                },
                {
                    front: "../../imgs/service/massage3.jpg",
                    backTitle: "Premium Products",
                    backDesc: "We use only the highest quality oils and lotions"
                }
            ]
        },
        3: { // Sauna
            name: "Invigorating Sauna",
            description: "Detoxify your body and relax your muscles in our premium sauna.",
            images: [
                {
                    front: "../../imgs/service/sauna1.jpg",
                    backTitle: "Luxury Sauna Suite",
                    backDesc: "Premium wood construction with optimal heat retention"
                },
                {
                    front: "../../imgs/service/sauna2.jpg",
                    backTitle: "Traditional Elements",
                    backDesc: "Authentic heated stones for perfect steam experience"
                },
                {
                    front: "../../imgs/service/sauna3.jpg",
                    backTitle: "Steam Room",
                    backDesc: "Refreshing steam sessions to open pores and relax"
                }
            ]
        },
        4: { // Beach
            name: "Exclusive Private Beach",
            description: "Unwind on our pristine private beach with serene views.",
            images: [
                {
                    front: "../../imgs/service/beach.jpg",
                    backTitle: "Secluded Shoreline",
                    backDesc: "Half-mile of private beach exclusively for guests"
                },
                {
                    front: "../../imgs/service/beach2.jpg",
                    backTitle: "Water Activities",
                    backDesc: "Kayaks, paddleboards, and snorkeling gear available"
                },
                {
                    front: "../../imgs/service/beach3.jpg",
                    backTitle: "Sunset Views",
                    backDesc: "Breathtaking ocean sunsets from your private cabana"
                }
            ]
        },
        5: { // Pool
            name: "Refreshing Pool",
            description: "Swim in our crystal-clear pool and relax in the sun.",
            images: [
                {
                    front: "../../imgs/service/pool1.jpg",
                    backTitle: "Infinity Edge",
                    backDesc: "Stunning vanishing edge with ocean views"
                },
                {
                    front: "../../imgs/service/pool2.jpg",
                    backTitle: "Luxury Loungers",
                    backDesc: "Premium daybeds with butler service available"
                },
                {
                    front: "../../imgs/service/pool3.jpg",
                    backTitle: "Poolside Service",
                    backDesc: "Refreshments and snacks served at your lounge"
                }
            ]
        },
        6: { // Gym
            name: "Modern Gym",
            description: "Stay in shape with our fully equipped gym.",
            images: [
                {
                    front: "../../imgs/service/gym1.jpg",
                    backTitle: "Premium Equipment",
                    backDesc: "State-of-the-art cardio and strength machines"
                },
                {
                    front: "../../imgs/service/gym2.jpg",
                    backTitle: "Personal Training",
                    backDesc: "Certified trainers available for private sessions"
                },
                {
                    front: "../../imgs/service/gym3.jpg",
                    backTitle: "Group Classes",
                    backDesc: "Daily yoga, pilates, and HIIT classes included"
                }
            ]
        }
    };

    // Service configuration
    const SERVICE_CONFIG = {
        1: { // Facial Care
            showTimeSlots: true,
            duration: 45,
            buffer: 15,
            priceDetails: "(Facial Care 45min: X DA)"
        },
        2: { // Massage
            showTimeSlots: true,
            duration: 45,
            buffer: 15,
            priceDetails: "(Full Body Massage 45min: X DA)"
        },
        3: { // Sauna
            showTimeSlots: true,
            duration: 60,
            buffer: 15,
            priceDetails: "(60min private session including herbal infusion)"
        },
        4: { // Beach
            showTimeSlots: false,
            priceDetails: "(Includes sunbed and towel service)"
        },
        5: { // Pool
            showTimeSlots: false,
            priceDetails: "(Unlimited access)"
        },
        6: { // Gym
            showTimeSlots: false,
            priceDetails: "(Group classes included)"
        }
    };

    // Fetch ACTUAL dynamic service data from backend
    let dynamicServices = [];
    try {
        const response = await fetch('http://localhost/hilysa/api/services.php');
        if (!response.ok) throw new Error('Network response was not ok');
        dynamicServices = await response.json();
        
        // Validate response format
        if (!Array.isArray(dynamicServices)) throw new Error('Invalid data format');
    } catch (error) {
        console.error("Failed to fetch services:", error);
        // In production, you might want to show an error message to users
        return;
    }

    // Convert time string to display format (09:00:00 → 9:00 AM)
    function formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        const hourNum = parseInt(hours);
        const ampm = hourNum >= 12 ? 'PM' : 'AM';
        const displayHour = hourNum % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    }

    // Build the services sections
    function buildServices() {
        const container = document.getElementById('services-container');
        container.innerHTML = ''; // Clear existing content

        // Group services to avoid duplicates (special handling for ids 1 & 2)
        const servicesToShow = [];
        const hasFacial = dynamicServices.some(s => s.id === 1 && s.is_available);
        const hasMassage = dynamicServices.some(s => s.id === 2 && s.is_available);

        // Add personalized treatments if either sub-service is available
        if (hasFacial || hasMassage) {
            servicesToShow.push({
                id: "personalized_treatments",
                name: "Personalized Treatments",
                description: "A soothing treatment to melt away stress and tension.",
                subServices: [
                    dynamicServices.find(s => s.id === 1),
                    dynamicServices.find(s => s.id === 2)
                ].filter(Boolean)
            });
        }

        // Add other available services
        dynamicServices.forEach(service => {
            if (service.id > 2 && service.is_available) {
                servicesToShow.push(service);
            }
        });

        // Render each service
        servicesToShow.forEach(service => {
            if (service.id === "personalized_treatments") {
                renderPersonalizedTreatments(service);
            } else {
                renderStandardService(service);
            }
        });

        function renderPersonalizedTreatments(service) {
            const template = SERVICE_TEMPLATES.personalized_treatments;
            const section = document.createElement('section');
            section.className = 'service';
            
            // Get all available sub-services
            const availableSubServices = service.subServices.filter(s => s.is_available);
            
            // Create flip cards HTML
            const flipCardsHTML = template.images.map(image => `
                <div class="flip-card">
                    <div class="flip-card-inner">
                        <div class="flip-card-front">
                            <img src="${image.front}" alt="${image.backTitle}">
                        </div>
                        <div class="flip-card-back">
                            <h3>${image.backTitle}</h3>
                            <p>${image.backDesc}</p>
                        </div>
                    </div>
                </div>
            `).join('');

            // Create pricing HTML for all sub-services
            const pricingHTML = availableSubServices.map(sub => {
                const config = SERVICE_CONFIG[sub.id];
                return `
                    <div class="sub-service">
                        <span class="sub-service-name">${sub.id === 1 ? 'Facial Care' : 'Full Body Massage'}</span>
                        <span class="sub-service-price">${sub.price.toLocaleString()} DA</span>
                        <span class="sub-service-duration">${config.duration}min</span>
                    </div>
                `;
            }).join('');

            section.innerHTML = `
                <h2 class="service-title">${template.name}</h2>
                <p class="service-description">${template.description}</p>
                <p class="service-hours">Daily: ${formatTime(availableSubServices[0].start_time)} - ${formatTime(availableSubServices[0].end_time)}</p>
                <div class="service-pricing">
                    ${pricingHTML}
                </div>
                <div class="service-images">
                    ${flipCardsHTML}
                </div>
            `;

            container.appendChild(section);
        }

        function renderStandardService(dbService) {
            const template = SERVICE_TEMPLATES[dbService.id];
            if (!template) return;

            const config = SERVICE_CONFIG[dbService.id];
            
            // Create flip cards HTML
            const flipCardsHTML = template.images.map(image => `
                <div class="flip-card">
                    <div class="flip-card-inner">
                        <div class="flip-card-front">
                            <img src="${image.front}" alt="${image.backTitle}">
                        </div>
                        <div class="flip-card-back">
                            <h3>${image.backTitle}</h3>
                            <p>${image.backDesc}</p>
                        </div>
                    </div>
                </div>
            `).join('');

            // Update price details with actual price
            const priceDetails = config.priceDetails.replace('X DA', `${dbService.price.toLocaleString()} DA`);

            const section = document.createElement('section');
            section.className = 'service';
            section.dataset.serviceId = dbService.id;
            section.innerHTML = `
                <h2 class="service-title">${template.name}</h2>
                <p class="service-description">${template.description}</p>
                <p class="service-hours">Daily: ${formatTime(dbService.start_time)} - ${formatTime(dbService.end_time)}</p>
                <p class="service-pricing">
                    <span class="price">Starting from ${dbService.price.toLocaleString()} DA</span>
                    <span class="price-details">${priceDetails}</span>
                </p>
                <div class="service-images">
                    ${flipCardsHTML}
                </div>
            `;

            container.appendChild(section);
        }
    }

    // Add these new utility functions:

async function fetchBookedTimeSlots(serviceId, date) {
    try {
        const response = await fetch(`http://localhost/hilysa/api/getBookedSlots.php?service_id=${serviceId}&date=${date}`);
        if (!response.ok) throw new Error('Failed to fetch booked slots');
        const data = await response.json();
        
        // Validate response is an array
        if (!Array.isArray(data)) throw new Error('Invalid booked slots data');
        
        return data;
    } catch (error) {
        console.error("Error fetching booked slots:", error);
        return []; // Return empty array if there's an error
    }
}

function isSlotBooked(startDateTime, endDateTime, bookedSlots) {
    if (!bookedSlots || !bookedSlots.length) return false;
    
    try {
        const slotStart = new Date(startDateTime);
        const slotEnd = new Date(endDateTime);
        
        return bookedSlots.some(booked => {
            const bookedStart = new Date(booked.start_date_time);
            const bookedEnd = new Date(booked.end_date_time);
            
            // Check for time overlap
            return (slotStart < bookedEnd && slotEnd > bookedStart);
        });
    } catch (e) {
        console.error("Error checking slot availability:", e);
        return true; // If there's an error, assume slot is booked to be safe
    }
}

    // Initialize booking form with dynamic services
    function initBookingForm() {
        const elements = {
            serviceSelect: document.getElementById('serviceSelect'),
            startDate: document.getElementById('startDate'),
            endDate: document.getElementById('endDate'),
            timeSelection: document.getElementById('timeSelection'),
            timeSlotSelect: document.getElementById('timeSlotSelect'),
            form: document.getElementById('spaBooking')
        };

        // Clear and rebuild options
        elements.serviceSelect.innerHTML = '<option value="" disabled selected>Select Your Experience</option>';

        dynamicServices.forEach(dbService => {
            if (!dbService.is_available) return;

            const config = SERVICE_CONFIG[dbService.id];
            if (!config) return;

            let displayName;
            if (dbService.id === 1) displayName = "Facial Care";
            else if (dbService.id === 2) displayName = "Full Body Massage";
            else displayName = SERVICE_TEMPLATES[dbService.id]?.name || `Service ${dbService.id}`;

            const option = document.createElement('option');
            option.value = displayName;
            option.textContent = `${displayName} (${dbService.price.toLocaleString()} DA)`;
            option.dataset.price = dbService.price;
            option.dataset.serviceId = dbService.id;
            option.dataset.startTime = dbService.start_time;
            option.dataset.endTime = dbService.end_time;
            
            elements.serviceSelect.appendChild(option);
        });

        // Initialize date inputs
        const today = new Date().toISOString().split('T')[0];
        elements.startDate.min = today;
        elements.endDate.min = today;

        // Generate time slots for a service
        async function generateTimeSlots(selectedOption) {
            elements.timeSlotSelect.innerHTML = '<option value="" disabled selected>Loading available slots...</option>';
            
            const serviceId = selectedOption.dataset.serviceId;
            const config = SERVICE_CONFIG[serviceId];
            if (!config?.showTimeSlots) return;
            
            // Get operating hours
            const startTime = selectedOption.dataset.startTime;
            const endTime = selectedOption.dataset.endTime;
            
            // Parse times
            const [startHour, startMinute] = startTime.split(':').map(Number);
            const [endHour, endMinute] = endTime.split(':').map(Number);
            
            let currentMinutes = startHour * 60 + startMinute;
            const endMinutes = endHour * 60 + endMinute;
            const slotDuration = config.duration;
            const interval = slotDuration + config.buffer;
            
            // Clear and show loading
            elements.timeSlotSelect.innerHTML = '<option value="" disabled selected>Loading available slots...</option>';
            
            try {
                // Fetch booked slots
                const bookedSlots = await fetchBookedTimeSlots(serviceId, elements.startDate.value);
                
                // Regenerate options with actual content
                elements.timeSlotSelect.innerHTML = '<option value="" disabled selected>Select a time slot</option>';
                
                let availableSlots = 0;
                
                while (currentMinutes + slotDuration <= endMinutes) {
                    const startHours = Math.floor(currentMinutes / 60);
                    const startMins = currentMinutes % 60;
                    const endTimeMinutes = currentMinutes + slotDuration;
                    const endHours = Math.floor(endTimeMinutes / 60);
                    const endMins = endTimeMinutes % 60;
                    
                    const displayText = `${padZero(startHours)}:${padZero(startMins)} - ${padZero(endHours)}:${padZero(endMins)}`;
                    const startDateTime = `${elements.startDate.value} ${padZero(startHours)}:${padZero(startMins)}:00`;
                    const endDateTime = `${elements.startDate.value} ${padZero(endHours)}:${padZero(endMins)}:00`;
                    
                    // Check availability
                    if (!isSlotBooked(startDateTime, endDateTime, bookedSlots)) {
                        const option = document.createElement('option');
                        option.value = startDateTime;
                        option.dataset.endTime = endDateTime;
                        option.textContent = displayText;
                        elements.timeSlotSelect.appendChild(option);
                        availableSlots++;
                    }
                    
                    currentMinutes += interval;
                }
                
                if (availableSlots === 0) {
                    elements.timeSlotSelect.innerHTML = '<option value="" disabled>No available time slots</option>';
                }
            } catch (error) {
                console.error("Error generating time slots:", error);
                elements.timeSlotSelect.innerHTML = '<option value="" disabled>Error loading slots</option>';
            }
        }

        async function generateTimeSlots(selectedOption) {
            elements.timeSlotSelect.innerHTML = '<option value="" disabled selected>Select a time slot</option>';
            
            const serviceId = selectedOption.dataset.serviceId;
            const config = SERVICE_CONFIG[serviceId];
            if (!config?.showTimeSlots) return;
            
            // Get times from the selected option's data attributes
            const startTime = selectedOption.dataset.startTime;
            const endTime = selectedOption.dataset.endTime;
            
            const [startHour, startMinute] = startTime.split(':').map(Number);
            const [endHour, endMinute] = endTime.split(':').map(Number);
            
            let currentMinutes = startHour * 60 + startMinute;
            const endMinutes = endHour * 60 + endMinute;
            const slotDuration = config.duration;
            const interval = slotDuration + config.buffer;
            
            // Fetch already booked time slots for this service and date
            const bookedSlots = await fetchBookedTimeSlots(serviceId, elements.startDate.value);
            
            while (currentMinutes + slotDuration <= endMinutes) {
                const startHours = Math.floor(currentMinutes / 60);
                const startMins = currentMinutes % 60;
                const endTimeMinutes = currentMinutes + slotDuration;
                const endHours = Math.floor(endTimeMinutes / 60);
                const endMins = endTimeMinutes % 60;
                
                const displayText = `${padZero(startHours)}:${padZero(startMins)} - ${padZero(endHours)}:${padZero(endMins)}`;
                const startDateTime = `${elements.startDate.value} ${padZero(startHours)}:${padZero(startMins)}:00`;
                const endDateTime = `${elements.startDate.value} ${padZero(endHours)}:${padZero(endMins)}:00`;
                
                // Check if this slot is available
                const isAvailable = !isSlotBooked(startDateTime, endDateTime, bookedSlots);
                
                if (isAvailable) {
                    const option = document.createElement('option');
                    option.value = startDateTime;
                    option.dataset.endTime = endDateTime;
                    option.textContent = displayText;
                    elements.timeSlotSelect.appendChild(option);
                }
                
                currentMinutes += interval;
            }
            
            if (elements.timeSlotSelect.options.length === 1) {
                elements.timeSlotSelect.innerHTML = '<option value="" disabled>No available time slots</option>';
            }
        }

        function padZero(num) {
            return num.toString().padStart(2, '0');
        }

        async function checkDates() {
            const selectedOption = elements.serviceSelect.options[elements.serviceSelect.selectedIndex];
            if (!selectedOption?.dataset) return;
            
            const isSameDay = elements.startDate.value && 
                             elements.endDate.value && 
                             elements.startDate.value === elements.endDate.value;
            
            const serviceId = selectedOption.dataset.serviceId;
            if (isSameDay && SERVICE_CONFIG[serviceId]?.showTimeSlots) {
                elements.timeSelection.style.display = 'block';
                await generateTimeSlots(selectedOption);
            } else {
                elements.timeSelection.style.display = 'none';
                elements.timeSlotSelect.innerHTML = '<option value="" disabled selected>Select a time slot</option>';
            }
        }

        // Event listeners
        elements.startDate.addEventListener('change', async function() {
            await checkDates();
        });
        elements.endDate.addEventListener('change', async function() {
            await checkDates();
        });
        elements.serviceSelect.addEventListener('change', async function() {
            await checkDates();
        });

        elements.form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const selectedOption = elements.serviceSelect.options[elements.serviceSelect.selectedIndex];
            const bookingData = {
                service_id: selectedOption.dataset.serviceId,
                service_name: elements.serviceSelect.value,
                date: elements.startDate.value,
                price: selectedOption.dataset.price
            };
            
            const serviceId = selectedOption.dataset.serviceId;
            if (SERVICE_CONFIG[serviceId]?.showTimeSlots) {
                const timeOption = elements.timeSlotSelect.options[elements.timeSlotSelect.selectedIndex];
                bookingData.start_datetime = timeOption.value;
                bookingData.end_datetime = timeOption.dataset.endTime;
            }
            
            console.log("Booking Data:", bookingData);
            // Submit to your backend API
        });
    }

    // Initialize the page
    buildServices();
    initBookingForm();

    // Mobile menu toggle
    function toggleMenu() {
        const mobileNav = document.getElementById('mobileNav');
        mobileNav.style.display = mobileNav.style.display === 'block' ? 'none' : 'block';
    }
    window.toggleMenu = toggleMenu;
});