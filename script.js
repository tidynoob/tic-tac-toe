const playerFactory = (sign, bot) => {
    let _sign = sign;
    let _bot = bot;
    let _currentTurn = false;

    let getSign = () => _sign;
    let getBot = () => _bot;
    let currentPlayer = () => _currentTurn;
    const currentTurn = symbolTurn => {
        _currentTurn = symbolTurn
    };

    return { getSign, getBot, currentTurn, currentPlayer }
};

const gameBoard = (() => {
    'use strict';

    let _gameBoard = new Array(9).fill('');

    let _threeInRow = false;
    let _winningSymbol = '';

    let _addSymbolToArray = (e) => {
        let tile = e.target
        let index = tile.dataset.index;
        _gameBoard[index] = gameController.nextTurn();

    };

    let _addSymbolToDoc = (e) => {
        let tile = e.target;
        let index = tile.dataset.index;
        let img = document.createElement('img');

        if (_gameBoard[index] == 'x') {
            img.src = './icons/x.svg'
        } else {
            img.src = './icons/o.svg'
        };

        img.classList.add('w-three-quarter');
        tile.classList.add('clicked');
        tile.appendChild(img);

    }

    let _removeListener = () => {
        let tile = document.querySelector('.clicked');
        tile.removeEventListener('click', tile.fn, true);
    }

    let getGameBoard = () => _gameBoard;

    // let botInput = (index, sign) => {
    //     _gameBoard[index] = sign
    // }

    let checkStatus = () => {
        if ((_gameBoard[0] == _gameBoard[1]) && (_gameBoard[0] == _gameBoard[2]) && (_gameBoard[0] == 'x') ||
            (_gameBoard[3] == _gameBoard[4]) && (_gameBoard[3] == _gameBoard[5]) && (_gameBoard[3] == 'x') ||
            (_gameBoard[6] == _gameBoard[7]) && (_gameBoard[6] == _gameBoard[8]) && (_gameBoard[6] == 'x') ||
            (_gameBoard[0] == _gameBoard[3]) && (_gameBoard[0] == _gameBoard[6]) && (_gameBoard[0] == 'x') ||
            (_gameBoard[1] == _gameBoard[4]) && (_gameBoard[1] == _gameBoard[7]) && (_gameBoard[1] == 'x') ||
            (_gameBoard[2] == _gameBoard[5]) && (_gameBoard[2] == _gameBoard[8]) && (_gameBoard[2] == 'x') ||
            (_gameBoard[0] == _gameBoard[4]) && (_gameBoard[0] == _gameBoard[8]) && (_gameBoard[0] == 'x') ||
            (_gameBoard[6] == _gameBoard[4]) && (_gameBoard[6] == _gameBoard[2]) && (_gameBoard[6] == 'x')) {
            _threeInRow = true;
            _winningSymbol = 'x';

        }
        if ((_gameBoard[0] == _gameBoard[1]) && (_gameBoard[0] == _gameBoard[2]) && (_gameBoard[0] == 'o') ||
            (_gameBoard[3] == _gameBoard[4]) && (_gameBoard[3] == _gameBoard[5]) && (_gameBoard[3] == 'o') ||
            (_gameBoard[6] == _gameBoard[7]) && (_gameBoard[6] == _gameBoard[8]) && (_gameBoard[6] == 'o') ||
            (_gameBoard[0] == _gameBoard[3]) && (_gameBoard[0] == _gameBoard[6]) && (_gameBoard[0] == 'o') ||
            (_gameBoard[1] == _gameBoard[4]) && (_gameBoard[1] == _gameBoard[7]) && (_gameBoard[1] == 'o') ||
            (_gameBoard[2] == _gameBoard[5]) && (_gameBoard[2] == _gameBoard[8]) && (_gameBoard[2] == 'o') ||
            (_gameBoard[0] == _gameBoard[4]) && (_gameBoard[0] == _gameBoard[8]) && (_gameBoard[0] == 'o') ||
            (_gameBoard[6] == _gameBoard[4]) && (_gameBoard[6] == _gameBoard[2]) && (_gameBoard[6] == 'o')) {
            _threeInRow = true;
            _winningSymbol = 'o';
        }

        return {
            threeInRow: _threeInRow,
            winningSymbol: _winningSymbol
        };
    };

    let addListeners = () => {
        let tiles = document.querySelectorAll('.blank');
        tiles.forEach(tile => {
            tile.addEventListener('click', tile.fn = (e) => {
                if (gameController.gameInProgress()) {
                    _addSymbolToArray(e);
                    _addSymbolToDoc(e);
                    _removeListener();
                    gameController.endGame();
                    AI.botMakeMove(gameController.getCurrentPlayer());
                }
            }, true)
        });
    };

    let reset = () => {
        _gameBoard = new Array(9).fill('');
        _threeInRow = false;
        _winningSymbol = '';
        let imgs = document.querySelectorAll('img.w-three-quarter');
        imgs.forEach(img => { img.remove() });
        let tiles = document.querySelectorAll('.blank');
        tiles.forEach(tile => { tile.removeEventListener('click', tile.fn, true) });
    }

    return {
        checkStatus,
        addListeners,
        reset,
        getGameBoard,
    }

})();

