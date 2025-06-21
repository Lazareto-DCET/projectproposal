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
        drawLine(start, snakes[start], 'green');
    }
    for (let start in ladders) {
        drawLine(start, ladders[start], 'orange');
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


function rollDice() {
    const roll = Math.floor(Math.random() * 6) + 1;
    document.getElementById('diceValue').innerText = `Player ${currentPlayer + 1} rolled a ${roll}`;

    let steps = roll;
    animateMovement(steps);

    function animateMovement(steps) {
    if (steps <= 0) {
        // Check for snakes or ladders after movement ends
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

        // Move forward by 1
        if (playerPositions[currentPlayer] < 100) {
            playerPositions[currentPlayer]++;
        }
        updatePositionText();
        drawBoard();

        setTimeout(() => animateMovement(steps - 1), 300);
    }

    function animateSpecialMove(from, to, type) {
        let steps = Math.abs(to - from);
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


    playerPositions[currentPlayer] += roll;
    if (playerPositions[currentPlayer] > 100) playerPositions[currentPlayer] = 100;

    const newPos = snakes[playerPositions[currentPlayer]] || ladders[playerPositions[currentPlayer]] || playerPositions[currentPlayer];
    playerPositions[currentPlayer] = newPos;

    updatePositionText();

    if (newPos === 100) {
        setTimeout(() => {
            alert(`🎉 Player ${currentPlayer + 1} wins!`);
            resetGame();
        }, 100);
    } else {
        currentPlayer = (currentPlayer + 1) % playerPositions.length;
        document.getElementById('currentPlayerDisplay').innerText = `Current Player: Player ${currentPlayer + 1} ${currentPlayer === 0 ? '🔴' : '🔵'}`;
    }

    function finishTurn() {
    if (playerPositions[currentPlayer] === 100) {
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


    drawBoard();
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
