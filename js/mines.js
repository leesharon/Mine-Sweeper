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
    for (var c = 0; c < nebs.length; c++) {
        var cell = nebs[c]
        var i = cell.i
        var j = cell.j
        if (board[i][j].isShown === false) {
            let elCell = document.querySelector(`#cell-${i}-${j}`)

            // if hint mode is on model shouldn't be changed
            if (!gGame.isHintOn) {
                gGame.shownCount++
                board[i][j].isShown = true
            }

            if (board[i][j].isMine === true) {
                elCell.innerText = gMINE
            } else {
                elCell.innerText = (board[i][j].minesAroundCount === 0) ? '' : board[i][j].minesAroundCount
            }


            classListChange(elCell)

            hintModeTimeOut(elCell)
        }
    }
}
function fullExpandShown(board, elCell, i, j) {

    // gets an array of all neighbors
    var nebs = getAllNeighbors(i, j, gBoard)

    for (var c = 0; c < nebs.length; c++) {
        var cell = nebs[c]
        var i = cell.i
        var j = cell.j

        // assures the cell is not show already
        if (board[i][j].isShown === false) {
            let elCell = document.querySelector(`#cell-${i}-${j}`)

            // for Undo 
            gNebs.push(cell)
            ////////////////////////////////////////////

            gGame.shownCount++
            board[i][j].isShown = true
            // Mines case
            if (board[i][j].isMine === true) {
                elCell.innerText = gMINE

                // Zero mines around neighbor recursion case
            } else if (board[i][j].minesAroundCount === 0) {
                elCell.innerText = ''
                fullExpandShown(gBoard, elCell, i, j)

            } else { // empty cell with mines neighbors case
                elCell.innerText = board[i][j].minesAroundCount
            }
            classListChange(elCell)
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

function place7BoomMines() {
    var count = 0
    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {
            let countStr = count + ''

            if ((count % 7 === 0 && count > 0) || countStr.includes('7')) {
                let cell = gBoard[i][j]
                cell.isMine = true
            }
            count++
        }
    }
}