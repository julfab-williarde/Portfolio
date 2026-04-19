document.addEventListener('DOMContentLoaded', () => {
    // --- Animation des Étoiles (Canvas) ---
    const starsContainer = document.getElementById('stars-container');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    starsContainer.appendChild(canvas);

    let stars = [];
    const colors = ['#ffffff', '#e0f7ff', '#fff4e0'];

    function initStars() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        stars = [];
        const starCount = window.innerWidth < 768 ? 80 : 200;

        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 1,
                color: colors[Math.floor(Math.random() * colors.length)],
                opacity: Math.random(),
                blinkSpeed: 0.005 + Math.random() * 0.015
            });
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach(star => {
            star.opacity += star.blinkSpeed;
            if (star.opacity > 1 || star.opacity < 0) star.blinkSpeed = -star.blinkSpeed;

            ctx.globalAlpha = Math.max(0, star.opacity);
            ctx.fillStyle = star.color;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size / 2, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', initStars);
    initStars();
    animate();

    // --- Indicateur de défilement (Scroll) ---
    const scrollIndicator = document.getElementById('scroll-indicator');

    function updateScrollIndicator() {
        const scrollBottom = window.scrollY + window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        const nearBottom = Math.abs(docHeight - scrollBottom) <= 20 || scrollBottom >= docHeight;
        
        if (nearBottom) {
            scrollIndicator.classList.add('opacity-0', 'pointer-events-none', 'hidden');
        } else {
            scrollIndicator.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
        }
    }

    window.addEventListener('scroll', updateScrollIndicator);
    window.addEventListener('resize', updateScrollIndicator);
    updateScrollIndicator();

    // --- Accordéon Projets avec Accessibilité ---
    const toggleProject = (card) => {
        const desc = card.querySelector(".project-description");
        const isHidden = desc.classList.toggle("hidden");
        card.setAttribute("aria-expanded", !isHidden);
    };

    document.querySelectorAll(".project-card").forEach(card => {
        card.addEventListener("click", () => toggleProject(card));
        card.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleProject(card);
            }
        });
    });

    // --- Menu Mobile ---
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    const hamburgerPath = "M4 6h16M4 12h16m-7 6h7";
    const closePath = "M6 18L18 6M6 6l12 12";

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.toggle('hidden');
            menuIcon.setAttribute('d', isHidden ? hamburgerPath : closePath);
        });
    }

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            menuIcon.setAttribute('d', hamburgerPath);
        });
    });
});