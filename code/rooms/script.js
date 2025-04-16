document.addEventListener("DOMContentLoaded", function () {
    const roomsContainer = document.getElementById("rooms-container");
    const searchInput = document.getElementById("search-input");
    const filters = document.querySelectorAll(".sidebar input[type='checkbox']");
    const priceRange = document.getElementById("price-range");
    const priceValue = document.getElementById("price-value");
    const applyFiltersBtn = document.querySelector(".apply-filters");

    // Static image paths (keyed by room type)
    const roomImages = {
        'Single Room': '../../imgs/rooms/single.jpg',
        'Double Room': '../../imgs/rooms/double.jpg',
        'Twin Room': '../../imgs/rooms/twin.jpg',
        'Suite': '../../imgs/rooms/suite.jpg',
        'Family Room': '../../imgs/rooms/family.jpg',
        'Presidential Suite': '../../imgs/rooms/psuite.jpg',
        'Apartment Room': '../../imgs/rooms/apartement.jpg'
    };

    let rooms = [];
    let filteredRooms = [];

    // Fetch room data from database
    async function fetchRooms() {
        try {
            const response = await fetch('http://localhost/hilysa/api/getRooms.php');
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            
            // Transform database data - keep numbers as numbers
            rooms = data.map(room => ({
                type: room.name,
                price: parseFloat(room.price), // Only float conversion needed for currency
                description: room.description,
                image: roomImages[room.name] || '../../imgs/rooms/default.jpg',
                amenities: room.amenities.split(','),
                max_occupancy: parseInt(room.max_occupancy, 10) // Ensure integer
            }));
            
            filteredRooms = [...rooms];
            displayRooms();
        } catch (error) {
            console.error('Error fetching rooms:', error);
            roomsContainer.innerHTML = '<p>Error loading rooms. Please try again later.</p>';
        }
    }

    function displayRooms(roomList = filteredRooms) {
        roomsContainer.innerHTML = "";
    
        if (!roomList.length) {
            roomsContainer.innerHTML = "<p>No rooms found.</p>";
            return;
        }
    
        roomList.forEach(room => {
            const roomCard = document.createElement("div");
            roomCard.classList.add("room-card");
    
            roomCard.innerHTML = `
                <div class="room-image">
                    <img src="${room.image}" alt="${room.type}">
                </div>
                <div class="room-details">
                    <h3>${room.type}</h3>
                    <p style="font-weight: bold; color: #BC6794;">${Math.floor(room.price).toLocaleString()} DZD/night</p>
                    <p>${room.description}</p>
                    <div class="amenities">
                        ${room.amenities.map(a => `<span class="amenity">${a.charAt(0).toUpperCase() + a.slice(1)}</span>`).join("")}
                    </div>
                    <p class="occupancy-text">${room.max_occupancy === 1 ? '1 person' : `Up to ${room.max_occupancy} people`}</p>
                    <div class="button-container">
                        <a href="details.html?type=${encodeURIComponent(room.type)}" class="learn-more">See Details</a>
                    </div>
                </div>
            `;
    
            roomsContainer.appendChild(roomCard);
        });
    }

    function searchRooms() {
        const searchValue = searchInput.value.toLowerCase();
        filteredRooms = rooms.filter(room =>
            room.type.toLowerCase().includes(searchValue) ||
            room.description.toLowerCase().includes(searchValue)
        );

        filterRooms();
    }

    function filterRooms() {
        let selectedAmenities = [];
        filters.forEach(filter => {
            if (filter.checked) {
                selectedAmenities.push(filter.value);
            }
        });

        let maxPrice = parseInt(priceRange.value, 10);

        let finalRooms = filteredRooms.filter(room =>
            (selectedAmenities.length === 0 || selectedAmenities.every(amenity => room.amenities.includes(amenity))) &&
            room.price <= maxPrice
        );

        displayRooms(finalRooms);
    }

    function updatePriceValue() {
        priceValue.textContent = priceRange.value;
    }

    // Initialize
    fetchRooms();
    
    // Event listeners
    searchInput.addEventListener("input", searchRooms);
    applyFiltersBtn.addEventListener("click", filterRooms);
    priceRange.addEventListener("input", updatePriceValue);
});

// Keep all your existing navigation and bubble effect code exactly the same
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll("nav ul li a");
    
    navLinks.forEach(link => {
        link.addEventListener("mouseenter", function () {
            createBubblesAround(this);
        });
    
        link.addEventListener("mouseleave", function () {
            removeBubbles();
        });
    });
    
    function createBubblesAround(element) {
        removeBubbles(); 
    
        const bubbleContainer = document.createElement("div");
        bubbleContainer.classList.add("bubble-container");
        document.body.appendChild(bubbleContainer); 
    
        const rect = element.getBoundingClientRect(); 
    
        for (let i = 0; i < 15; i++) { 
            let bubble = document.createElement("div");
            bubble.classList.add("bubble");
    
            let size = Math.random() * 12 + 8; 
            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
    
            let x = rect.left + Math.random() * rect.width;
            let y = rect.top + Math.random() * rect.height;
    
            bubble.style.left = `${x}px`;
            bubble.style.top = `${y}px`;
            bubbleContainer.appendChild(bubble);
        }
    }
    
    function removeBubbles() {
        let existingBubbles = document.querySelector(".bubble-container");
        if (existingBubbles) {
            existingBubbles.remove();
        }
    }
});