const gameController = (() => {
    'use strict';

    let _turnCounter = 0;
    let _nextSign = '';
    let _gameInProgress = false;
    let _gameStatus = '';

    let gameInProgress = () => _gameInProgress;

    let gameStatus = () => _gameStatus;

    let player1 = {};
    let player2 = {};

    let getCurrentPlayer = () => {
        return (player1.currentPlayer()) ? player1 : player2
    }

    let nextTurn = () => {
        // console.log(_turnCounter)
        if (_turnCounter % 2 == 0) {
            _nextSign = 'x';
            // AI.botMakeMove(player1);            
            player1.currentTurn(false);
            player2.currentTurn(true);
            _gameStatus = "O's turn";
        } else {
            _nextSign = 'o';
            // _nextSign = player2.getSign();
            // AI.botMakeMove(player2);
            player2.currentTurn(false);
            player1.currentTurn(true);
            _gameStatus = "X's turn";

        };
        displayController.updateGameStatus(_gameStatus);
        _turnCounter++;
        return _nextSign
    };

    let getNextSign = () => {
        return _nextSign
    }

    let getTurnCounter = () => {
        return _turnCounter
    }

    let startGame = () => {
        gameBoard.reset();
        gameBoard.addListeners();
        // console.log(displayController.getPlayers());
        player1 = displayController.getPlayers()[0];
        player2 = displayController.getPlayers()[1];
        // console.log(player1);
        _turnCounter = 0;
        _nextSign = '';
        _gameInProgress = true;
        _gameStatus = "X's turn";
        displayController.updateGameStatus(_gameStatus);
        player1.currentTurn(true);
        AI.botMakeMove(getCurrentPlayer());
    }

    let endGame = () => {
        let threeInRow = gameBoard.checkStatus().threeInRow
        let winningSymbol = gameBoard.checkStatus().winningSymbol
        if (_turnCounter >= 9 || threeInRow == true) {
            _gameInProgress = false;
            player1.currentTurn(false);
            player2.currentTurn(false);
            if (threeInRow == false) {
                _gameStatus = "It's a draw!"
            } else if (winningSymbol = 'x') {
                _gameStatus = "X wins!"
            } else {
                _gameStatus = "O wins!"
            }
            displayController.updateGameStatus(_gameStatus);
            halfmoon.toggleSidebar();

        }
    }

    let resetGame = () => {
        _turnCounter = 0;
        _nextSign = '';
        _gameInProgress = false;
        _gameStatus = 'Game has been reset';
        displayController.updateGameStatus(_gameStatus);
        player1.currentTurn(false);
        player2.currentTurn(false);
        gameBoard.reset();

    }

    return {
        nextTurn,
        startGame,
        endGame,
        gameInProgress,
        gameStatus,
        resetGame,
        getNextSign,
        getCurrentPlayer,
        getTurnCounter,
    };

})();

