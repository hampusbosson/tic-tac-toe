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

function player(name) {
    this.name = name; 
}


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
            gameResult(); 
            console.log(Gameboard.getBoard());
            if (gameResult() === null) {
                switchPlayer(); 
            } else { 
                //always start with playerX
                if (currentPlayer === playerO) {
                    currentPlayer = playerX; 
                }
                displayWinner(); 
                resetGame(); 
            }
            
        }
    };

    const resetGame = () => {
        Gameboard.resetBoard(); 
        currentPlayer = playerX; 
    }; 

    const gameResult = function() {
        const board = Gameboard.getBoard();
        const size = board.length;

        //check rows and columns
        for(let i = 0; i < size; i++) {
            if (board[i].every(cell => cell === 'X') || board.every(row => row[i] === 'X')) {
                return 'X';
            }
            if (board[i].every(cell => cell === 'O') || board.every(row => row[i] === 'O')) {
                return 'O';
            }
        }

        //check diagonals
        const diag1 = [board[0][0], board[1][1], board[2][2]];
        const diag2 = [board[0][2], board[1][1], board[2][0]];
        if (diag1.every(cell => cell === 'X') || diag2.every(cell => cell === 'X')) {
            return 'X'; 
        }
        if (diag1.every(cell => cell === 'O') || diag2.every(cell => cell === 'O')) {
            return 'O'; 
        }

        //check for a tie
        if (board.every(row => row.every(cell => cell !== ''))) {
            return "tie";
        }

        //no winner yet
        return null; 
    }

    const displayWinner = () => {
        if (gameResult() === 'X') {
            alert('The winner is X!')
        } else if (gameResult() === 'O') {
            alert('The winner is O!')
        } else if (gameResult() === 'tie') {
            alert("It's a tie!")
        }
    }

    return { playTurn, resetGame, getCurrentPlayerSymbol }; 
})(); 


const UI = (() => {
    const displayLocic = {
        squares: document.querySelectorAll('.square'),
        startButton: document.getElementById('start-btn'),
        restartButton: document.getElementById('restart-btn'),
        player1Name: document.getElementById('player-1'),
        player2Name: document.getElementById('player-2'),
        playerNames: document.querySelector('.player-names')
    };

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
    }

    const startGame = function() {
        displayLocic.player1Name.style.display = 'none';
        displayLocic.player2Name.style.display = 'none';

        const p1Name = document.createElement('div');
        p1Name.textContent = displayLocic.player1Name.value;
        displayLocic.playerNames.appendChild(p1Name);

        const p2Name = document.createElement('div');
        p2Name.textContent = displayLocic.player2Name.value;
        displayLocic.playerNames.appendChild(p2Name);
        

    }

    const restartGame = () => {
        Gameboard.resetBoard();   
        resetSquares();  
    }

    const resetSquares = () => {
        Gameboard.resetBoard(); 
        displayLocic.squares.forEach(square => {
            square.textContent = ''; 
        }); 
    }

    return { playGame }
})();


UI.playGame();



