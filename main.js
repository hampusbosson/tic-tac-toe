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
        if (diag1.every(cell => cell === 'X') || diag2.every(cell => cell === 'X')) {
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

    return { playTurn, resetGame }; 
})(); 

