window.onload = function () {
    const canvas = document.getElementById('sky');
    const ctx = canvas.getContext('2d');
    const video = document.getElementById('bgVideo');
    const music = document.getElementById('bgMusic');

    let particles = [];
    let textAlpha = 0;
    let audioCtx = null;

    function playInternalPop() {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = 'triangle';
        
        oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor(x, y, hue) {
            this.x = x; this.y = y; this.hue = hue;
            this.alpha = 1;
            this.decay = Math.random() * 0.015 + 0.01;
            const angle = Math.random() * Math.PI * 2;
            const force = Math.random() * 10 + 5;
            this.vx = Math.cos(angle) * force;
            this.vy = Math.sin(angle) * force;
            this.friction = 0.95;
            this.gravity = 0.12;
            this.radius = Math.random() * 3 + 2;
        }

        update() {
            this.vx *= this.friction;
            this.vy *= this.friction;
            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= this.decay;
        }

        draw() {
            if (this.alpha <= 0) return;
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            
            let grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 6);
            grad.addColorStop(0, `hsla(${this.hue}, 100%, 70%, ${this.alpha})`);
            grad.addColorStop(0.4, `hsla(${this.hue}, 100%, 50%, ${this.alpha * 0.8})`);
            grad.addColorStop(1, 'transparent');
            
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    canvas.addEventListener('mousedown', (e) => {
        if (music.paused) {
            music.volume = 0.15;
            music.play();
            video.play();
        }
        
        playInternalPop();
        
        textAlpha = 1.0;
        const hue = Math.random() * 360;
        for (let i = 0; i < 80; i++) particles.push(new Particle(e.clientX, e.clientY, hue));
    });

    function drawText() {
        if (textAlpha <= 0) return;
        ctx.save();
        ctx.font = "bold 8vw Arial";
        ctx.textAlign = "center";
        ctx.shadowBlur = 25;
        ctx.shadowColor = "gold";
        ctx.fillStyle = `rgba(255, 255, 255, ${textAlpha})`;
        ctx.fillText("HAPPY NEW YEAR!", canvas.width / 2, canvas.height / 2);
        ctx.restore();
        textAlpha -= 0.008;
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawText();
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw();
            if (particles[i].alpha <= 0) particles.splice(i, 1);
        }
        requestAnimationFrame(animate);
    }
    animate();
};