/**
 * define const
 */
const NUM_ROWS = 20;
const NUM_COLS = 10;
const BLOCK_WIDTH = 30;
const BLOCK_HEIGHT = 30;
const TICK_MS = 400;
const KEY_ENTER = 13;
const KEY_SPACE = 32;
const KEY_LEFT = 37;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;
const KEY_UP = 38;
const KEY_R = 82;
const pieces =
    [
        [
            [0, 0, 0, 0],
            [0, 1, 1, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 0]
        ],
        [
            [0, 0, 1, 0],
            [0, 1, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 0, 0, 0],
            [0, 0, 1, 1],
            [0, 1, 1, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 0, 0, 0],
            [0, 1, 1, 0],
            [0, 0, 1, 1],
            [0, 0, 0, 0]
        ],
        [
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0]
        ]
    ];

function Tetris() {
    this.gameOver = false;
    this.score = 0;
    this.currentPiece = randomPiece();
    this.nextPiece = randomPiece();
    this.pieceY = 0;
    this.pieceX = 3;
    this.rows = [];

    for (var i = 0; i < NUM_ROWS; i++) {
        this.rows[i] = [];

        for (var j = 0; j < NUM_COLS; j++) {
            this.rows[i][j] = 0;
        }
    }
}

/**
 * @public
 */
Tetris.prototype.tick = function () {
    if (this.gameOver) {
        return false;
    }

    if (intersects(this.rows, this.currentPiece, this.pieceY + 1, this.pieceX)) {
        this.rows = applyPiece(this.rows, this.currentPiece, this.pieceY, this.pieceX);

        var r = killRows(this.rows);

        this.rows = r.rows;
        this.score += 1 + r.numRowsKilled * r.numRowsKilled * NUM_COLS;

        if (intersects(this.rows, this.nextPiece, 0, NUM_COLS / 2 - 2)) {
            this.gameOver = true;
        } else {
            this.currentPiece = this.nextPiece;
            this.pieceY = 0;
            this.pieceX = NUM_COLS / 2 - 2;
            this.nextPiece = randomPiece();
        }
    } else {
        this.pieceY += 1;
    }

    return true;
};

Tetris.prototype.steerLeft = function () {
    if (!intersects(this.rows, this.currentPiece, this.pieceY, this.pieceX - 1)) {
        this.pieceX -= 1;
    }
};

Tetris.prototype.steerRight = function () {
    if (!intersects(this.rows, this.currentPiece, this.pieceY, this.pieceX + 1)) {
        this.pieceX += 1;
    }
};

Tetris.prototype.steerDown = function () {
    if (!intersects(this.rows, this.currentPiece, this.pieceY + 1, this.pieceX)) {
        this.pieceY += 1;
    }
};

Tetris.prototype.rotate = function () {
    var newPiece = rotate(this.currentPiece);

    if (!intersects(this.rows, newPiece, this.pieceY, this.pieceX)) {
        this.currentPiece = newPiece;
    }
};

Tetris.prototype.letFall = function () {
    while (!intersects(this.rows, this.currentPiece, this.pieceY+1, this.pieceX)) {
        this.pieceY += 1;
    }
    
    this.tick();
};

Tetris.prototype.getRows = function () {
    return applyPiece(this.rows, this.currentPiece, this.pieceY, this.pieceX);
};

Tetris.prototype.getNextpiece = function () {
    return this.nextPiece;
};

Tetris.prototype.getScore = function () {
    return this.score;
};

Tetris.prototype.getGameover = function () {
    return this.gameOver;
};

function blocks(rows, numRows, numCols) {
    var boardElem = document.createElement('div');

    for (var i = 0; i < numRows; i++) {
        for (var j = 0; j < numCols; j++) {
            var blockElem = document.createElement('div');

            blockElem.classList.add('block');

            if (rows[i][j])
                blockElem.classList.add('habitated');

            blockElem.style.top = (i * BLOCK_HEIGHT) + 'px';
            blockElem.style.left = (j * BLOCK_WIDTH) + 'px';
            boardElem.appendChild(blockElem);
        }
    }
    return boardElem;
}

function startTetris(game, isPaused) {
    var leftPaneElem = tetrisLeftPane(game, isPaused);
    var rightPaneElem = tetrisRightPane(game);
    var gameElem = document.createElement('div');

    gameElem.classList.add('tetris');
    gameElem.appendChild(leftPaneElem);
    gameElem.appendChild(rightPaneElem);

    return gameElem;
}

function tetrisLeftPane(game, isPaused) {
    var scoreElem = tetrisScore(game, isPaused);
    var previewElem = tetrisPreview(game);
    var usageElem = tetrisUsage();
    var leftPaneElem = document.createElement('div');

    leftPaneElem.classList.add('leftPane');
    leftPaneElem.appendChild(previewElem);
    leftPaneElem.appendChild(scoreElem);
    leftPaneElem.appendChild(usageElem);

    return leftPaneElem;
}

function tetrisRightPane(game) {
    var boardElem = tetrisBoard(game);
    var rightPaneElem = document.createElement('div');

    rightPaneElem.classList.add('rightPane');
    rightPaneElem.appendChild(boardElem);

    return rightPaneElem;
}

