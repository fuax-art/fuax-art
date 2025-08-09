// --- Smooth scrolling for navigation links ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// --- Modal functions ---
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
   document.getElementById(modalId).style.display = 'block';
    if (soundsEnabled) soundEngine.playHydraulicHiss();
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    document.getElementById(modalId).style.display = 'none';
    if (soundsEnabled) soundEngine.playConcreteScrape();
}

window.openPortfolioModal = function() {
    openModal('portfolioModal');
};

// Close modal when clicking outside
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal(this.id);
        }
    });
});

// --- Contact form submission ---
document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your message! I\'ll get back to you soon.');
    this.reset();
});

// --- Newsletter subscription ---
document.getElementById('mailchimp-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for subscribing! You\'ll receive updates about new work and exclusive releases.');
    this.reset();
});

// --- Header background opacity on scroll ---
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    const scrolled = window.pageYOffset;
    const opacity = Math.min(0.95 + (scrolled / 1000) * 0.05, 1);
    header.style.background = `rgba(28, 28, 28, ${opacity})`;
});

// --- Intersection Observer for section animations ---
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};
const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// --- Portfolio slider horizontal scroll with mouse wheel ---
const portfolioSlider = document.querySelector('.portfolio-slider');
if (portfolioSlider) {
    portfolioSlider.addEventListener('wheel', function(e) {
        if (e.deltaY !== 0) {
            e.preventDefault();
            this.scrollLeft += e.deltaY;
        }
    });
}

// --- Parallax effect for hero section ---
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// --- Industrial Sound Engine ---
class IndustrialSoundEngine {
    constructor() {
        this.audioContext = null;
        this.initialized = false;
    }
    async init() {
        if (!this.initialized) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.initialized = true;
            } catch (e) {
                console.log('Web Audio API not supported');
            }
        }
    }
    playMetallicClick(volume = 0.15) {
        if (!this.audioContext) return;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        oscillator.frequency.setValueAtTime(1200, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.05);
        oscillator.type = 'square';
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(300, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime); // Use volume here
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.08);
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.08);
    }
    playHydraulicHiss() {
        if (!this.audioContext) return;
        const bufferSize = this.audioContext.sampleRate * 0.3;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
            b6 = white * 0.115926;
            const envelope = Math.exp(-i / (bufferSize * 0.4));
            data[i] = pink * envelope * 0.1;
        }
        const source = this.audioContext.createBufferSource();
        const filter = this.audioContext.createBiquadFilter();
        const gainNode = this.audioContext.createGain();
        source.buffer = buffer;
        source.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, this.audioContext.currentTime);
        filter.Q.setValueAtTime(2, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        source.start();
    }
    playElectricBuzz() {
        if (!this.audioContext) return;
        const oscillator1 = this.audioContext.createOscillator();
        const oscillator2 = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        oscillator1.connect(filter);
        oscillator2.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        oscillator1.frequency.setValueAtTime(120, this.audioContext.currentTime);
        oscillator2.frequency.setValueAtTime(121, this.audioContext.currentTime);
        oscillator1.type = 'sawtooth';
        oscillator2.type = 'sawtooth';
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2000, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.08, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
        oscillator1.start();
        oscillator2.start();
        oscillator1.stop(this.audioContext.currentTime + 0.15);
        oscillator2.stop(this.audioContext.currentTime + 0.15);
    }
    playSteamRelease() {
        if (!this.audioContext) return;
        const bufferSize = this.audioContext.sampleRate * 0.8;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            const envelope = Math.exp(-i / (bufferSize * 0.2)) * Math.pow(Math.random(), 0.5);
            data[i] = (Math.random() * 2 - 1) * envelope * 0.3;
        }
        const source = this.audioContext.createBufferSource();
        const filter1 = this.audioContext.createBiquadFilter();
        const filter2 = this.audioContext.createBiquadFilter();
        const gainNode = this.audioContext.createGain();
        source.buffer = buffer;
        source.connect(filter1);
        filter1.connect(filter2);
        filter2.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        filter1.type = 'highpass';
        filter1.frequency.setValueAtTime(1000, this.audioContext.currentTime);
        filter2.type = 'lowpass';
        filter2.frequency.setValueAtTime(8000, this.audioContext.currentTime);
        filter2.frequency.exponentialRampToValueAtTime(2000, this.audioContext.currentTime + 0.5);
        gainNode.gain.setValueAtTime(0.25, this.audioContext.currentTime);
        source.start();
    }
    playConcreteScrape() {
        if (!this.audioContext) return;
        const oscillator = this.audioContext.createOscillator();
        const filter = this.audioContext.createBiquadFilter();
        const gainNode = this.audioContext.createGain();
        const lfo = this.audioContext.createOscillator();
        const lfoGain = this.audioContext.createGain();
        lfo.connect(lfoGain);
        lfoGain.connect(oscillator.frequency);
        lfo.frequency.setValueAtTime(8, this.audioContext.currentTime);
        lfoGain.gain.setValueAtTime(50, this.audioContext.currentTime);
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        oscillator.frequency.setValueAtTime(80, this.audioContext.currentTime);
        oscillator.type = 'sawtooth';
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(400, this.audioContext.currentTime);
        filter.Q.setValueAtTime(8, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.12, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);
        lfo.start();
        oscillator.start();
        lfo.stop(this.audioContext.currentTime + 0.4);
        oscillator.stop(this.audioContext.currentTime + 0.4);
    }
    playMachineStartup() {
        if (!this.audioContext) return;
        const oscillator1 = this.audioContext.createOscillator();
        const oscillator2 = this.audioContext.createOscillator();
        const filter = this.audioContext.createBiquadFilter();
        const gainNode = this.audioContext.createGain();
        const delay = this.audioContext.createDelay();
        const delayGain = this.audioContext.createGain();
        oscillator1.connect(filter);
        oscillator2.connect(filter);
        filter.connect(gainNode);
        filter.connect(delay);
        delay.connect(delayGain);
        delayGain.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        oscillator1.frequency.setValueAtTime(40, this.audioContext.currentTime);
        oscillator1.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 1.2);
        oscillator2.frequency.setValueAtTime(41, this.audioContext.currentTime);
        oscillator2.frequency.exponentialRampToValueAtTime(401, this.audioContext.currentTime + 1.2);
        oscillator1.type = 'sawtooth';
        oscillator2.type = 'sawtooth';
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(200, this.audioContext.currentTime);
        filter.frequency.exponentialRampToValueAtTime(2000, this.audioContext.currentTime + 1.2);
        delay.delayTime.setValueAtTime(0.1, this.audioContext.currentTime);
        delayGain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1.4);
        oscillator1.start();
        oscillator2.start();
        oscillator1.stop(this.audioContext.currentTime + 1.4);
        oscillator2.stop(this.audioContext.currentTime + 1.4);
    }
    playTypewriterClick(volume = 0.12) {
        if (!this.audioContext) return;

        // Short noise burst for the "click"
        const bufferSize = this.audioContext.sampleRate * 0.015; // ~15ms
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            // Envelope for a sharp attack and quick decay
            const envelope = Math.exp(-i / (bufferSize * 0.6));
            data[i] = (Math.random() * 2 - 1) * envelope;
        }
        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;

        // Highpass filter to make it "clicky"
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(1200, this.audioContext.currentTime);

        // Gain for volume control
        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);

        source.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        source.start();
    }
}

