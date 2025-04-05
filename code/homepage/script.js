//scrolling effect
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        // Check if the href is an internal link (hash link)
        if (href.startsWith("#")) {
            e.preventDefault();  // Prevent default action for internal links
            const targetId = href.substring(1);  // Extract the section ID (without #)
            const targetSection = document.getElementById(targetId);

            // Only apply smooth scroll if the target section exists
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
        // If the href is a full URL or external link, don't prevent default behavior
        // External links like "../profile/profile.html" will navigate as expected
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.querySelector("nav");
    const logo = document.querySelector(".logo"); 
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
            logo.classList.add("hidden"); 
        } else {
            navbar.classList.remove("hidden");
            logo.classList.remove("hidden"); 
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

//slides
const swiper = new Swiper('.swiper', {
    loop: true,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});

