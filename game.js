let level = 1;
let invaderSpeed = 1; // Initial speed of invaders

// Call this function when all invaders are destroyed
function nextLevel() {
    level++;
    invaderSpeed += 0.5; // Increase speed with each level
    resetInvaders(); // Reset invader positions when progressing to the next level
}

// Reset invaders to start from the top again
function resetInvaders() {
    invaders.forEach((invader, index) => {
        invader.x = (index % invaderColumnCount) * (invaderWidth + invaderMargin);
        invader.y = Math.floor(index / invaderColumnCount) * (invaderHeight + invaderMargin);
        invader.destroyed = false;
    });
}

// Check if all invaders are destroyed
if (invaders.every(invader => invader.destroyed)) {
    nextLevel();
}

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let score = 0;
let isGameOver = false;

// Player settings
const player = {
    x: canvas.width / 2 - 15,
    y: canvas.height - 30,
    width: 30,
    height: 10,
    speed: 5,
    dx: 0
};

// Bullet settings
const bullet = {
    x: player.x + player.width / 2,
    y: player.y,
    width: 5,
    height: 10,
    speed: 5,
    active: false
};

// Invader settings
const invaders = [];
const invaderRowCount = 3;
const invaderColumnCount = 6;
const invaderWidth = 30;
const invaderHeight = 20;
const invaderMargin = 10;
const invaderSpeed = 1;

// Populate invaders
for (let row = 0; row < invaderRowCount; row++) {
    for (let col = 0; col < invaderColumnCount; col++) {
        invaders.push({
            x: col * (invaderWidth + invaderMargin),
            y: row * (invaderHeight + invaderMargin),
            width: invaderWidth,
            height: invaderHeight,
            destroyed: false
        });
    }
}

// Update game objects
function update() {
    if (isGameOver) return;

    // Move player
    player.x += player.dx;

    // Prevent player from going off canvas
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

    // Move bullet
    if (bullet.active) {
        bullet.y -= bullet.speed;
        if (bullet.y < 0) bullet.active = false;
    }

    // Move and check collision for invaders
    invaders.forEach((invader) => {
        if (!invader.destroyed) {
            invader.x += invaderSpeed;
            if (invader.x + invader.width > canvas.width || invader.x < 0) {
                invaderSpeed = -invaderSpeed;
                invader.y += invaderHeight;
            }

            // Check for collision with bullet
            if (bullet.active && !invader.destroyed &&
                bullet.x < invader.x + invader.width &&
                bullet.x + bullet.width > invader.x &&
                bullet.y < invader.y + invader.height &&
                bullet.y + bullet.height > invader.y) {
                    invader.destroyed = true;
                    bullet.active = false;
                    score += 10;
                    document.getElementById('score').textContent = score;
            }

            // Check for game over condition
            if (invader.y + invader.height >= player.y) {
                isGameOver = true;
                alert('Game Over! Final Score: ' + score);
            }
        }
    });
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.fillStyle = 'white';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw bullet
    if (bullet.active) {
        ctx.fillStyle = 'red';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    }

    // Draw invaders
    invaders.forEach((invader) => {
        if (!invader.destroyed) {
            ctx.fillStyle = 'green';
            ctx.fillRect(invader.x, invader.y, invader.width, invader.height);
        }
    });
}

// Game loop
function loop() {
    update();
    draw();
    if (!isGameOver) requestAnimationFrame(loop);
}

// Key event handlers
function keyDown(e) {
    if (e.key === 'ArrowRight') player.dx = player.speed;
    if (e.key === 'ArrowLeft') player.dx = -player.speed;
    if (e.key === ' ' && !bullet.active) {
        bullet.x = player.x + player.width / 2 - bullet.width / 2;
        bullet.y = player.y;
        bullet.active = true;
    }
}

function keyUp(e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') player.dx = 0;
}

// Event listeners
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

// Start the game loop
loop();