const soundEngine = new IndustrialSoundEngine();
let soundsEnabled = false;

async function initializeSounds() {
    if (!soundsEnabled) {
        await soundEngine.init();
        soundsEnabled = true;
        console.log('🔊 Industrial sound system activated');
    }
}

// --- Add sound to interactive elements ---
document.querySelectorAll('.cta-button, .app-launch').forEach(button => {
    button.addEventListener('click', async function() {
        await initializeSounds();
        soundEngine.playMetallicClick();
    });
});
document.querySelectorAll('.submit-btn, .newsletter-btn').forEach(button => {
    button.addEventListener('click', async function() {
        await initializeSounds();
        soundEngine.playSteamRelease();
    });
});
document.querySelectorAll('.nav-menu a, .portfolio-item').forEach(element => {
    element.addEventListener('mouseenter', async function() {
        await initializeSounds();
        if (Math.random() < 0.7) {
            soundEngine.playElectricBuzz();
        }
    });
});
document.querySelectorAll('.cta-button, .app-launch').forEach(element => {
    element.addEventListener('mouseenter', async function() {
        await initializeSounds();
        if (Math.random() < 0.7) {
            soundEngine.playMachineStartup();
        }
    });
});

// --- Sound control toggle ---
function createSoundToggle() {
    const toggle = document.createElement('button');
    toggle.innerHTML = '🔊';
    toggle.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--steel-blue);
        color: var(--chrome);
        border: 2px solid var(--rust-red);
        font-size: 1.2rem;
        cursor: pointer;
        z-index: 1000;
        transition: all 0.3s ease;
    `;
    toggle.addEventListener('click', function() {
        soundsEnabled = !soundsEnabled;
        this.innerHTML = soundsEnabled ? '🔊' : '🔇';
        this.style.background = soundsEnabled ? 'var(--steel-blue)' : 'var(--concrete)';
        if (soundsEnabled) {
            initializeSounds().then(() => {
                soundEngine.playMetallicClick();
            });
        }
    });
    document.body.appendChild(toggle);
}
window.addEventListener('load', createSoundToggle);

// --- Keyboard shortcuts ---
document.addEventListener('keydown', function(e) {
    if (e.altKey && e.key === 'p') {
        e.preventDefault();
        document.getElementById('portfolio').scrollIntoView({ behavior: 'smooth' });
    }
    if (e.altKey && e.key === 'b') {
        e.preventDefault();
        document.getElementById('blog').scrollIntoView({ behavior: 'smooth' });
    }
    if (e.altKey && e.key === 'c') {
        e.preventDefault();
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    }
            closeModal(modal.id);
        });
    }
});

// --- Console easter egg ---
console.log(`
╔══════════════════════════════════════╗
║     INDUSTRIAL ARTIST PORTFOLIO      ║
║                                      ║
║  Built with steel and precision      ║
║  Powered by creativity and code      ║
║                                      ║
║  Keyboard shortcuts:                 ║
║  Alt + P = Portfolio                 ║
║  Alt + B = Blog                      ║
║  Alt + C = Contact                   ║
║  Alt + E = Easter Egg                ║
║                                      ║
║  Made with ♥ and industrial coffee   ║
╚══════════════════════════════════════╝
`);

// --- Performance monitoring ---
window.addEventListener('load', function() {
    setTimeout(() => {
        const perfData = performance.timing;
        const loadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Site loaded in ${loadTime}ms - Industrial efficiency achieved.`);
    }, 0);
});

