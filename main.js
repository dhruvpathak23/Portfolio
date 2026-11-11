document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Batcomputer Typewriter Effect for the Hero Section
    const words = [
        "INTELLIGENT SYSTEMS.",
        "MACHINE LEARNING MODELS.",
        "HIGH-RESILIENCE APIs.",
        "SCALABLE WEB ARCHITECTURES."
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
        
        let typeSpeed = isDeleting ? 40 : 85;
        
        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000; // Pause at the end of the word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length; 
            typeSpeed = 400; // Pause before typing next word
        }
        
        setTimeout(typeEffect, typeSpeed);
    }
    
    setTimeout(typeEffect, 800); 

    // 2. Scroll Reveal Animation using Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));

    // 3. Gotham Noir Rain Canvas Background
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
        const maxDrops = 95;

        for (let i = 0; i < maxDrops; i++) {
            drops.push({
                x: Math.random() * width,
                y: Math.random() * height,
                length: Math.random() * 18 + 10,
                speed: Math.random() * 8 + 6,
                opacity: Math.random() * 0.25 + 0.05
            });
        }

        function drawRain() {
            ctx.clearRect(0, 0, width, height);
            ctx.lineWidth = 1;

            for (let i = 0; i < drops.length; i++) {
                const d = drops[i];
                ctx.strokeStyle = `rgba(229, 9, 20, ${d.opacity})`;
                ctx.beginPath();
                ctx.moveTo(d.x, d.y);
                ctx.lineTo(d.x - 1, d.y + d.length);
                ctx.stroke();

                d.y += d.speed;
                if (d.y > height) {
                    d.y = -20;
                    d.x = Math.random() * width;
                }
            }
            requestAnimationFrame(drawRain);
        }

        drawRain();
    }
});
