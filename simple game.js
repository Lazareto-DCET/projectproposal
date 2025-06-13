// ------------------------------ Tic-Tac-Toe Game ------------------------------

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';

function makeMove(index) {
    if (board[index] === '') {
        board[index] = currentPlayer;
        const button = document.querySelectorAll('#ticTacToe button')[index];
        button.innerText = currentPlayer === 'X' ? '❌' : '⭕';
        if (checkWin()) {
            setTimeout(() => alert(currentPlayer + ' wins!'), 100);
            return;
        }
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
}

function checkWin() {
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }
    return false;
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    const buttons = document.querySelectorAll('#ticTacToe .grid button');
    buttons.forEach(button => button.innerText = '');
    button.style.animation = 'iconPop 0.3s ease-out';
}

// ------------------------------ Rock, Paper, Scissors Game ------------------------------

function playRPS(playerChoice) {
    const choices = ['rock', 'paper', 'scissors'];
    const computerChoice = choices[Math.floor(Math.random() * 3)];
    let result = '';
    if (playerChoice === computerChoice) {
        result = 'It\'s a tie!';
    } else if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'scissors' && computerChoice === 'paper') ||
        (playerChoice === 'paper' && computerChoice === 'rock')
    ) {
        result = 'You win!';
    } else {
        result = 'You lose!';
    }
    document.getElementById('rpsResult').innerText = `You chose ${playerChoice}, computer chose ${computerChoice}. ${result}`;
}

// ------------------------------ Guess the Number Game ------------------------------

let randomNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;

function checkGuess() {
    const guess = document.getElementById('guessInput').value;
    attempts++;
    let message = '';
    if (guess < randomNumber) {
        message = 'Too low! Try again.';
    } else if (guess > randomNumber) {
        message = 'Too high! Try again.';
    } else {
        message = `Congratulations! You guessed the number in ${attempts} attempts.`;
        resetGuessGame();
    }
    document.getElementById('guessResult').innerText = message;
}

function resetGuessGame() {
    randomNumber = Math.floor(Math.random() * 100) + 1;
    attempts = 0;
    document.getElementById('guessInput').value = '';
}

button.innerText = currentPlayer === 'X' ? '❌' : '⭕';




