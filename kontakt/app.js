document.addEventListener("DOMContentLoaded", function () {
    const searchIcon = document.querySelector(".search-icon");
    const searchInput = document.getElementById("search");

    searchIcon.addEventListener("click", function () {
        searchInput.classList.toggle("active");

        if (searchInput.classList.contains("active")) {
            searchInput.focus();
        }
    });

    const normalize = (value) => {
        if (!value) return "";
        return value
            .toString()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();
    };

    const getNavigableLinks = () => {
        const anchors = Array.from(document.querySelectorAll(".navigacija a"));
        return anchors
            .map((a) => ({
                text: a.textContent ? a.textContent.trim() : "",
                href: a.getAttribute("href") || "",
            }))
            .filter((item) => item.text.length > 0 && item.href.length > 0);
    };

    const findBestMatch = (query, items) => {
        const q = normalize(query);
        if (!q) return null;

        const scored = items
            .map((item) => {
                const t = normalize(item.text);
                let score = -1;
                if (t === q) score = 3;
                else if (t.startsWith(q)) score = 2;
                else if (t.includes(q)) score = 1;
                return { item, score };
            })
            .filter((x) => x.score > 0)
            .sort((a, b) => b.score - a.score);

        return scored.length ? scored[0].item : null;
    };

    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const links = getNavigableLinks();
            const match = findBestMatch(searchInput.value, links);
            if (match) {
                window.location.href = match.href;
            }
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