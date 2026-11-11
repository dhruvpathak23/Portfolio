document.addEventListener('DOMContentLoaded', () => {

    // 1. Batcomputer Typewriter Effect
    const words = [
        "INTELLIGENT AI SYSTEMS.",
        "SCALABLE CLOUD INFRASTRUCTURE.",
        "HIGH-RESILIENCE APIS.",
        "MACHINE LEARNING PIPELINES."
    ];
    const typeTarget = document.getElementById("typewriter");
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentWord = words[wordIndex];
        if (isDeleting) {
            typeTarget.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typeTarget.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 35 : 75;

        if (!isDeleting && charIndex === currentWord.length) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            speed = 400;
        }
        setTimeout(typeEffect, speed);
    }
    setTimeout(typeEffect, 600);

    // 2. Custom Tactical Crosshair Cursor
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');

    if (cursorDot && cursorRing && window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            cursorDot.style.left = `${e.clientX}px`;
            cursorDot.style.top = `${e.clientY}px`;
            cursorRing.animate({
                left: `${e.clientX}px`,
                top: `${e.clientY}px`
            }, { duration: 180, fill: "forwards" });
        });

        document.querySelectorAll('a, button, .tilt-card').forEach(el => {
            el.addEventListener('mouseenter', () => cursorRing.classList.add('active'));
            el.addEventListener('mouseleave', () => cursorRing.classList.remove('active'));
        });
    }

    // 3. 3D Perspective Tilt & Dynamic Spotlight on Cards
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Update CSS variables for the radial crimson spotlight
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            // Calculate subtle 3D tilt angle
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -4; 
            const rotateY = ((x - centerX) / centerX) * 4;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
        });
    });

    // 4. Top Scroll Progress Bar
    const scrollProgress = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const percent = (scrollTop / scrollHeight) * 100;
        if (scrollProgress) scrollProgress.style.width = `${percent}%`;
    });

    // 5. Scroll Reveal Animation
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.hidden').forEach(el => observer.observe(el));

    // 6. Heavy Gotham Rain + Distant Lightning Canvas
    const canvas = document.getElementById('rain-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const drops = [];
        const dropCount = 130;

        for (let i = 0; i < dropCount; i++) {
            drops.push({
                x: Math.random() * width,
                y: Math.random() * height,
                len: Math.random() * 25 + 12,
                speed: Math.random() * 10 + 8,
                opacity: Math.random() * 0.35 + 0.08,
                isCrimson: Math.random() > 0.35
            });
        }

        let flashOpacity = 0;

        function animateRain() {
            ctx.clearRect(0, 0, width, height);

            // Occasional subtle Gotham thunder flash
            if (Math.random() > 0.996) {
                flashOpacity = 0.12;
            }
            if (flashOpacity > 0) {
                ctx.fillStyle = `rgba(255, 20, 30, ${flashOpacity})`;
                ctx.fillRect(0, 0, width, height);
                flashOpacity -= 0.008;
            }

            ctx.lineWidth = 1.2;
            for (let i = 0; i < drops.length; i++) {
                const d = drops[i];
                ctx.strokeStyle = d.isCrimson 
                    ? `rgba(255, 10, 22, ${d.opacity})` 
                    : `rgba(200, 210, 230, ${d.opacity * 0.6})`;
                
                ctx.beginPath();
                ctx.moveTo(d.x, d.y);
                ctx.lineTo(d.x - 2.5, d.y + d.len);
                ctx.stroke();

                d.y += d.speed;
                d.x -= 1.5;

                if (d.y > height) {
                    d.y = -30;
                    d.x = Math.random() * (width + 100);
                }
            }
            requestAnimationFrame(animateRain);
        }

        animateRain();
    }
});
