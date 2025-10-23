window.onload = function () {

    let sky = document.getElementById('sky');

    sky.addEventListener('click', function (event) {
        let x = event.clientX;
        let y = event.clientY;
        createFirework(x, y);
    });


    function createFirework(x, y) {
        let numParticles = 50;

        for (let i = 0; i < numParticles; i++) {

            let particle = document.createElement('div');
            particle.classList.add('particle');

            let hue = Math.random() * 360;
            let color = 'hsl(' + hue + ', 100%, 60%)';
            particle.style.setProperty('--color', color);

            let angle = Math.random() * 2 * Math.PI;
            let distance = 120 + Math.random() * 50;
            let xMove = Math.cos(angle) * distance + 'px';
            let yMove = Math.sin(angle) * distance + 'px';

            particle.style.setProperty('--x', xMove);
            particle.style.setProperty('--y', yMove);

            let size = 4 + Math.random() * 6;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';

            let duration = 0.8 + Math.random() * 0.5; // 0.8s to 1.3s
            particle.style.animationDuration = duration + 's';


            particle.style.left = x + 'px';
            particle.style.top = y + 'px';

            sky.append(particle);

            setTimeout(function () {
                particle.remove();
            }, 1200);
        }
    }
};
