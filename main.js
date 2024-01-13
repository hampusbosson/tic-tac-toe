const Gameboard = (() => {
    let board = Array(3).fill().map(() => Array(3).fill('')); 

    const getBoard = () => board; 

    const setCell = (row, col, player) => {
        if (board[row][col] === '') {
            board[row][col] = player; 
        }
    };

    const resetBoard = () => {
        board = Array(3).fill().map(() => Array(3).fill(''));
    };

    return { getBoard, setCell, resetBoard };
})(); 


const Player = (symbol) => {
    const getSymbol = () => symbol; 
    return { getSymbol }; 
}; 

const gameController = (() => {
    const playerX = Player('X'); 
    const playerO = Player('O');  
      
    let currentPlayer = playerX;

    const getCurrentPlayerSymbol = () => {
        return currentPlayer.getSymbol(); 
    } 

    const switchPlayer = () => {
        currentPlayer = currentPlayer === playerX ? playerO : playerX;
    };

    const playTurn = (row, col) => {
        if (Gameboard.getBoard()[row][col] === '') {
            Gameboard.setCell(row, col, currentPlayer.getSymbol());
            console.log(Gameboard.getBoard());
            if (gameResult() === '') {
                switchPlayer(); 
            } else { 
                resetGame(); 
                currentPlayer = playerX; 
            }
            
        }
    };

    const resetGame = () => {
        Gameboard.resetBoard(); 
        currentPlayer = playerX;
    }; 

    let winner = ''; 
    const gameResult = function() {
        winner = ''; 
        const board = Gameboard.getBoard();
        const size = board.length;
        let isWinnerDeclared = false; 

        //check rows and columns
        for(let i = 0; i < size; i++) {
            if (board[i].every(cell => cell === 'X') || board.every(row => row[i] === 'X')) {
                isWinnerDeclared = true; 
                winner = 'X';
            }
            if (board[i].every(cell => cell === 'O') || board.every(row => row[i] === 'O')) {
                isWinnerDeclared = true; 
                winner = 'O';
            }
        }

        //check diagonals
        const diag1 = [board[0][0], board[1][1], board[2][2]];
        const diag2 = [board[0][2], board[1][1], board[2][0]];
        if (diag1.every(cell => cell === 'X') || diag2.every(cell => cell === 'X')) {
            isWinnerDeclared = true; 
            winner = 'X'; 
        }
        if (diag1.every(cell => cell === 'O') || diag2.every(cell => cell === 'O')) {
            isWinnerDeclared = true; 
            winner = 'O'; 
        }

        //check for a tie
        if (isWinnerDeclared === false &&  board.every(row => row.every(cell => cell !== ''))) {
            winner = "tie";
        }

        //no winner yet
        return winner; 
    }

    const getResult = () => {
        return winner;
    };

    return { playTurn, resetGame, getCurrentPlayerSymbol, getResult }; 
})(); 


const UI = (() => {
    const displayLocic = {
        squares: document.querySelectorAll('.square'),
        startButton: document.getElementById('start-btn'),
        restartButton: document.getElementById('restart-btn'),
        player1Input: document.getElementById('player-1'),
        player2Input: document.getElementById('player-2'),
        player1Name: document.querySelector('.p1'),
        player2Name: document.querySelector('.p2'),
        playerNames: document.querySelector('.player-names'),
        inputboxes: document.querySelector('.start-inputs')
    };

    let originalInputBox = displayLocic.inputboxes.innerHTML;
    let originalPlayerNames = displayLocic.playerNames.innerHTML; 
    let originalP1 = displayLocic.player1Input.innerHTML; 
    let originalP2 = displayLocic.player2Input.innerHTML; 

    const playGame = function() {
        displayLocic.startButton.addEventListener('click', startGame);

        displayLocic.squares.forEach(square => {
            square.addEventListener('click', playTurn)
        });

        displayLocic.restartButton.addEventListener('click', restartGame); 
    }

    const playTurn = function(event) {  
            const clickedSquareId = event.target.id; 
            const row = parseInt(clickedSquareId.charAt(0), 10); 
            const column = parseInt(clickedSquareId.charAt(1), 10); 

            if (event.target.textContent === '') {
                if (gameController.getCurrentPlayerSymbol() === 'X') {
                    event.target.textContent = 'X'
                } else {
                    event.target.textContent = 'O';
                }
            }

            gameController.playTurn(row, column);
            displayWinner();
            console.log(gameController.getResult());
    }

    const displayWinner = function() {
        const winner = document.createElement('div');
        if (gameController.getResult() === 'X') {   
            winner.textContent = `${displayLocic.player1Input.value} is the winner!`;
            displayLocic.inputboxes.innerHTML = ''; 
            displayLocic.inputboxes.appendChild(winner); 
        } else if (gameController.getResult() === 'O') {
            winner.textContent = `${displayLocic.player2Input.value} is the winner!`;
            displayLocic.inputboxes.innerHTML = ''; 
            displayLocic.inputboxes.appendChild(winner); 
        } else if (gameController.getResult() === 'tie') {
            winner.textContent = "It's a tie!";
            displayLocic.inputboxes.innerHTML = ''; 
            displayLocic.inputboxes.appendChild(winner); 
        }
    }

    const startGame = function() {
            // Clear the playerNames container
        displayLocic.playerNames.innerHTML = '';
        displayLocic.startButton.style.display = 'none'; 

        // Create and append player 1's name
        const p1Name = document.createElement('div');
        p1Name.textContent = displayLocic.player1Input.value;
        displayLocic.playerNames.appendChild(p1Name);

        // Create and append the "VS" text
        const vsText = document.createElement('span');
        vsText.textContent = ' VS ';
        displayLocic.playerNames.appendChild(vsText);

        // Create and append player 2's name
        const p2Name = document.createElement('div');
        p2Name.textContent = displayLocic.player2Input.value;
        displayLocic.playerNames.appendChild(p2Name);

        // Optionally, hide the input boxes if they are no longer needed
        displayLocic.player1Input.style.display = 'none';
        displayLocic.player2Input.style.display = 'none';
    }

    const restartGame = () => {
        gameController.resetGame();   
        resetSquares(); 
        resetInputs(); 
    }

    const resetSquares = () => {
        Gameboard.resetBoard(); 
        displayLocic.squares.forEach(square => {
            square.textContent = ''; 
        }); 
    }

    const resetInputs = () => {
        displayLocic.inputboxes.innerHTML = originalInputBox;
        displayLocic.playerNames.innerHTML = originalPlayerNames; 
        displayLocic.player1Input.innerHTML = originalP1; 
        displayLocic.player2Input.innerHTML = originalP2; 

        // Re-query the DOM for elements and reattach event listeners
        displayLocic.startButton = document.getElementById('start-btn');
        displayLocic.playerNames = document.querySelector('.player-names');
        displayLocic.player1Input = document.getElementById('player-1');
        displayLocic.player2Input = document.getElementById('player-2');

        // Reattach the event listener to the start button
        displayLocic.startButton.addEventListener('click', startGame);
    }

    return { playGame }
})();


UI.playGame();


