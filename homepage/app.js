document.addEventListener("DOMContentLoaded", function () {
    const searchIcon = document.querySelector(".search-icon");
    const searchInput = document.getElementById("search");

    searchIcon.addEventListener("click", function () {
        searchInput.classList.toggle("active");

        if (searchInput.classList.contains("active")) {
            searchInput.focus();
        }
    });
});


document.addEventListener("click", function(event) {
    const searchInput = document.getElementById("search");
    const searchIcon = document.querySelector(".search-icon");
    
    
    if (!searchIcon.contains(event.target) && !searchInput.contains(event.target)) {
        searchInput.classList.remove("active");
    }
});