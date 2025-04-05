

document.addEventListener("DOMContentLoaded", function () {
    console.log("JS loaded!"); 
    
    const modal = document.getElementById("reservation-modal");
    const btn = document.getElementById("Mbutton");
    const closeBtn = document.querySelector(".close");
    
    if (!modal || !btn || !closeBtn) {
        console.error("Modal, button, or close button not found!");
        return;
    }
    
    btn.addEventListener("click", function () {
        console.log("Button clicked!");
        modal.style.display = "flex";
    });
    
    closeBtn.addEventListener("click", function () {
        console.log("Close clicked!");
        modal.style.display = "none";
    });
    
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            console.log("Clicked outside modal!");
            modal.style.display = "none";
        }
    });
});


