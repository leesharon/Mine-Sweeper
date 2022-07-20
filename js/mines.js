'use strict'

//Count mines around each cell and set the cell's minesAroundCount.
function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var negsCount = countNeighbors(i, j, board)
            board[i][j].minesAroundCount = negsCount
        }
    }
}

// Set mines at random locations 
function placeRandomMines(count, i, j) {
    for (var c = 0; c < count; c++) {
        var cell = getRandomEmptyCell(gBoard)
        while (cell.i === i && cell.j === j) cell = getRandomEmptyCell(gBoard)
        gBoard[cell.i][cell.j].isMine = true
    }
}

function expandShown(board, elCell, i, j) {
    var nebs = getAllNeighbors(i, j, gBoard)
    for (var i = 0; i < nebs.length; i++) {
        var cell = nebs[i]
        if (board[cell.i][cell.j].isShown === false) {

            // if hint mode is on model shouldn't be changed
            if (!gGame.isHintOn) {
                gGame.shownCount++
                board[cell.i][cell.j].isShown = true
            }
            let elCell = document.querySelector(`#cell-${cell.i}-${cell.j}`)
            elCell.innerText = (board[cell.i][cell.j].minesAroundCount === 0) ? '' : board[cell.i][cell.j].minesAroundCount

            classListChange(elCell)

            hintModeTimeOut(elCell)
        }
    }
}

function revealMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var cell = gBoard[i][j]
            if (cell.isMine === true) cell.isShown = true
        }
    }
    renderBoard(gBoard)
}