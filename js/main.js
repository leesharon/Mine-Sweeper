'use strict'

// Cancels mouse right click menu pop
window.addEventListener("contextmenu", e => e.preventDefault());

const gMINE = '💣'
const gUndoActions = []
var gNebs = []
var gBoard
var gHintIntervalId

// Game Sounds
const gMineExplode = new Audio('audio/mine.mp3')
const gError = new Audio('audio/error.mp3')
const gVictory = new Audio('audio/victory.mp3')
const gSuccess = new Audio('audio/success.mp3')
const gMineSet = new Audio('audio/mine-set.mp3')

const gLevel = {
    size: 4,
    mines: 2,
    level: 'Beginner',
    lives: 1
}

var gGame = {
    isOn: false,
    isOver: false,
    shownCount: 0,
    minesExploded: 0,
    markedCount: 0,
    secsPassed: 0,
    hintCount: 3,
    isHintOn: false,
    gameFace: ['🙂', '😎', '🥺'],
    safeClicks: 3,
    userSetMines: false,
    manuallyPlacedMines: 0,
    is7Boom: false
}

function initGame() {
    gBoard = buildBoard()
    renderBoard(gBoard)
    setBestScoreDisplay()
    console.log(gBoard)
}

function buildBoard() {
    const size = gLevel.size
    const board = []
    for (var i = 0; i < size; i++) {
        const row = []
        for (var j = 0; j < size; j++) {
            const cell = {
                minesAroundCount: 4,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            row.push(cell)
        }
        board.push(row)
    }
    return board
}

function renderBoard(board) {
    var strHtml = '';
    for (var i = 0; i < board.length; i++) {
        strHtml += '<tr>';
        for (var j = 0; j < board[i].length; j++) {
            var cell = board[i][j]
            let tdContent = ''

            if (cell.isShown === true) {
                if (cell.isMine === true) tdContent = gMINE
                else if (cell.minesAroundCount === 0) tdContent = ''
                else tdContent = cell.minesAroundCount
            }

            // Figure class name
            var className = cell.isShown ? 'shown' : 'hidden'
            if (className === 'shown' && cell.isMine === true) className = 'mine'

            var tdId = `cell-${i}-${j}`
            strHtml += `<td id="${tdId}" onmousedown="cellClicked(this, ${i}, ${j}, event)" class="cell ${className}">${tdContent}</td>`;
        }
        strHtml += '</tr>';
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHtml;
}

function isGameWin() {
    // returns if not enough mines marked or not enough cells shown
    if (gGame.isMarked + gGame.minesExploded < gLevel.mines || gGame.shownCount !== ((gLevel.size ** 2) - gLevel.mines)) return
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var cell = gBoard[i][j]
            if (cell.isMine === true && cell.isMarked === false && cell.isShown === false) return
        }
    }

    // in case on win:
    stopTimer()
    gGame.isOn = false
    gGame.isOver = true

    // Sets the best score on the local storage
    var score = document.querySelector('.timerDisplay').innerText
    var scoreNum = +score.replace(':', '')

    // checks if any score was stored already or not
    if (localStorage.getItem(`best${gLevel.level}Score`)) {
        var bestScore = +localStorage.getItem(`best${gLevel.level}Score`).replace(':', '')
        if (scoreNum < bestScore) {
            localStorage.setItem(`best${gLevel.level}Score`, score)
        }
    } else {
        localStorage.setItem(`best${gLevel.level}Score`, score)
    }

    gVictory.play()
    revealMines()

    document.querySelector('span.smiley').innerText = gGame.gameFace[1]
    return true
}

function onGameOver() {
    stopTimer()
    gGame.isOn = false
    gGame.isOver = true
    revealMines()
    document.querySelector('span.smiley').innerText = gGame.gameFace[2]
}

function classListChange(elCell) {
    if (elCell.classList.contains('hidden')) {
        elCell.classList.remove('hidden')
        elCell.classList.add('shown')
    } else {
        elCell.classList.add('hidden')
        elCell.classList.remove('shown')
    }
}

function restartGame(elSmiley) {
    if (elSmiley) elSmiley.innerHTML = gGame.gameFace[0]
    else {
        document.querySelector('.smiley').innerHTML = gGame.gameFace[0]
    }
    gLevel.lives = (gLevel.level === 'Beginner') ? 1 : 3
    gGame.isOn = false
    gGame.isOver = false
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.minesExploded = 0
    gGame.hintCount = 3
    gGame.isHintOn = false
    gGame.is7Boom = false
    document.querySelector('.safe-click-span').innerText = `3 Clicks Available`
    gGame.safeClicks = 3
    document.querySelector('div.hint').style.backgroundColor = 'red'
    var lives = '❤️'.repeat(gLevel.lives)
    document.querySelector('span.lives').innerText = `Lives Left: ${lives}`
    document.querySelector('.btn-7boom').innerText = '7 BOOM Mode'
    stopTimer()
    resetTimer()
    initGame()
}

function setBestScoreDisplay() {
    var bestScore = localStorage.getItem(`best${gLevel.level}Score`)
    var elScoreSpan = document.querySelector('.best-score')
    if (!bestScore) elScoreSpan.innerText = 'Best Score:'
    else elScoreSpan.innerText = `Best Score: ${bestScore}`
}