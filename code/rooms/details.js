document.addEventListener("DOMContentLoaded", function() {
    const reserveBtn = document.getElementById("reserve-btn");

    if (!reserveBtn) {
        console.error("❌ ERROR: Reserve button (#reserve-btn) not found!");
        return;
    }

    console.log("✅ Reserve button found.");

    reserveBtn.addEventListener("click", function() {
        console.log("✅ Reserve button clicked!");
        
        let startDate = document.getElementById("start-date").value;
        let endDate = document.getElementById("end-date").value;
        const urlParams = new URLSearchParams(window.location.search);
        const roomType = urlParams.get("type");


        if (!startDate || !endDate) {
            alert("⚠️ Please select start and end dates.");
            return;
        }

        fetch('../../api/check_session.php')
        .then(response => response.json())
        .then(data => {
            console.log("Session Response:", data);

            if (data.logged_in) {
                return fetch('http://localhost/hilysa/api/reserve.php', {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: `check_in=${encodeURIComponent(startDate)}&check_out=${encodeURIComponent(endDate)}&roomType=${encodeURIComponent(roomType)}`

                });
            } else {
                alert("⚠️ You must be logged in to reserve a room.");
                window.location.href = "../login/login.html";
            }
        })
        .then(response => response.json())
        .then(result => {
            console.log("Reservation Response:", result);

            if (result.success) {
                alert("🎉 Reservation successful!");
                window.location.href = "confirmation.html"; 
            } else {
                alert("❌ Reservation failed: " + result.message);
            }
        })
        .catch(error => console.error("Error:", error));
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const roomType = urlParams.get("type"); 

    const rooms = {
        "Single Room": { 
            price: 10000, 
            description: "A cozy, budget-friendly room for solo travelers.",
            image: "../../imgs/rooms/single.jpg",
            amenities: ["WiFi"]
        },
        "Double Room": { 
            price: 15000, 
            description: "A comfortable space for two guests, perfect for couples or friends.",
            image: "../../imgs/rooms/double.jpg",
            amenities: ["WiFi", "Breakfast"]
        },
        "Twin Room": { 
            price: 25000, 
            description: "A spacious twin room with separate beds and stunning views.",
            image: "../../imgs/rooms/twin.jpg",
            amenities: ["WiFi", "Breakfast", "Sea View"]
        },
        "Suite": { 
            price: 40000, 
            description: "A luxury suite offering premium comfort and services.",
            image: "../../imgs/rooms/suite.jpg",
            amenities: ["WiFi", "Breakfast", "Sea View"]
        },
        "Family Room": { 
            price: 25000, 
            description: "A spacious and cozy room ideal for families.",
            image: "../../imgs/rooms/family.jpg",
            amenities: ["WiFi", "Breakfast", "Pet Friendly"]
        },
        "Presidential Suite": { 
            price: 50000, 
            description: "The ultimate luxury experience with exclusive services.",
            image: "../../imgs/rooms/psuite.jpg",
            amenities: ["WiFi", "Breakfast", "Sea View", "Pet Friendly"]
        },
        "Apartment Room": { 
            price: 20000, 
            description: "A stylish apartment-like room with home-like comfort.",
            image: "../../imgs/rooms/apartement.jpg",
            amenities: ["WiFi", "Breakfast", "Pet Friendly"]
        }
    };
    

    if (rooms[roomType]) {
        document.getElementById("room-type").textContent = roomType;
        document.getElementById("room-price").textContent = rooms[roomType].price.toLocaleString();
        document.getElementById("room-description").textContent = rooms[roomType].description;
        document.getElementById("room-image").src = rooms[roomType].image;
        document.getElementById("room-amenities").innerHTML = rooms[roomType].amenities.map(a => `<span>${a}</span>`).join(". ");
    } else {
        document.querySelector(".container").innerHTML = "<p>Room not found.</p>";
    }
});

function toggleMenu() {
    document.getElementById("mobileNav").classList.toggle("open");
}
document.addEventListener("click", function (event) {
    const mobileNav = document.querySelector(".mobile-nav");
    const hamburger = document.querySelector(".hamburger");

    if (!mobileNav.contains(event.target) && !hamburger.contains(event.target)) {
        mobileNav.classList.remove("open");
        hamburger.classList.remove("active"); 
    }
});
document.querySelectorAll(".mobile-nav a").forEach(link => {
    link.addEventListener("click", function () {
        document.querySelector(".mobile-nav").classList.remove("open");
        document.querySelector(".hamburger").classList.remove("active"); 
    });
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

document.addEventListener("DOMContentLoaded", () => {
    const navbarContainer = document.querySelector("#navbarContainer");
    let lastScrollY = window.scrollY;

    window.addEventListener("scroll", () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY) {
            navbarContainer.classList.add("hidden");
        } else {
            navbarContainer.classList.remove("hidden");
        }

        lastScrollY = currentScrollY;
    });
});


let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("demo");
  let captionText = document.getElementById("caption");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
  captionText.innerHTML = dots[slideIndex-1].alt;
}

