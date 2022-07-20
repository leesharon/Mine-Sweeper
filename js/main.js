'use strict'

// Cancels mouse right click menu pop
window.addEventListener("contextmenu", e => e.preventDefault());

const gMINE = '💣'
var gBoard

const gMineExplode = new Audio('audio/mine.mp3')
const gError = new Audio('audio/error.mp3')
const gVictory = new Audio('audio/victory.mp3')

const gLevel = {
    size: 4,
    mines: 2,
    level: 'Beginner',
    lives: 1
}

const gGame = {
    isOn: false,
    isOver: false,
    shownCount: 0,
    minesExploded: 0,
    markedCount: 0,
    secsPassed: 0,
    hintCount: 3,
    isHintOn: false,
    gameFace: ['🙂', '😎', '🥺']
}

function initGame() {
    gBoard = buildBoard()
    renderBoard(gBoard)
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

    console.log('You win!!');

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

// changes level difficulty by pressing the button
function changeLevel(elBtn) {
    switch (gLevel.level) {
        case 'Beginner':
            gLevel.level = 'Intermediate'
            gLevel.mines = 12
            gLevel.size = 8
            gLevel.lives = 3
            document.querySelector('span.lives').innerText = `🧡 Left: ${gLevel.lives}`
            break
        case 'Intermediate':
            gLevel.level = 'Professional'
            gLevel.mines = 30
            gLevel.size = 12
            break
        case 'Professional':
            gLevel.level = 'Beginner'
            gLevel.mines = 2
            gLevel.size = 4
            gLevel.lives = 1
            document.querySelector('span.lives').innerText = `🧡 Left: ${gLevel.lives}`
            break
    }

    restartGame()
    elBtn.innerHTML = gLevel.level
}

function classListChange(elCell) {
    elCell.classList.remove('hidden')
    elCell.classList.add('shown')
}

function restartGame(elSmiley) {
    if (elSmiley) elSmiley.innerHTML = gGame.gameFace[0]
    gLevel.lives = (gLevel.level === 'Beginner') ? 1 : 3
    gGame.isOn = false
    gGame.isOver = false
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.minesExploded = 0
    gGame.hintCount = 3
    stopTimer()
    resetTimer()
    initGame()
}

function activateHint(elBtn) {
    if (gGame.hintCount === 0) {
        gError.play()
        return
    }
    gGame.hintCount--
    gGame.isHintOn = true
    elBtn.querySelector('div').style.backgroundColor = 'green'

}