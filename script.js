const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const balls = [];
const colors = ['#FF5733', '#33FF57', '#3357FF', '#F1C40F', '#8E44AD', '#E74C3C', '#3498DB'];

class Ball {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.opacity = 0.5;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.speedX = -this.speedX;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.speedY = -this.speedY;
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.filter = 'blur(2px)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.filter = 'none';
        ctx.globalAlpha = 1;
    }
}

for (let i = 0; i < 50; i++) {
    const radius = 10;
    const x = Math.random() * (canvas.width - radius * 2) + radius;
    const y = Math.random() * (canvas.height - radius * 2) + radius;
    balls.push(new Ball(x, y, radius));
}

let countdownActive = true;
let countdownDuration = null; // Variable to hold the countdown duration
let countdownStartTime = null; // Variable to hold the start time of the countdown

function updateCountdown() {
    const options = { timeZone: 'Europe/Luxembourg' };
    const now = new Date().toLocaleString('en-US', options);
    const currentDate = new Date(now);
    const newYear = new Date(currentDate.getFullYear() + 1, 0, 1);
    const timeDifference = newYear - currentDate;
    const totalSeconds = Math.floor(timeDifference / 1000);

    // If the user has triggered the special countdown, set it to 3 seconds
    const effectiveSeconds = countdownDuration !== null ? countdownDuration : totalSeconds;

    const days = Math.floor(effectiveSeconds / 86400);
    const hours = Math.floor((effectiveSeconds % 86400) / 3600);
    const minutes = Math.floor((effectiveSeconds % 3600) / 60);
    const seconds = effectiveSeconds % 60;

    if (effectiveSeconds > 0) {
        document.getElementById('time').innerText = `${String(days).padStart(2, '0')} : ${String(hours).padStart(2, '0')} : ${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`;
    } else if (countdownActive) {
        countdownActive = false;
        // Redirect to new-year.html immediately
        window.location.href = 'new-year.html';
    }

    // If countdownDuration is set to 3, decrement it
    if (countdownDuration !== null) {
        countdownDuration--;
    }
}

// Event listener for key presses
let typedString = '';
document.addEventListener('keydown', (event) => {
    typedString += event.key; // Append the pressed key to the typed string

    // Check if the typed string matches "protopapadakis"
    if (typedString.endsWith("protopapadakis")) {
        countdownDuration = 3; // Set countdown to 3 seconds
        typedString = ''; // Reset the typed string
    }

    // Reset the typed string if it exceeds the length of the target string
    if (typedString.length > "protopapadakis".length) {
        typedString = typedString.slice(1);
    }
});

// Start the countdown update interval
setInterval(updateCountdown, 1000);
updateCountdown();

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    balls.forEach(ball => {
        ball.update();
        ball.draw();
    });
    requestAnimationFrame(update);
}

update();

