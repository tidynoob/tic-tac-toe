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
        let tiles = document.querySelectorAll('.clicked');
        tiles.forEach(tile => {
            tile.removeEventListener('click', tile.fn, true);
        });
    }

    let _winningStates = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    let getWinningStates = () => _winningStates;

    let getGameBoard = () => _gameBoard;

    let checkStatus = (gameBoard) => {

        let threeInRow = false;
        let winningSymbol = '';

        _winningStates.forEach(state => {

            let gamePartition = gameBoard.filter((element, index) => {
                return state.includes(index);
            });

            let result = gamePartition.every(element => {
                if (element === gamePartition[0] && element) {
                    return true
                }
            });

            if (result) {
                threeInRow = true;
                winningSymbol = gamePartition[0];
            }
        });

        return {
            threeInRow,
            winningSymbol
        };

    }

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
        tiles.forEach(tile => {
            tile.classList.remove('clicked');
            tile.removeEventListener('click', tile.fn, true);
        });
    }

    return {
        checkStatus,
        addListeners,
        reset,
        getGameBoard,
        getWinningStates,
    }

})();

const gameController = (() => {
    'use strict';

    let _turnCounter = 0;
    let _nextSign = '';
    let _gameInProgress = false;
    let _gameStatus = '';

    let toggleCurrentTurn = () => {
        if (player1.currentPlayer()) {
            player1.currentTurn(false);
            player2.currentTurn(true);
            _gameStatus = "O's turn";
        } else {
            player1.currentTurn(true);
            player2.currentTurn(false);
            _gameStatus = "X's turn";
        }
    }

    let gameInProgress = () => _gameInProgress;

    let gameStatus = () => _gameStatus;

    let player1 = {};
    let player2 = {};

    let getCurrentPlayer = () => {
        if (player1.currentPlayer()) {
            return player1
        } else {
            return player2
        }
    }

    let nextTurn = () => {

        _nextSign = getCurrentPlayer().getSign();
        gameController.toggleCurrentTurn();
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
        player1 = displayController.getPlayers()[0];
        player2 = displayController.getPlayers()[1];
        _turnCounter = 0;
        _gameInProgress = true;
        _gameStatus = "X's turn";
        displayController.updateGameStatus(_gameStatus);
        player1.currentTurn(true);
        _nextSign = player1.getSign();
        AI.botMakeMove(getCurrentPlayer());

    }

    let endGame = () => {
        let threeInRow = gameBoard.checkStatus(gameBoard.getGameBoard()).threeInRow;
        let winningSymbol = gameBoard.checkStatus(gameBoard.getGameBoard()).winningSymbol;
        if (_turnCounter >= 9 || threeInRow == true) {
            _gameInProgress = false;
            player1.currentTurn(false);
            player2.currentTurn(false);
            if (threeInRow == false) {
                _gameStatus = "It's a draw!"
            } else if (winningSymbol == 'x') {
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
        toggleCurrentTurn,
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
    let _errorText = document.querySelector('.invalid-feedback');

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
            button.classList.add('required')
        } else {
            button.disabled = true;
        }
    }

    let _getBot = (playerButton) => {
        return playerButton.checked ? true : false
    }

    let getBotDifficulty = () => {
        return _botDifficulty.value
    }

    let getPlayers = () => {
        let player1 = playerFactory('x', _getBot(_player1));
        let player2 = playerFactory('o', _getBot(_player2));
        return [player1, player2]
    };

    let updateGameStatus = (status) => {
        _gameStatus.innerText = status;
    }

    let addListeners = () => {
        _startGame.addEventListener('click', (e) => {
            if (_botDifficulty.disabled == false && getBotDifficulty() == '') {
                _errorText.classList.remove('invisible');
                _botDifficulty.classList.add('is-invalid');
                return;
            }


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
            _checkIfClickable(_botDifficulty);
        })

        _player2.addEventListener('change', (e) => {
            _checkIfClickable(_botDifficulty);
        })

        _botDifficulty.addEventListener('change', (e) => {
            _errorText.classList.add('invisible');
            _botDifficulty.classList.remove('is-invalid');
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

    _getAvailableMoves = (gameBoard) => {
        let blanks = gameBoard.reduce((a, e, i) => {
            if (e == '') a.push(i)
            return a;
        }, []);
        return blanks;
    }

    _randomIndex = (array) => {
        return array[Math.floor((Math.random() * array.length))];
    }

    _twoInRowCheck = (sign) => {
        let _winningStates = gameBoard.getWinningStates();
        let _gameBoard = gameBoard.getGameBoard();

        let indexOfThird = '10';

        _winningStates.forEach(state => {
            let gamePartition = _gameBoard.filter((element, index) => {
                return state.includes(index);
            });

            let signCount = gamePartition.reduce((allSigns, sign) => {
                const currCount = allSigns[sign] ?? 0;
                return {
                    ...allSigns,
                    [sign]: currCount + 1,
                };
            }, {})

            let result = (signCount[''] == 1 && signCount[sign] == 2) ? true : false;

            if (result) {
                indexOfThird = state[gamePartition.indexOf('')];
            }
        });

        return indexOfThird
    }

    let _minimax = (_gameBoard, currentSign) => {
        let good = currentSign;
        let bad = (currentSign == 'x') ? 'o' : 'x';
        let __gameBoard = _gameBoard;

        let __minimax = (__gameBoard, player) => {
            let availableMoves = _getAvailableMoves(__gameBoard);

            if (gameBoard.checkStatus(__gameBoard).winningSymbol == good) {
                return { score: 10 }
            } else if (gameBoard.checkStatus(__gameBoard).winningSymbol == bad) {
                return { score: -10 }
            } else if (availableMoves.length == 0) {
                return { score: 0 }
            }

            let moves = [];
            for (let i = 0; i < availableMoves.length; i++) {
                let move = {};
                move.index = availableMoves[i];
                __gameBoard[availableMoves[i]] = player;

                if (player == good) {
                    var result = __minimax(__gameBoard, bad);
                    move.score = result.score;
                } else {
                    var result = __minimax(__gameBoard, good);
                    move.score = result.score;
                }
                __gameBoard[availableMoves[i]] = '';
                moves.push(move);
            };

            var bestMove;
            if (player == good) {
                var bestScore = -10000;
                for (let i = 0; i < moves.length; i++) {
                    if (moves[i].score > bestScore) {
                        bestScore = moves[i].score;
                        bestMove = i;
                    }
                }
            } else {
                var bestScore = 10000;
                for (let i = 0; i < moves.length; i++) {
                    if (moves[i].score < bestScore) {
                        bestScore = moves[i].score;
                        bestMove = i;
                    }
                }
            }

            return moves[bestMove];
        };

        let move = __minimax(__gameBoard, good);

        return move.index;

    }

    _indexOfMove = () => {
        let index = '';
        let difficulty = displayController.getBotDifficulty();
        let turnCounter = gameController.getTurnCounter();
        let availableMoves = _getAvailableMoves(gameBoard.getGameBoard());
        let currentSign = gameController.getCurrentPlayer().getSign();
        let altSign = (currentSign == 'x') ? 'o' : 'x';
        let thirdInRow = _twoInRowCheck(currentSign);
        let thirdInRowAlt = _twoInRowCheck(altSign);

        if (difficulty == 'hard') {

            // check if opponent has two in row and block
            // also check if bot has two in row and finish that

            if (thirdInRow != '10') {
                index = thirdInRow
            } else if (thirdInRowAlt != '10') {
                index = thirdInRowAlt
            } else {
                index = _randomIndex(availableMoves)
            }
        } else if (difficulty == 'impossible') {
            index = _minimax(gameBoard.getGameBoard(), currentSign);
        } else {
            // easy move / default
            index = _randomIndex(availableMoves);
        }

        return index;
    }

    botMakeMove = (player) => {
        if (player.getBot() && player.currentPlayer()) {
            let index = _indexOfMove();
            let tile = document.querySelector(`[data-index="${index}"]`);
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