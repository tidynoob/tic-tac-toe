const playerFactory = (sign, bot) => {
    let _sign = sign;
    let _bot = bot;
    let _currentTurn = false;

    let getSign = () => _sign;
    let getBot = () => _bot;
    let currentTurn = (symbolTurn) => _curreTurn = symbolTurn;

    return { getSign, getBot, currentTurn }
};

const gameBoard = (() => {
    'use strict';

    let _gameBoard = new Array(9);

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
                }
            }, true)
        });
    };

    let reset = () => {
        _gameBoard = new Array(9);
        let imgs = document.querySelectorAll('img.w-three-quarter');
        imgs.forEach(img => {img.remove()});
        let tiles = document.querySelectorAll('.blank');
        tiles.forEach(tile => { tile.removeEventListener('click', tile.fn, true)});
    }

    return {
        checkStatus,
        addListeners,
        reset
        // _gameBoard
    }

})();

const gameController = (() => {
    'use strict';

    let _turnCounter = 0;
    let _nextSign = '';
    let _gameInProgress = false;
    let _gameStatus = '';

    // let player1 = playerFactory('x', false);
    // let player2 = playerFactory('o', false);

    let gameInProgress = () => _gameInProgress;

    let gameStatus = () => _gameStatus;

    let nextTurn = () => {
        // console.log(_turnCounter)
        if (_turnCounter % 2 == 0) {
            _nextSign = 'x';
            player1.currentTurn(false);
            player2.currentTurn(true);
            _gameStatus = "O's turn";
        } else {
            _nextSign = 'o';
            player2.currentTurn(false);
            player1.currentTurn(true);
            _gameStatus = "X's turn";

        };
        console.log(_gameStatus);
        _turnCounter++;
        return _nextSign
    };

    let startGame = () => {
        gameBoard.reset();
        gameBoard.addListeners();
        _turnCounter = 0;
        _nextSign = '';
        _gameInProgress = true;
        _gameStatus = "X's turn"
        player1.currentTurn(true);
    }

    let endGame = () => {
        let threeInRow = gameBoard.checkStatus().threeInRow
        let winningSymbol = gameBoard.checkStatus().winningSymbol
        if (_turnCounter >= 8 || threeInRow == true) {
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
            console.log(_gameStatus)
        }
    }

    return {
        nextTurn,
        startGame,
        endGame,
        gameInProgress,
        gameStatus,
        player1,
        player2,
    };

})();

let displayController = (() => {

    let _player1 = document.querySelector('#player1');
    let _player2 = document.querySelector('#player2');
    let _botDifficulty = document.querySelector('#bot-difficulty');
    let _startGame = document.querySelector('#startGame');
    let _reset = document.querySelector('#reset');
    let _gameStatus = document.querySelector('#gameStatus');

    let getPlayers = () => {
        if (_player1.checked == true) {
            let player1 = playerFactory('x', true)
        } else {
            let player1 = playerFactory('x', false)
        }
        if (_player2.checked == true) {
            let player2 = playerFactory('x', true)
        } else {
            let player2 = playerFactory('x', false)
        }
        return {player1, player2}
    } 

})();