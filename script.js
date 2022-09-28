const playerFactory = (sign, bot) => {
    let getSign = () => sign;
    let getBot = () => bot;

    return { getSign, getBot }
};

const gameBoard = (() => {
    'use strict';

    let _gameBoard = new Array(9);

    let _threeInRow = false;
    let _winningSymbol = '';

    let _addSymbolToArray = (e) => {
        let tile = e.target
        let index = tile.dataset.index;
        _gameBoard[index] = gameController.nextSign();

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
                }
            }, true)
        });
    };

    return {
        checkStatus,
        addListeners,
        _gameBoard
    }

})();

const gameController = (() => {
    'use strict';

    let _turnCounter = 0;
    let _nextSign = '';
    let _gameInProgress = false;

    let gameInProgress = () => gameInProgress;

    let nextSign = () => {
        // console.log(_turnCounter)
        if (_turnCounter % 2 == 0) {
            _nextSign = 'x'
        } else {
            _nextSign = 'o'
        };
        _turnCounter++;
        return _nextSign
    };

    let startGame = () => {
        // gameBoard.resetBoard();
        gameBoard.addListeners();
        _turnCounter = 0;
        _nextSign = '';
        _gameInProgress = true;

    }

    let endGame = () => {
        _gameInProgress = false;
    }

    return {
        nextSign,
        startGame,
        endGame,
        gameInProgress
    };

})();


let player1 = playerFactory('x', false);
let player2 = playerFactory('o', false);
