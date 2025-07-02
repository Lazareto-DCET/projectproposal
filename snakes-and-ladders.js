const canvas = document.getElementById('gameBoard');
const ctx = canvas.getContext('2d');


const tileSize = 50;
const boardSize = 10;
const playerColors = ['#ff00ff', '#00ffff'];
let currentPlayer = 0;

let playerPositions = [1, 1];

const snakes = {
    16: 6, 47: 26, 49: 11, 56: 53, 62: 19,
    64: 60, 87: 24, 93: 73, 95: 75, 98: 78
};

const ladders = {
    1: 38, 4: 14, 9: 31, 21: 42, 28: 84,
    36: 44, 51: 67, 71: 91, 80: 100
};

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '12px Orbitron, sans-serif';
    let number = 100; // Start from 100

    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
            let x = (row % 2 === 0) ? col : 9 - col;
            let tileX = x * tileSize;
            let tileY = row * tileSize;

            // ✅ Make sure `number` exists before using it
            ctx.fillStyle = number % 2 === 0 ? '#1e1e1e' : '#121212';
            ctx.fillRect(tileX, tileY, tileSize, tileSize);
            ctx.strokeStyle = '#00ffea';
            ctx.strokeRect(tileX, tileY, tileSize, tileSize);
            ctx.fillStyle = '#39ff14';
            ctx.fillText(number, tileX + 5, tileY + 15);

            number--;
        }
    }

    drawSnakesAndLadders();
    drawPlayers();
}



function drawSnakesAndLadders() {
    for (let start in snakes) {
        drawSnake(start, snakes[start]);
    }
    for (let start in ladders) {
        drawLadder(start, ladders[start]);
    }
}


function drawLine(start, end, color) {
    const startCoords = getCoords(parseInt(start));
    const endCoords = getCoords(parseInt(end));
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(startCoords.x + tileSize / 2, startCoords.y + tileSize / 2);
    ctx.lineTo(endCoords.x + tileSize / 2, endCoords.y + tileSize / 2);
    ctx.stroke();
}

function drawPlayers() {
    playerPositions.forEach((pos, index) => {
        const coord = getCoords(pos);
        ctx.shadowColor = playerColors[index];
        ctx.shadowBlur = 15;
        ctx.fillStyle = playerColors[index];
        ctx.beginPath();
        ctx.arc(coord.x + tileSize / 2 + (index * 10 - 5), coord.y + tileSize / 2, 10, 0, 2 * Math.PI);
        ctx.fill();
        ctx.shadowBlur = 0;
    });
}

function getCoords(pos) {
    const row = Math.floor((pos - 1) / 10);
    let col = (pos - 1) % 10;

    // In zigzag layout, every other row reverses direction
    if (row % 2 === 1) col = 9 - col;

    return {
        x: col * tileSize,
        y: (9 - row) * tileSize  // Invert Y so row 0 is bottom
    };
}

function drawSnake(start, end) {
    const startCoords = getCoords(parseInt(start));
    const endCoords = getCoords(parseInt(end));
    
    const midX = (startCoords.x + endCoords.x) / 2 + 20 * (Math.random() > 0.5 ? 1 : -1);
    const midY = (startCoords.y + endCoords.y) / 2 + 20 * (Math.random() > 0.5 ? 1 : -1);

    ctx.strokeStyle = '#8e44ad'; // Purple
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(startCoords.x + tileSize / 2, startCoords.y + tileSize / 2);
    ctx.quadraticCurveTo(midX, midY, endCoords.x + tileSize / 2, endCoords.y + tileSize / 2);
    ctx.stroke();
    ctx.lineWidth = 1;
}


