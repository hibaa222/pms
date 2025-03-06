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

        // Reset the transform when close to the top
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





document.addEventListener("DOMContentLoaded", function () {
    let words = document.querySelectorAll("#animatedText span");
    let delay = 350; // Milliseconds between each word appearing
    let bookNowSection = document.getElementById("bookNow");

    let observer = new IntersectionObserver(
        (entries) => {
            if (entries[0].isIntersecting) {
                words.forEach((word, index) => {
                    setTimeout(() => {
                        word.style.opacity = 1;
                    }, index * delay);
                });
                observer.disconnect(); // Ensures animation happens only once
            }
        },
        { threshold: 0.5 } // Triggers when 50% of bookNow is visible
    );

    observer.observe(bookNowSection);
});
document.addEventListener("DOMContentLoaded", () => {
    const questions = document.querySelectorAll(".faq-question");

    questions.forEach((question) => {
        question.addEventListener("click", () => {
            const answer = question.nextElementSibling;
            answer.style.display = answer.style.display === "block" ? "none" : "block";
        });
    });
});

