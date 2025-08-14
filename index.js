
function player(name, marker) {
    return {name, marker};
}

const gameboard = (function () {
    //setup the 2d gameboard, has a function that sets markers on the board
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
    // This module will handle the game logic, including player turns and checking for a win condition and game state
    let player1, player2, currentPlayer, gameActive = false;

    const startGame = (name1, name2) => {
        player1 = player(name1, 'X');
        player2 = player(name2, 'O');
        currentPlayer = player1;
        gameboard.initializeBoard();
        gameActive = true;
    };

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const makeMove = (index) => {
        if (gameActive && gameboard.setMarker(index, currentPlayer.marker)) {
            const winner = gameboard.checkWinCondition();
            if (winner) {
                gameActive = false;
                return `${currentPlayer.name} wins!`;
            }else if (gameboard.getBoard().every(cell => cell !== null)) {
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

    const keepPlayerScore = () => {
        // This function is used to keep track of player scores
        // For simplicity, I used an object to store scores
        const scores = {
            [player1.name]: 0,
            [player2.name]: 0
        };

        return {
            incrementScore: (winnerName) => {
                if (scores[winnerName] !== undefined) {
                    scores[winnerName]++;
                }
            },
            getScores: () => scores
        };
    }
    return {
        startGame,
        makeMove,
        resetGame,
        keepPlayerScore
    };
})();

const displayController = (function () {
    // This module will handle the UI, including rendering the game board and updating it based on player actions

})();

globalThis.gameController = gameController;
globalThis.gameboard = gameboard;