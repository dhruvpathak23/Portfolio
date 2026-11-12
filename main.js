document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. BATCOMPUTER WEB AUDIO SYNTHESIZER & SFX TOGGLE
    // ==========================================================================
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;
    let sfxMuted = false;

    const initAudio = () => {
        if (!audioCtx && AudioContextClass) audioCtx = new AudioContextClass();
        if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    };

    const playTone = (freqStart, freqEnd, duration, type = 'sine', volume = 0.08) => {
        if (sfxMuted) return;
        initAudio();
        if (!audioCtx) return;

        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freqStart, now);
        if (freqEnd !== freqStart) {
            osc.frequency.exponentialRampToValueAtTime(Math.max(freqEnd, 20), now + duration);
        }
        gain.gain.setValueAtTime(volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + duration);
    };

    const sfx = {
        click: () => playTone(800, 420, 0.045, 'triangle', 0.09),
        open: () => playTone(320, 680, 0.09, 'sine', 0.1),
        success: () => {
            playTone(520, 520, 0.08, 'triangle', 0.1);
            setTimeout(() => playTone(780, 780, 0.12, 'triangle', 0.1), 80);
        }
    };

    const sfxToggleBtn = document.getElementById('sfx-toggle');
    const sfxIcon = document.getElementById('sfx-icon');
    const sfxLabel = document.getElementById('sfx-label');

    if (sfxToggleBtn) {
        sfxToggleBtn.addEventListener('click', () => {
            sfxMuted = !sfxMuted;
            sfxIcon.className = sfxMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
            sfxLabel.textContent = sfxMuted ? 'SFX: MUTED' : 'SFX: ON';
            if (!sfxMuted) sfx.success();
        });
    }

    // ==========================================================================
    // 2. 3-MODE TACTICAL HUD THEME SWITCHER (Crimson / Amber / Emerald)
    // ==========================================================================
    const themes = ['crimson', 'amber', 'emerald'];
    let currentThemeIdx = 0;
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeLabel = document.getElementById('theme-label');

    const setTheme = (themeName) => {
        document.documentElement.setAttribute('data-theme', themeName);
        if (themeLabel) themeLabel.textContent = themeName.toUpperCase();
        sfx.click();
    };

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            currentThemeIdx = (currentThemeIdx + 1) % themes.length;
            setTheme(themes[currentThemeIdx]);
        });
    }

    // ==========================================================================
    // 3. HERO TYPEWRITER EFFECT
    // ==========================================================================
    const words = [
        "INTELLIGENT AI SYSTEMS.",
        "SCALABLE CLOUD INFRASTRUCTURE.",
        "NLP & SPEECH PIPELINES.",
        "FULL-STACK WEB ARCHITECTURES."
    ];
    const typeTarget = document.getElementById("typewriter");
    let wordIndex = 0, charIndex = 0, isDeleting = false;

    function typeEffect() {
        if (!typeTarget) return;
        const currentWord = words[wordIndex];
        typeTarget.textContent = isDeleting
            ? currentWord.substring(0, charIndex - 1)
            : currentWord.substring(0, charIndex + 1);
        charIndex += isDeleting ? -1 : 1;

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
    setTimeout(typeEffect, 1000);

    // ==========================================================================
    // 4. LIVE GITHUB TELEMETRY FETCH
    // ==========================================================================
    const repoCountEl = document.getElementById('github-repo-count');
    fetch('https://api.github.com/users/dhruvpathak23')
        .then(res => res.json())
        .then(data => {
            if (data && typeof data.public_repos === 'number' && repoCountEl) {
                repoCountEl.textContent = `${data.public_repos}+`;
            }
        })
        .catch(() => {});

    // ==========================================================================
    // 5. PROJECT CATEGORY FILTER TABS
    // ==========================================================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('#project-grid .project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sfx.click();
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterVal = btn.getAttribute('data-filter');
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterVal === 'all' || category === filterVal) {
                    card.classList.remove('hide-card');
                } else {
                    card.classList.add('hide-card');
                }
            });
        });
    });

    // ==========================================================================
    // 6. SYSTEM ARCHITECTURE MODALS & IN-PAGE GAME SIMULATOR LAUNCHER
    // ==========================================================================
    const batModal = document.getElementById('bat-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalClose = document.getElementById('modal-close');

    const archBlueprints = {
        fakenews: {
            title: "CASE #001 // FAKE NEWS DETECTION ARCHITECTURE",
            nodes: ["User News Input", "Text Preprocessing & Tokenization", "TF-IDF Vectorizer", "Logistic Regression Classifier", "Streamlit / REST UI + MySQL Log"],
            details: "Engineered to combat misinformation in real time. Raw article text is stripped of stopwords, vectorized via TF-IDF n-grams, and evaluated against a trained classification pipeline with instant confidence scoring."
        },
        cryptobot: {
            title: "CASE #002 // BINANCE FUTURES TRADING BOT ARCHITECTURE",
            nodes: ["Financial News Feed", "FinBERT Sentiment Analysis", "Strategy Decision Engine", "HMAC SHA256 Auth", "Binance Testnet Execution + Streamlit Deck"],
            details: "Combines quantitative execution with NLP sentiment triggers. Uses FinBERT to score market sentiment and signs orders cryptographically via HMAC SHA256 against the Binance Futures Testnet API."
        },
        callsentiment: {
            title: "CASE #003 // AI CALL SENTIMENT ANALYZER ARCHITECTURE",
            nodes: ["Customer Audio (.wav/.mp3)", "Whisper Speech-to-Text", "Transcript Cleaning", "NLP Emotion & Polarity Engine", "Interactive Analytics Dashboard"],
            details: "Automates call-center quality assurance. Converts raw customer audio into accurate text transcripts and flags negative sentiment spikes and emotional triggers."
        },
        tourbaba: {
            title: "CASE #004 // TOURBABA TRAVEL ASSISTANT ARCHITECTURE",
            nodes: ["Location Query", "Weather & AQI REST APIs", "React Custom Hooks State", "Smart Packing & Travel Engine", "Responsive Tailwind UI"],
            details: "Co-developed modular React + TypeScript application that aggregates real-time meteorological and air quality data to recommend optimal travel windows."
        },
        djangoblog: {
            title: "CASE #005 // DJANGO FULL-STACK BLOG ARCHITECTURE",
            nodes: ["Client Browser", "Django URL Dispatcher", "MTV Views & Auth Middleware", "ORM Relational Models (MySQL/SQLite)", "Bootstrap Responsive Templates"],
            details: "Full CRUD publishing system featuring secure user authentication, dynamic post creation/editing, and relational database persistence."
        }
    };

    document.querySelectorAll('.arch-trigger').forEach(btn => {
        btn.addEventListener('click', () => {
            sfx.open();
            const key = btn.getAttribute('data-project');
            const data = archBlueprints[key];
            if (!data) return;

            modalTitle.textContent = data.title;
            const pipelineHTML = data.nodes
                .map(n => `<div class="arch-node">${n}</div>`)
                .join(`<span class="arch-arrow"><i class="fas fa-arrow-right"></i></span>`);

            modalBody.innerHTML = `
                <p style="color: var(--text-secondary); margin-bottom: 16px;">${data.details}</p>
                <h4 style="font-family: var(--font-mono); color: var(--amber); margin-bottom: 10px;">// DATA PIPELINE TOPOLOGY:</h4>
                <div class="arch-pipeline">${pipelineHTML}</div>
            `;
            batModal.classList.remove('hide');
        });
    });

    // In-Page Game Iframe Launcher
    document.querySelectorAll('.game-launch-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            sfx.open();
            const url = btn.getAttribute('data-url');
            const title = btn.getAttribute('data-title');
            modalTitle.textContent = title;
            modalBody.innerHTML = `<iframe src="${url}" class="game-iframe" allow="autoplay"></iframe>`;
            batModal.classList.remove('hide');
        });
    });

    const closeModal = () => {
        if (!batModal) return;
        batModal.classList.add('hide');
        modalBody.innerHTML = ''; // Stops game audio when closed
        sfx.click();
    };
    if (modalClose) modalClose.addEventListener('click', closeModal);
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && batModal && !batModal.classList.contains('hide')) closeModal();
    });

    // ==========================================================================
    // 7. INTERACTIVE BATCOMPUTER CLI TERMINAL (Press `~` or Click Button)
    // ==========================================================================
    const cliDrawer = document.getElementById('cli-drawer');
    const cliInput = document.getElementById('cli-input');
    const cliOutput = document.getElementById('cli-output');
    const cliClose = document.getElementById('cli-close');
    const floatingCliBtn = document.getElementById('floating-cli-btn');
    const navCliBtn = document.getElementById('terminal-nav-btn');
    const heroCliBtn = document.getElementById('open-cli-hero');

    const toggleCLI = () => {
        sfx.open();
        cliDrawer.classList.toggle('hide');
        if (!cliDrawer.classList.contains('hide')) cliInput.focus();
    };

    [floatingCliBtn, navCliBtn, heroCliBtn, cliClose].forEach(el => {
        if (el) el.addEventListener('click', toggleCLI);
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === '`' || e.key === '~') {
            if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
                e.preventDefault();
                toggleCLI();
            }
        }
    });

    const printCLI = (html) => {
        const div = document.createElement('div');
        div.className = 'cli-line';
        div.innerHTML = html;
        cliOutput.appendChild(div);
        cliOutput.scrollTop = cliOutput.scrollHeight;
    };

    if (cliInput) {
        cliInput.addEventListener('keydown', (e) => {
            if (e.key !== 'Enter') return;
            const raw = cliInput.value.trim();
            const cmd = raw.toLowerCase();
            cliInput.value = '';
            if (!cmd) return;

            sfx.click();
            printCLI(`<span class="cli-prompt">dhruv@batcomputer:~$</span> ${raw}`);

            if (cmd === 'help') {
                printCLI(`Available Commands: <span class="cli-cmd">about</span>, <span class="cli-cmd">skills</span>, <span class="cli-cmd">projects</span>, <span class="cli-cmd">clearances</span>, <span class="cli-cmd">leetcode</span>, <span class="cli-cmd">theme crimson|amber|emerald</span>, <span class="cli-cmd">contact</span>, <span class="cli-cmd">clear</span>`);
            } else if (cmd === 'about') {
                printCLI(`Dhruv Pathak // Final-Year B.Tech CSE (AI & ML) @ Galgotias University (CGPA: 7.4). Originally from Patna, Bihar.`);
            } else if (cmd === 'skills') {
                printCLI(`Languages: Python, Java, JS | AI/ML: NLP, TF-IDF, FinBERT, Whisper | Web: React, Django, Flask, FastAPI, Streamlit, MySQL.`);
            } else if (cmd === 'projects') {
                printCLI(`1. Fake News Chatbot | 2. Binance Futures FinBERT Bot | 3. AI Call Sentiment Analyzer | 4. TourBaba React App | 5. Django Blog.`);
            } else if (cmd === 'clearances') {
                printCLI(`- TCS NQT (Ninja) Cleared<br>- Meritshot Campus Placement Selected<br>- LeetCode 50 Days Badge (@dhruvhacks)<br>- Oracle Java Fundamentals Certified`);
            } else if (cmd === 'leetcode') {
                printCLI(`Opening LeetCode profile (@dhruvhacks)...`);
                window.open('https://leetcode.com/u/dhruvhacks/', '_blank');
            } else if (cmd.startsWith('theme ')) {
                const t = cmd.replace('theme ', '').trim();
                if (themes.includes(t)) {
                    setTheme(t);
                    printCLI(`HUD Theme switched to ${t.toUpperCase()}.`);
                } else {
                    printCLI(`Use: theme crimson | theme amber | theme emerald`);
                }
            } else if (cmd === 'contact') {
                printCLI(`Email: dhruvkaushik31@gmail.com | LinkedIn: /in/dhruv-pathak-45b289266`);
            } else if (cmd === 'clear') {
                cliOutput.innerHTML = '';
            } else {
                printCLI(`Command not recognized: '${raw}'. Type <span class="cli-cmd">help</span>.`);
            }
        });
    }

    // ==========================================================================
    // 8. ONE-CLICK COPY EMAIL & ENCRYPTED TRANSMISSION FORM
    // ==========================================================================
    const copyBtn = document.getElementById('copy-email-btn');
    const toast = document.getElementById('toast');

    const showToast = (message) => {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.remove('hide');
        setTimeout(() => toast.classList.add('hide'), 2600);
    };

    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText('dhruvkaushik31@gmail.com');
            sfx.success();
            showToast('EMAIL COPIED: DHRUVKAUSHIK31@GMAIL.COM');
        });
    }

    const contactForm = document.getElementById('transmission-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            sfx.success();
            const name = document.getElementById('sender-name').value;
            const email = document.getElementById('sender-email').value;
            const msg = document.getElementById('sender-msg').value;

            const subject = encodeURIComponent(`Portfolio Transmission from ${name}`);
            const body = encodeURIComponent(`Sender: ${name} (${email})\n\n${msg}`);
            window.location.href = `mailto:dhruvkaushik31@gmail.com?subject=${subject}&body=${body}`;
            showToast('ENCRYPTED TRANSMISSION DISPATCHED');
            contactForm.reset();
        });
    }

    // ==========================================================================
    // 9. 3D TILT CARDS, SCROLL PROGRESS & GOTHAM RAIN CANVAS
    // ==========================================================================
    document.querySelectorAll('.tilt-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -3.5;
            const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 3.5;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
        });
    });

    const scrollProgress = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const percent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        if (scrollProgress) scrollProgress.style.width = `${percent}%`;
    });

    if ('IntersectionObserver' in window) {
        const revealElements = document.querySelectorAll('.reveal');
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.remove('js-hidden');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach((el, index) => {
            if (index > 0) {
                el.classList.add('js-hidden');
                observer.observe(el);
            }
        });
    }

    const canvas = document.getElementById('rain-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const drops = Array.from({ length: 115 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            len: Math.random() * 24 + 12,
            speed: Math.random() * 10 + 8,
            opacity: Math.random() * 0.32 + 0.08,
            isAccent: Math.random() > 0.35
        }));

        function animateRain() {
            ctx.clearRect(0, 0, width, height);
            ctx.lineWidth = 1.15;
            for (const d of drops) {
                ctx.strokeStyle = d.isAccent
                    ? `rgba(255, 10, 22, ${d.opacity})`
                    : `rgba(200, 210, 230, ${d.opacity * 0.55})`;
                ctx.beginPath();
                ctx.moveTo(d.x, d.y);
                ctx.lineTo(d.x - 2, d.y + d.len);
                ctx.stroke();

                d.y += d.speed;
                d.x -= 1.2;
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
