//scrolling effect
document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.querySelector("nav");
    const hotelName = document.querySelector(".hotelName");
    const sections = document.querySelectorAll("section");

    let lastScrollY = window.scrollY;
    let hotelNameY = 0;
    let sectionsY = 0;

    hotelName.style.transition = "transform 0.2s ease-out";
    sections.forEach(section => {
        section.style.transition = "transform 0.2s ease-out";
    });

    window.addEventListener("scroll", () => {
        const currentScrollY = window.scrollY;
        let scrollDifference = currentScrollY - lastScrollY;

        if (currentScrollY > 100) { 
            navbar.classList.add("hidden");
        } else {
            navbar.classList.remove("hidden");
        }

        if (currentScrollY < 10) {
            hotelNameY = 0;
            sectionsY = 0;
        } else {
            hotelNameY = Math.max(hotelNameY - scrollDifference * 0.1, -50); 
            sectionsY = Math.max(sectionsY - scrollDifference * 0.1, -50); 
        }

        hotelName.style.transform = `translateY(${hotelNameY}px)`;
        sections.forEach(section => {
            section.style.transform = `translateY(${sectionsY}px)`;
        });

        lastScrollY = currentScrollY;
    });
}); 

//mobile
    function toggleMenu() {
        document.getElementById("mobileNav").classList.toggle("open");
    }
    document.addEventListener("click", function (event) {
        const mobileNav = document.querySelector(".mobile-nav");
        const hamburger = document.querySelector(".hamburger");
    
        // Check if the clicked element is NOT inside the navbar or the hamburger
        if (!mobileNav.contains(event.target) && !hamburger.contains(event.target)) {
            mobileNav.classList.remove("open");
            hamburger.classList.remove("active"); // If you have an active class
        }
    });
    document.querySelectorAll(".mobile-nav a").forEach(link => {
        link.addEventListener("click", function () {
            document.querySelector(".mobile-nav").classList.remove("open");
            document.querySelector(".hamburger").classList.remove("active"); // If you have an active class
        });
    });
    
    

//smooth scrolling
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});


//bubbles effect
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
        removeBubbles(); // Clean up old bubbles before adding new ones

        const bubbleContainer = document.createElement("div");
        bubbleContainer.classList.add("bubble-container");
        document.body.appendChild(bubbleContainer); // Attach to body, NOT inside the element

        const rect = element.getBoundingClientRect(); // Get element position

        for (let i = 0; i < 15; i++) { // More bubbles for a richer effect
            let bubble = document.createElement("div");
            bubble.classList.add("bubble");

            let size = Math.random() * 12 + 8; // Random size between 8px and 20px
            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;

            // Position bubbles randomly around the element
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

//slides
const swiper = new Swiper('.swiper', {
    loop: true,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});

