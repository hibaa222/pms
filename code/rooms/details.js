document.addEventListener("DOMContentLoaded", function() {
    // Reservation functionality
    const reserveBtn = document.getElementById("reserve-btn");

    if (!reserveBtn) {
        return;
    }

    reserveBtn.addEventListener("click", function() {
        let startDate = document.getElementById("start-date").value;
        let endDate = document.getElementById("end-date").value;
        const urlParams = new URLSearchParams(window.location.search);
        const roomType = urlParams.get("type");

        if (!startDate || !endDate) {
            alert("Please select start and end dates.");
            return;
        }

        fetch('../../api/check_session.php')
        .then(response => response.json())
        .then(data => {
            if (data.logged_in) {
                return fetch('http://localhost/hilysa/api/reserve.php', {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: `check_in=${encodeURIComponent(startDate)}&check_out=${encodeURIComponent(endDate)}&roomType=${encodeURIComponent(roomType)}`
                });
            } else {
                alert("You must be logged in to reserve a room.");
                window.location.href = `../login/login.html?redirect=${encodeURIComponent(window.location.href)}`;
            }
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert("Reservation successful!");
                window.location.href = "confirmation.html"; 
            } else {
                alert("Reservation failed: " + result.message);
            }
        })
        .catch(error => console.error("Error:", error));
    });

    // Room details and reviews functionality
    const urlParams = new URLSearchParams(window.location.search);
    const roomType = urlParams.get("type"); 
    
    fetch(`../../api/getRoomDetails.php?type=${encodeURIComponent(roomType)}`)
        .then(response => {
            if (!response.ok) throw new Error("Network response was not ok");
            return response.json();
        })
        .then(data => {
            if (data.success) {
                const room = data.room;
                const typeId = room.type_id;
                
                // Update room details in the UI
                document.getElementById("room-type").textContent = room.name;
                document.getElementById("room-price").textContent = parseFloat(room.price).toLocaleString();
                document.getElementById("room-description").textContent = room.description;
                document.getElementById("room-amenities").innerHTML = room.amenities.split(',').map(a => `<span>${a.trim()}</span>`).join(". ");
                
                // Create and handle the review form
                const feedbackSection = document.querySelector('.feedback');
                
                const ratingForm = document.createElement('div');
                ratingForm.className = 'rating-form';
                ratingForm.innerHTML = `
                    <h3>Share Your Experience</h3>
                    <div class="star-rating">
                        ${Array(5).fill('<span class="star">☆</span>').join('')}
                    </div>
                    <textarea class="review-comment" placeholder="Share your thoughts..."></textarea>
                    <button class="submit-review" disabled>Post Review</button>
                `;
                feedbackSection.prepend(ratingForm);

                // Star rating functionality
                const stars = document.querySelectorAll('.star');
                let selectedRating = 0;

                stars.forEach((star, index) => {
                    star.addEventListener('click', () => {
                        selectedRating = index + 1;
                        stars.forEach((s, i) => {
                            s.textContent = i <= index ? '★' : '☆';
                        });
                        document.querySelector('.submit-review').disabled = false;
                    });
                });

                // Submit review functionality
                // Submit review functionality
document.querySelector('.submit-review').addEventListener('click', function() {
    const comment = document.querySelector('.review-comment').value.trim();
    
    if (!selectedRating) {
        alert('Please select a rating');
        return;
    }

    // Make sure typeId is defined (should come from your room details fetch)
    if (!typeId) {
        alert('Error: Room information not loaded');
        return;
    }

    fetch('../../api/check_session.php')
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(data => {
        if (!data.logged_in) {
            alert("You must be logged in to submit a review");
            window.location.href = `../login/login.html?redirect=${encodeURIComponent(window.location.href)}`;
            return Promise.reject('Not logged in');
        }
        
        const formData = new URLSearchParams();
        formData.append('type_id', typeId);
        formData.append('rating', selectedRating);
        formData.append('comment', comment);
        
        return fetch('http://localhost/hilysa/api/submitReview.php', {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData
        });
    })
    .then(response => {
        if (!response.ok) throw new Error('Server error');
        return response.json();
    })
    .then(result => {
        if (result.success) {
            alert(result.message || "Review submitted successfully!");
            location.reload();
        } else {
            throw new Error(result.message || "Review submission failed");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert(error.message || "An error occurred while submitting the review");
    });
});
                
                // Now fetch reviews using the type_id
                return fetch(`../../api/getRoomReviews.php?type_id=${typeId}`);
            } else {
                document.querySelector(".container").innerHTML = "<p>Room not found.</p>";
                throw new Error("Room not found");
            }
        })
        .then(response => {
            if (!response.ok) throw new Error("Failed to fetch reviews");
            return response.json();
        })
        .then(data => {
            const feedbackSection = document.querySelector('.feedback');
            
            if (data.success && data.reviews && data.reviews.length > 0) {
                const reviewsContainer = document.createElement('div');
                reviewsContainer.className = 'reviews-container';
                
                // Sort by newest first
                data.reviews.sort((a, b) => new Date(b.date) - new Date(a.date))
                    .forEach(review => {
                        const reviewElement = document.createElement('div');
                        reviewElement.className = 'review';
                        const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
                        const reviewDate = new Date(review.date);
                        
                        reviewElement.innerHTML = `
                            <div class="review-header">
                                <span class="review-user">${review.username}</span>
                                <span class="review-date">
                                    ${reviewDate.toLocaleDateString()} 
                                    at ${reviewDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                            </div>
                            <div class="review-stars">${stars}</div>
                            <div class="review-comment">${review.comment}</div>
                        `;
                        reviewsContainer.appendChild(reviewElement);
                    });
                
                feedbackSection.appendChild(reviewsContainer);
            } else if (data.success) {
                // Keep the "no reviews" message if there are no reviews
                const noReviewsMsg = document.createElement('p');
                noReviewsMsg.textContent = 'No reviews yet. Be the first to share your experience!';
                feedbackSection.appendChild(noReviewsMsg);
            }
        })
        .catch(error => {
            console.error("Error:", error);
            const feedbackSection = document.querySelector('.feedback');
            feedbackSection.innerHTML += '<p>Error loading reviews. Please try again later.</p>';
        });
});

// Rest of your existing functions remain unchanged...
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

function plusSlides(n) {
    showSlides(slideIndex += n);
}

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