function drawLadder(start, end) {
    const startCoords = getCoords(parseInt(start));
    const endCoords = getCoords(parseInt(end));

    const offset = 10;

    // Side rails
    ctx.strokeStyle = '#f39c12'; // Orange
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(startCoords.x + tileSize / 2 - offset, startCoords.y + tileSize / 2);
    ctx.lineTo(endCoords.x + tileSize / 2 - offset, endCoords.y + tileSize / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(startCoords.x + tileSize / 2 + offset, startCoords.y + tileSize / 2);
    ctx.lineTo(endCoords.x + tileSize / 2 + offset, endCoords.y + tileSize / 2);
    ctx.stroke();

    // Rungs
    const rungs = 5;
    for (let i = 1; i < rungs; i++) {
        const t = i / rungs;
        const x1 = lerp(startCoords.x + tileSize / 2 - offset, endCoords.x + tileSize / 2 - offset, t);
        const y1 = lerp(startCoords.y + tileSize / 2, endCoords.y + tileSize / 2, t);
        const x2 = lerp(startCoords.x + tileSize / 2 + offset, endCoords.x + tileSize / 2 + offset, t);
        const y2 = lerp(startCoords.y + tileSize / 2, endCoords.y + tileSize / 2, t);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    ctx.lineWidth = 1;
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}


function rollDice() {
    const diceImg = document.getElementById('diceImage');
    const diceFaces = [
        "1/1b/Dice-1-b.svg",
        "5/5f/Dice-2-b.svg",
        "2/2c/Dice-3-b.svg",
        "8/8d/Dice-4-b.svg",
        "5/55/Dice-5-b.svg",
        "0/08/Dice-6-b.svg"
    ];

    // Show random faces quickly (fake rolling effect)
    let rollCount = 10;
    let rollInterval = setInterval(() => {
        const randomFace = Math.floor(Math.random() * 6);
        diceImg.src = `https://upload.wikimedia.org/wikipedia/commons/${diceFaces[randomFace]}`;
    }, 100);

    setTimeout(() => {
        clearInterval(rollInterval);

        // Final roll result
        const roll = Math.floor(Math.random() * 6) + 1;
        diceImg.src = `https://upload.wikimedia.org/wikipedia/commons/${diceFaces[roll - 1]}`;

        document.getElementById('diceValue').innerText = `Player ${currentPlayer + 1} rolled a ${roll}`;
        animateMovement(roll); // Continue with actual game logic

    }, 1000); // 1 second of animation

    function animateMovement(steps) {
        if (steps <= 0) {
            let finalPos = playerPositions[currentPlayer];
            if (snakes[finalPos]) {
                animateSpecialMove(finalPos, snakes[finalPos], 'snake');
            } else if (ladders[finalPos]) {
                animateSpecialMove(finalPos, ladders[finalPos], 'ladder');
            } else {
                finishTurn();
            }
            return;
        }

        if (playerPositions[currentPlayer] < 100) {
            playerPositions[currentPlayer]++;
        }
        updatePositionText();
        drawBoard();

        setTimeout(() => animateMovement(steps - 1), 300);
    }

    function animateSpecialMove(from, to, type) {
        let direction = to > from ? 1 : -1;

        function step() {
            playerPositions[currentPlayer] += direction;
            updatePositionText();
            drawBoard();

            if (playerPositions[currentPlayer] !== to) {
                setTimeout(step, 100);
            } else {
                finishTurn();
            }
        }

        step();
    }

    function finishTurn() {
        if (playerPositions[currentPlayer] >= 100) {
            setTimeout(() => {
                alert(`🎉 Player ${currentPlayer + 1} wins!`);
                resetGame();
            }, 300);
            return;
        }

        currentPlayer = (currentPlayer + 1) % playerPositions.length;
        document.getElementById('currentPlayerDisplay').innerText =
            `Current Player: Player ${currentPlayer + 1} ${currentPlayer === 0 ? '🔴' : '🔵'}`;
    }
}



function updatePositionText() {
    document.getElementById('playerPositions').innerText =
        `🔴 Player 1: ${playerPositions[0]} | 🔵 Player 2: ${playerPositions[1]}`;
}

function resetGame() {
    playerPositions = [1, 1];
    currentPlayer = 0;
    updatePositionText();
    document.getElementById('currentPlayerDisplay').innerText = `Current Player: Player 1 🔴`;
    document.getElementById('diceValue').innerText = 'Roll the dice to begin!';
    drawBoard();
}

drawBoard();
updatePositionText();