let displayController = (() => {
    'use strict';

    let _player1 = document.querySelector('#player1');
    let _player2 = document.querySelector('#player2');
    let _botDifficulty = document.querySelector('#bot-difficulty');
    let _startGame = document.querySelector('#startGame');
    let _reset = document.querySelector('#reset');
    let _gameStatus = document.querySelector('#gameStatus > h2');

    let _toggleClickable = (button) => {
        if (button.disabled == true) {
            button.disabled = false;
        } else {
            button.disabled = true;
        }
    }

    let _disableClick = (button) => {
        button.disabled = true;
    }

    let _checkIfClickable = (button) => {
        if (_getBot(_player1) || _getBot(_player2)) {
            button.disabled = false;
        } else {
            button.disabled = true;
        }
    }

    let _getBot = (playerButton) => {
        return playerButton.checked ? true : false
    }

    let getBotDifficulty = () => {
        console.log(_botDifficulty.value);
        return _botDifficulty.value
    }

    let getPlayers = () => {
        let player1 = playerFactory('x', _getBot(_player1));
        let player2 = playerFactory('x', _getBot(_player2));
        return [player1, player2]
    };

    let updateGameStatus = (status) => {
        _gameStatus.innerText = status;
    }

    let addListeners = () => {
        _startGame.addEventListener('click', (e) => {
            if (!gameController.gameInProgress()) {
                _toggleClickable(_startGame);
                _toggleClickable(_player1);
                _toggleClickable(_player2);
                _toggleClickable(_reset);
                _disableClick(_botDifficulty);
                gameController.startGame();
                halfmoon.toggleSidebar();
            }
        });

        _reset.addEventListener('click', (e) => {
            _toggleClickable(_startGame);
            _toggleClickable(_player1);
            _toggleClickable(_player2);
            _toggleClickable(_reset);
            _checkIfClickable(_botDifficulty);
            gameController.resetGame();
        });

        _player1.addEventListener('change', (e) => {
            console.log(e.target.checked);
            _checkIfClickable(_botDifficulty);
        })

        _player2.addEventListener('change', (e) => {
            _checkIfClickable(_botDifficulty);
        })
    }

    return {
        addListeners,
        getPlayers,
        updateGameStatus,
        getBotDifficulty
    }

})();

let AI = (() => {

    let _gameBoard = new Array()

    _getAvailableMoves = () => {
        _gameBoard = gameBoard.getGameBoard();
        let blanks = _gameBoard.reduce((a, e, i) => {
            if (e == '') a.push(i)
            return a;
        }, []);
        // console.log(blanks);
        return blanks;
    }

    _randomIndex = (array) => {
        return array[Math.floor((Math.random() * array.length))];
    }

    _indexOfMove = () => {
        let index = '';
        let difficulty = displayController.getBotDifficulty();
        let turnCounter = gameController.getTurnCounter();
        let availableMoves = _getAvailableMoves();

        if (difficulty == 'easy') {
            index = _randomIndex(availableMoves);
            // console.log(index);
        } else if (difficulty == 'hard') {

            // first move
            if (turnCounter == 0) {

            }

        }
        console.log(index);
        return index;
    }

    botMakeMove = (player) => {
        // console.log('test');
        if (player.getBot() && player.currentPlayer()) {
            // let sign = gameController.getNextSign();
            let index = _indexOfMove(_getAvailableMoves());
            // gameBoard.botInput(index, sign);
            let tile = document.querySelector(`[data-index="${index}"]`);
            // console.log(tile);
            setTimeout(() => { tile.click() }, 1000);
        }

    }

    return {
        botMakeMove,
    }

})();

window.addEventListener('DOMContentLoaded', (event) => {
    displayController.addListeners();
});