// --- Typewriter effect for hero subtitle with sound ---
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            if (soundsEnabled) soundEngine.playTypewriterClick(0.08);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

function startHeroTypewriter() {
    const subtitle = document.querySelector('.hero-content .subtitle');
    if (subtitle) {
        const originalText = subtitle.textContent;
        typeWriter(subtitle, originalText, 150);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('chaos-overlay');
    const proceedBtn = document.getElementById('chaos-proceed');

    // Only show overlay if not already seen in this session
    if (overlay && proceedBtn) {
        if (sessionStorage.getItem('chaosOverlaySeen')) {
            overlay.style.display = 'none';
            startHeroTypewriter();
        } else {
            proceedBtn.addEventListener('click', async () => {
                overlay.style.display = 'none';
                sessionStorage.setItem('chaosOverlaySeen', 'true');
                await initializeSounds();
                startHeroTypewriter();
            });
        }
    } else {
        // Fallback: if overlay missing, just run typewriter
        startHeroTypewriter();
    }
});

// --- Easter Egg & Video Modal ---
window.addEventListener('DOMContentLoaded', () => {
    const closeVideoModal = document.getElementById('closeVideoModal');

    // Define your 3 locations (left, top) in pixels
    const eggPositions = [
        { left: 30, top: 30 }, // top-left
        { left: window.innerWidth / 2 - 12, top: window.innerHeight / 2 - 12 }, // center
        { left: window.innerWidth - 60, top: window.innerHeight - 60 } // bottom-right
    ];

    let clickCount = 0;
    const maxClicks = eggPositions.length; // 3

    function moveEasterEggToPosition(index) {
        const pos = eggPositions[index];
        easterEgg.style.left = `${pos.left}px`;
        easterEgg.style.top = `${pos.top}px`;
        easterEgg.style.position = 'fixed';
    }

        easterEgg.addEventListener('click', () => {
            clickCount++;
            if (clickCount < maxClicks) {
                moveEasterEggToPosition(clickCount);
            } else {
                easterEgg.style.display = 'none';
                if (soundsEnabled) soundEngine.playMachineStartup();
            }
        });

        closeVideoModal.addEventListener('click', () => {
        });

        // On page load, reset to first position
        moveEasterEggToPosition(0);
        clickCount = 0;
    }
});

// --- About section curtain ---
document.getElementById('about-trigger').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('about-curtain').classList.add('active');
});

document.getElementById('about-close').addEventListener('click', function() {
    document.getElementById('about-curtain').classList.remove('active');
});

// --- Video Chaos Effect ---
document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('chaos-video');
    const playBtn = document.getElementById('chaos-play');
    const proceedBtn = document.getElementById('chaos-proceed');

    playBtn.addEventListener('click', function() {
        video.play();
        playBtn.style.display = 'none';
    });

    video.addEventListener('ended', function() {
        proceedBtn.disabled = false;
    });

    if (video) {
        video.volume = 1.0; // Maximum volume (range: 0.0 to 1.0)
    }
});