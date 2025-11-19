window.onload = function () {
    const canvas = document.getElementById('sky');
    const ctx = canvas.getContext('2d');
    
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