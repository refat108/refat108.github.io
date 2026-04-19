// This ensures Scrollspy refreshes correctly
document.addEventListener("DOMContentLoaded", function () {
    var scrollSpy = new bootstrap.ScrollSpy(document.body, {
        target: "#navbar",
        offset: 70
    });
});

// Optional: console message (just to show JS is working)
console.log("Custom JS loaded successfully");