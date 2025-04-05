document.addEventListener("DOMContentLoaded", function () {
    const rooms = [
        { 
            type: "Single Room", 
            price: 10000, 
            description: "A cozy, budget-friendly room designed for solo travelers, featuring all the essentials for a comfortable stay.", 
            image: "../../imgs/rooms/single.jpg",
            amenities: ["wifi"]
        },
        { 
            type: "Double Room", 
            price: 15000, 
            description: "A spacious room perfect for two, offering a relaxing retreat with a comfortable double bed, ideal for couples or friends.", 
            image: "../../imgs/rooms/double.jpg",
            amenities: ["wifi", "breakfast"]
        },
        { 
            type: "Twin Room", 
            price: 25000, 
            description: "A spacious room with two separate beds, offering a peaceful ambiance with stunning views of the city or surroundings.", 
            image: "../../imgs/rooms/twin.jpg",
            amenities: ["wifi", "breakfast", "seaview"]
        },
        { 
            type: "Suite", 
            price: 40000, 
            description: "A luxury suite featuring premium comfort, modern amenities, and top-notch services for those seeking an elevated experience.", 
            image: "../../imgs/rooms/suite.jpg",
            amenities: ["wifi", "breakfast", "seaview"]
        },
        { 
            type: "Family Room", 
            price: 25000, 
            description: "A spacious and cozy room with ample space for families, equipped with modern comforts and pet-friendly amenities.", 
            image: "../../imgs/rooms/family.jpg",
            amenities: ["wifi", "breakfast", "petfriendly"]
        },
        { 
            type: "Presidential Suite", 
            price: 50000, 
            description: "The ultimate luxury experience with a lavish atmosphere, offering exclusive services, stunning views, and premium amenities for discerning guests.", 
            image: "../../imgs/rooms/psuite.jpg",
            amenities: ["wifi", "breakfast", "seaview", "petfriendly"]
        },
        { 
            type: "Apartment Room", 
            price: 20000, 
            description: "A stylish, apartment-like room that offers a homey feel with full amenities, perfect for longer stays or guests seeking independence.", 
            image: "../../imgs/rooms/apartement.jpg",
            amenities: ["wifi", "breakfast", "petfriendly"]
        }
    ];
    

    const roomsContainer = document.getElementById("rooms-container");
    const searchInput = document.getElementById("search-input");
    const filters = document.querySelectorAll(".sidebar input[type='checkbox']");
    const priceRange = document.getElementById("price-range");
    const priceValue = document.getElementById("price-value");
    const applyFiltersBtn = document.querySelector(".apply-filters");

    let filteredRooms = [...rooms];

    function displayRooms(roomList = rooms) {
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
                    <p style="font-weight: bold; color: #BC6794;"> ${room.price.toLocaleString()} DZD/night</p>
                    <p>${room.description}</p>
                    <div class="amenities">
                        ${room.amenities.map(a => `<span class="amenity">${a.charAt(0).toUpperCase() + a.slice(1)}</span>`).join("")}
                    </div>
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

    searchInput.addEventListener("input", searchRooms);
    applyFiltersBtn.addEventListener("click", filterRooms);
    priceRange.addEventListener("input", updatePriceValue);

    displayRooms();
});


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
