function player(name, marker) {
    return { name, marker };
}

const gameboard = (function () {
    //setup a board array, has a function that sets markers on the board
    //a function that resets the board, and a function that checks for a win condition
    //and a function that gets the current state of the board
    const board = []

    const initializeBoard = () => {
        const size = 9; // For a 3x3 Tic Tac Toe board
        for (let i = 0; i < size; i++) {
            board[i] = null; // Initialize all cells to null
        }
    }

    const resetBoard = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = null;
        }
    };

    const setMarker = (index, marker) => {
        if (index >= 0 && index < board.length && !board[index]) {
            board[index] = marker;
            return true;
        }
        return false;
    };

    const checkWinCondition = () => {
        const winPatterns = [
            [0, 1, 2], // Row 1
            [3, 4, 5], // Row 2
            [6, 7, 8], // Row 3
            [0, 3, 6], // Column 1
            [1, 4, 7], // Column 2
            [2, 5, 8], // Column 3
            [0, 4, 8], // Diagonal \
            [2, 4, 6]  // Diagonal /
        ];

        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a]; // Return the marker of the winning player
            }
        }
        return null; // No winner yet
    }

    const getBoard = () => {
        return board;
    };


    return {
        initializeBoard,
        resetBoard,
        setMarker,
        getBoard,
        checkWinCondition
    };
})();

const gameController = (function () {
    let player1, player2, currentPlayer, gameActive = false;
    let scores = { player1: 0, player2: 0 };

    const startGame = (name1, name2) => {
        player1 = player(name1, 'X');
        player2 = player(name2, 'O');
        currentPlayer = player1;
        gameboard.initializeBoard();
        gameActive = true;
        // Reset scores only if new players
        if (scores.player1Name !== name1 || scores.player2Name !== name2) {
            scores = { player1: 0, player2: 0, player1Name: name1, player2Name: name2 };
        } else {
            scores.player1Name = name1;
            scores.player2Name = name2;
        }
    };

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const makeMove = (index) => {
        if (gameActive && gameboard.setMarker(index, currentPlayer.marker)) {
            const winner = gameboard.checkWinCondition();
            if (winner) {
                gameActive = false;
                // Increment score for the winner
                if (winner === player1.marker) scores.player1++;
                if (winner === player2.marker) scores.player2++;
                return `${currentPlayer.name} wins!`;
            } else if (gameboard.getBoard().every(cell => cell !== null)) {
                gameActive = false;
                return 'It\'s a draw!';
            }
            switchPlayer();
            return null; // No winner yet
        }
        return 'Invalid move';
    };

    const resetGame = () => {
        gameboard.resetBoard();
        gameActive = false;
        currentPlayer = null;
    };

    const getScores = () => ({
        player1: scores.player1,
        player2: scores.player2,
        player1Name: player1 ? player1.name : '',
        player2Name: player2 ? player2.name : ''
    });

    const getCurrentPlayer = () => currentPlayer;

    return {
        startGame,
        makeMove,
        resetGame,
        getScores,
        getCurrentPlayer
    };
})();

const displayController = (function () {
    // --- DOM Elements ---
    const gameStatusElement = document.getElementById('game-status');
    const currentTurnElement = document.getElementById('current-turn');
    const player1ScoreElement = document.getElementById('player1-score');
    const player2ScoreElement = document.getElementById('player2-score');
    const player1NameDisplay = document.getElementById('player1-name');
    const player2NameDisplay = document.getElementById('player2-name');
    const addBtn = document.querySelector('.add-btn');
    const startBtn = document.querySelector('.start-game');
    const mainMenu = document.querySelector('.main-menu');
    const gameDisplay = document.querySelector('.game-display');
    const resetBtn = document.querySelector('.reset-game');
    const backBtn = document.querySelector('.back-btn');
    const cells = document.querySelectorAll('.cell');

    // --- Helper Functions ---

    // Get player names from form
    function getPlayerNames() {
        return {
            player1: document.getElementById('player1').value.trim(),
            player2: document.getElementById('player2').value.trim()
        };
    }

    // Update player name displays in menu and score area
    function updatePlayerNameDisplays() {
        const { player1, player2 } = gameController.getScores();
        player1NameDisplay.textContent = `Name: ${player1 ? player1 : ''}`;
        player2NameDisplay.textContent = `Name: ${player2 ? player2 : ''}`;
        updateScoreLabels();
    }

    // Update score numbers and labels
    function updateScoreLabels() {
        const scores = gameController.getScores();
        player1ScoreElement.textContent = scores.player1;
        player2ScoreElement.textContent = scores.player2;
        player1ScoreElement.parentElement.firstChild.textContent = `${scores.player1Name}: `;
        player2ScoreElement.parentElement.firstChild.textContent = `${scores.player2Name}: `;
    }

    // Clear the game board UI and reset status
    function clearBoardUI() {
        gameboard.resetBoard();
        cells.forEach(cell => cell.textContent = '');
        gameStatusElement.textContent = 'In Progress';
        const scores = gameController.getScores();
        currentTurnElement.textContent = scores.player1Name;
    }

    // --- Event Handlers ---

    // Add Players
    addBtn.addEventListener('click', function (e) {
        e.preventDefault();
        const { player1, player2 } = getPlayerNames();
        if (player1 && player2) {
            player1NameDisplay.textContent = `Name: ${player1}`;
            player2NameDisplay.textContent = `Name: ${player2}`;
            updateScoreLabels();
        }
    });

    // Start Game
    startBtn.addEventListener('click', function () {
        const { player1, player2 } = getPlayerNames();
        if (!player1 || !player2) {
            alert('Please add both player names before starting the game.');
            return;
        }
        mainMenu.style.display = 'none';
        gameDisplay.style.display = 'flex';
        gameController.startGame(player1, player2);
        updateScoreLabels();
        clearBoardUI();
        currentTurnElement.textContent = player1;
    });

    // Reset Game
    resetBtn.addEventListener('click', function () {
        const scores = gameController.getScores();
        gameController.resetGame();
        gameController.startGame(scores.player1Name, scores.player2Name);
        clearBoardUI();
    });

    // Back to Main Menu
    backBtn.addEventListener('click', function () {
        gameController.resetGame();
        clearBoardUI();
        gameDisplay.style.display = 'none';
        mainMenu.style.display = 'flex';
    });

    // Handle Cell Clicks
    cells.forEach(cell => {
        cell.addEventListener('click', function () {
            const index = parseInt(cell.getAttribute('data-index'));
            if (cell.textContent !== '') return;

            const result = gameController.makeMove(index);
            const board = gameboard.getBoard();
            cell.textContent = board[index];

            if (result === null) {
                // No winner yet, update turn
                const currentPlayer = gameController.getCurrentPlayer();
                currentTurnElement.textContent = currentPlayer.name;
                gameStatusElement.textContent = 'In Progress';
            } else {
                // Game ended (win or draw)
                gameStatusElement.textContent = result;
                updateScoreLabels();
            }
        });
    });

    // --- Initial UI State ---
    window.addEventListener('DOMContentLoaded', function () {
        mainMenu.style.display = 'flex';
        gameDisplay.style.display = 'none';
        updateScoreLabels();
    });
})();

globalThis.gameController = gameController;
globalThis.gameboard = gameboard;