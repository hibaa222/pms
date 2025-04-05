

document.addEventListener("DOMContentLoaded", () => {
    new Swiper(".mySwiper", {
        loop: true,
        autoplay: {
            delay: 3000, // Changes slide every 3 seconds
            disableOnInteraction: false,
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
    });

    let lastScrollTop = 0;
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", function () {
    let scrollTop = window.scrollY || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop) {
        navbar.classList.add("hidden");
    } else {
        navbar.classList.remove("hidden");
    }
    lastScrollTop = scrollTop;
});
});
