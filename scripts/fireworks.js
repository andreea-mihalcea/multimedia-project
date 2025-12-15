window.onload = function () {
    const canvas = document.getElementById('sky');
    const ctx = canvas.getContext('2d');

    const AUDIO_FILE_PATH = 'fireworks-07-419025.mp3'

    let audioCtx = null;
    let audioBuffer = null;
    let isAudioInitialized = false;

    async function loadAudio(url) {
        console.log('Attempting to load audio from: ', url);
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('HTTP error! Status: ${response.status}');
            }

            const arrayBuffer = await response.arrayBuffer();
            audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
            console.log('Audio file successfully loaded and decoded.');
        } catch (error) {
            console.error('Error loading or decoding audio file. Please check the path and format.', error);
        }
    }

    function initAudioContext() {
        if (!isAudioInitialized) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            isAudioInitialized = true;
            loadAudio(AUDIO_FILE_PATH);
        }
    }

    function playFireworkSound() {
        if (!audioCtx || !audioBuffer) {
            return;
        }

        const source = audioCtx.createBufferSource();
        source.buffer = audioBuffer;

        source.playbackRate.value = 0.95 + Math.random() * 0.1;

        source.connect(audioCtx.destination);

        source.start(0);
    }

    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor(x, y, color, angle, distance) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.radius = 2 + Math.random() * 2;
            this.alpha = 1;

            const duration = 1.0 + Math.random() * 0.4;

            const targetX = Math.cos(angle) * distance;
            const targetY = Math.sin(angle) * distance;

            const totalFrames = duration * 60;
            this.vx = targetX / totalFrames;
            this.vy = targetY / totalFrames;

            this.timeRemaining = totalFrames;
        }

        update() {
            if (this.timeRemaining > 0) {
                this.x += this.vx;
                this.y += this.vy;

                this.alpha -= 1 / (this.timeRemaining * 1.5);
                this.timeRemaining--;
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = Math.max(0, this.alpha);
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();

            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;

            ctx.restore();
        }
    }

    function createFirework(x, y) {
        playFireworkSound();
        let numParticles = 50;
        let hue = Math.random() * 360;
        let color = 'hsl(' + hue + ', 100%, 60%)';

        for (let i = 0; i < numParticles; i++) {
            let angle = Math.random() * 2 * Math.PI;
            let distance = 120 + Math.random() * 50;

            particles.push(new Particle(x, y, color, angle, distance));
        }
    }

    canvas.addEventListener('click', function (event) {
        initAudioContext();
        createFirework(event.clientX, event.clientY);
    });

    function animate() {
        requestAnimationFrame(animate);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];

            p.update();
            p.draw();

            if (p.alpha <= 0) {
                particles.splice(i, 1);
            }
        }
    }

    animate();
};