function tetrisBoard(game) {
    var rows = game.getRows();
    var boardElem = blocks(rows, NUM_ROWS, NUM_COLS);

    boardElem.classList.add('board');

    return boardElem;
}

function tetrisScore(game, isPaused) {
    var score = game.getScore();
    var scoreElem = document.createElement('div');

    scoreElem.classList.add('score');
    scoreElem.innerHTML = '<p>SCORE: ' + score + '</p>';

    if (isPaused)
        scoreElem.innerHTML += '<p>PAUSED</p>';

    if (game.getGameover())
        scoreElem.innerHTML += '<p>GAME OVER</p>';

    return scoreElem;
}

function tetrisPreview(game) {
    var piece = game.getNextpiece();
    var pieceElem = blocks(piece, 4, 4);
    var previewElem = document.createElement('div');
    previewElem.classList.add('preview');
    previewElem.appendChild(pieceElem);
    return previewElem;
}

function tetrisUsage() {
    var usageElem = document.createElement('div');

    usageElem.classList.add('usage');
    usageElem.innerHTML =
        "<table>" +
        "<tr><th>Right Cursor Keys</th><td>Right Steer</td></tr>" +
        "<tr><th>Left Cursor Keys</th><td>Left Steer</td></tr>" +
        "<tr><th>Up Cursor Key</th><td>Rotate Block</td></tr>" +
        "<tr><th>Space Bar</th><td>Fall Block</td></tr>" +
        "<tr><th>Enter Key</th><td>Pause Game</td></tr>" +
        "<tr><th>R Key</th><td>ReGame</td></tr>" +
        "</table>";

    return usageElem;
}

function redraw(game, isPaused, containerElem) {
    var gameElem = startTetris(game, isPaused);

    containerElem.innerHTML = '';
    containerElem.appendChild(gameElem);
}

function run(containerElem) {
    var game = new Tetris();

    play();

    function play() {
        var intervalHandler = setInterval(
            function () {
                if (game.tick())
                    redraw(game, false, containerElem);
            },
            TICK_MS
        );

        function keyHandler(kev) {
            if (kev.shiftKey || kev.altKey || kev.metaKey)
                return;
            var consumed = true;
            var mustpause = false;

            switch (kev.keyCode) {
                case KEY_ENTER:
                    mustpause = true;
                    break;
                case KEY_R:
                    game = new Tetris();
                    break;
                case KEY_LEFT:
                    game.steerLeft();
                    break;
                case KEY_RIGHT:
                    game.steerRight();
                    break;
                case KEY_DOWN:
                    break;
                case KEY_UP:
                    game.rotate();
                    break;
                case KEY_SPACE:
                    game.letFall();
                    break;
                default:
                    consumed = false;
                    break;
            }

            if (consumed) {
                kev.preventDefault();

                if (mustpause) {
                    containerElem.removeEventListener('keydown', keyHandler);
                    clearInterval(intervalHandler);
                    pause();
                } else {
                    redraw(game, false, containerElem);
                }
            }
        }
        containerElem.addEventListener('keydown', keyHandler);
    }

    function pause() {
        function keyHandler(kev) {
            if (kev.keyCode === KEY_ENTER) {
                containerElem.removeEventListener('keydown', keyHandler);
                play();
            }
        }
        containerElem.addEventListener('keydown', keyHandler);

        redraw(game, true, containerElem);
    }
}

/**
 * @private
 */
function rotate(piece) {
    return [
        [piece[3][0], piece[2][0], piece[1][0], piece[0][0]],
        [piece[3][1], piece[2][1], piece[1][1], piece[0][1]],
        [piece[3][2], piece[2][2], piece[1][2], piece[0][2]],
        [piece[3][3], piece[2][3], piece[1][3], piece[0][3]]
    ];
}

function intersects(rows, piece, y, x) {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (piece[i][j]) {
                if (y+i >= NUM_ROWS || x+j < 0 || x+j >= NUM_COLS || rows[y+i][x+j]) {
                    return true;
                }
            }
        }
    }

    return false;
}

function applyPiece(rows, piece, y, x) {
    var newRows = [];

    for (var i = 0; i < NUM_ROWS; i++) {
        newRows[i] = rows[i].slice();
    }

    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (piece[i][j]) {
                newRows[y+i][x+j] = 1;
            }
        }
    }

    return newRows;
}

function killRows(rows) {
    var newRows = [];
    var k = NUM_ROWS;

    for (var i = NUM_ROWS; i --> 0;) {
        for (var j = 0; j < NUM_COLS; j++) {
            if (!rows[i][j]) {
                newRows[--k] = rows[i].slice();
                break;
            }
        }
    }

    for (var i = 0; i < k; i++) {
        newRows[i] = [];

        for (var j = 0; j < NUM_COLS; j++) {
            newRows[i][j] = 0;
        }

    }

    return {
        'rows': newRows,
        'numRowsKilled': k
    };
}

function randomPiece() {
    return pieces[Math.floor(Math.random() * pieces.length)];
}