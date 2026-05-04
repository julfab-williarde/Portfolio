document.addEventListener('DOMContentLoaded', () => {
    // --- Gestion du Thème (Sombre/Clair) ---
    const body = document.body;
    let isDarkMode = !body.classList.contains('light-mode');

    // Création dynamique du bouton de bascule
    const themeToggle = document.createElement('button');
    themeToggle.id = 'theme-toggle';
    themeToggle.className = 'bg-slate-800/50 hover:bg-sky-500/20 backdrop-blur-sm border border-slate-700 text-xl';
    themeToggle.setAttribute('aria-label', 'Changer le thème');
    themeToggle.innerHTML = isDarkMode ? '☀️' : '🌙';
    document.body.appendChild(themeToggle);

    // --- Animation Canvas (Étoiles vs Nuages) ---
    const starsContainer = document.getElementById('stars-container');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    starsContainer.appendChild(canvas);

    let elements = [];
    const starColors = ['#ffffff', '#e0f7ff', '#fff4e0'];

    function initAnimation() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        elements = [];
        
        if (isDarkMode) {
            // Initialisation des étoiles
            const starCount = window.innerWidth < 768 ? 80 : 200;
            for (let i = 0; i < starCount; i++) {
                elements.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 2 + 1,
                    color: starColors[Math.floor(Math.random() * starColors.length)],
                    opacity: Math.random(),
                    blinkSpeed: 0.005 + Math.random() * 0.015
                });
            }
        } else {
            // Initialisation des nuages
            const cloudCount = 8;
            for (let i = 0; i < cloudCount; i++) {
                elements.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * (canvas.height * 0.7),
                    size: 60 + Math.random() * 100,
                    speed: 0.1 + Math.random() * 0.3,
                    opacity: 0.2 + Math.random() * 0.5
                });
            }
        }
    }

    const drawCloud = (ctx, x, y, size) => {
        ctx.beginPath();
        ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
        ctx.arc(x + size * 0.4, y - size * 0.2, size * 0.4, 0, Math.PI * 2);
        ctx.arc(x + size * 0.8, y, size * 0.5, 0, Math.PI * 2);
        ctx.arc(x + size * 0.4, y + size * 0.2, size * 0.3, 0, Math.PI * 2);
        ctx.fill();
    };

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (isDarkMode) {
            elements.forEach(star => {
                star.opacity += star.blinkSpeed;
                if (star.opacity > 1 || star.opacity < 0) star.blinkSpeed = -star.blinkSpeed;
                ctx.globalAlpha = Math.max(0, star.opacity);
                ctx.fillStyle = star.color;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size / 2, 0, Math.PI * 2);
                ctx.fill();
            });
        } else {
            ctx.fillStyle = "rgba(255, 255, 255, 1)";
            elements.forEach(cloud => {
                cloud.x += cloud.speed;
                if (cloud.x > canvas.width + 100) cloud.x = -200;
                ctx.globalAlpha = cloud.opacity;
                drawCloud(ctx, cloud.x, cloud.y, cloud.size);
            });
        }
        
        ctx.globalAlpha = 1;
        requestAnimationFrame(animate);
    }

    // Basculer le thème
    themeToggle.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        body.classList.toggle('light-mode');
        themeToggle.innerHTML = isDarkMode ? '☀️' : '🌙';
        themeToggle.style.transform = 'scale(1.2)';
        setTimeout(() => themeToggle.style.transform = 'scale(1)', 200);
        initAnimation();
    });

    window.addEventListener('resize', initAnimation);
    initAnimation();
    animate();

    // --- Indicateur de défilement (Scroll) ---
    const scrollIndicator = document.getElementById('scroll-indicator');

    function updateScrollIndicator() {
        if (!scrollIndicator) return; // Sécurité : évite un crash si l'élément est absent
        const scrollBottom = window.scrollY + window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        const nearBottom = Math.abs(docHeight - scrollBottom) <= 20 || scrollBottom >= docHeight;
        
        if (nearBottom) {
            scrollIndicator.classList.add('opacity-0', 'pointer-events-none', 'hidden');
        } else {
            scrollIndicator.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
        }
    }

    // Optimisation : Utilisation d'un throttle léger pour le scroll
    let isScrolling = false;
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                updateScrollIndicator();
                isScrolling = false;
            });
            isScrolling = true;
        }
    });
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