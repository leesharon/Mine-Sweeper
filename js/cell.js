'use strict'

function cellClicked(elCell, i, j, ev) {
    // returns if game is over
    if (gGame.isOver) return

    // if this is first click starts timer
    if (!gGame.isOn) {
        startTimer()
        placeRandomMines(gLevel.mines, i, j)
        setMinesNegsCount(gBoard)
        gGame.isOn = true
    }

    const cell = gBoard[i][j]

    if (cell.isShown === true) return

    // handles right clicks
    if (ev.which === 3) {
        cellMarked(elCell, cell)
        return
    }

    // handles left clicks
    if (ev.which === 1) {

        // Hint Mode
        if (gGame.isHintOn === true) {
            expandShown(gBoard, elCell, i, j)
            emptyCellClicked(elCell, cell)
            gGame.isHintOn = false
            document.querySelector('div.hint').style.backgroundColor = 'red'
            return
        }

        // if cell is flagged returns
        if (cell.isMarked === true) return

        // empty cells clicks
        if (cell.isMine === false && cell.isShown === false) {
            cell.isShown = true
            if (cell.minesAroundCount === 0) {
                // elCell.innerHTML = ' '
                expandShown(gBoard, elCell, i, j)
                emptyCellClicked(elCell, cell)
            } else {
                emptyCellClicked(elCell, cell)
            }
            isGameWin()
            return
        }

        // Mines clicks
        if (cell.isMine === true) {
            gMineExplode.play()
            gGame.minesExploded++
            gLevel.lives--
            cell.isShown = true
            elCell.innerText = gMINE
            elCell.classList.add('mine')
            if (gLevel.lives === -1) {
                onGameOver()
                return
            }
            document.querySelector('span.lives').innerText = `🧡 Left: ${gLevel.lives}`
        }

    }
}

function cellMarked(elCell, cell) {
    if (cell.isMarked === false) {
        if (gGame.markedCount === gLevel.mines) {
            gError.play()
            return
        }
        cell.isMarked = true
        elCell.innerHTML = '🏴‍☠️'
        gGame.markedCount++
    } else {
        cell.isMarked = false
        elCell.innerHTML = ''
        gGame.markedCount--
    }
    isGameWin()
}

function emptyCellClicked(elCell, cell) {
    if (!gGame.isHintOn) gGame.shownCount++
    elCell.innerText = (cell.minesAroundCount === 0) ? '' : cell.minesAroundCount
    classListChange(elCell)

    // Hint mode
    hintModeTimeOut(elCell)
}

function hintModeTimeOut(elCell) {
    // Hint mode
    if (gGame.isHintOn) {
        setTimeout(() => {
            elCell.innerHTML = ''
            elCell.classList.remove('shown')
            elCell.classList.add('hidden')
        }, 1300)
    }
}