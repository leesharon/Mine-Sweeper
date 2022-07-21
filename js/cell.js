'use strict'

function cellClicked(elCell, i, j, ev) {
    // returns if game is over
    if (gGame.isOver) return

    // makes sure the user doesn't mess with the model while showing hint
    if (gHintIntervalId) return

    const cell = gBoard[i][j]
    cell.i = i
    cell.j = j

    // On first click
    if (!gGame.isOn) {

        // checks if user wants to set his own mines
        if (gGame.userSetMines === true) {
            gMineSet.play()
            cell.isMine = true
            gGame.manuallyPlacedMines++

            var elMineCount = document.querySelector('.mines-set')
            elMineCount.innerText = `Mines to Set: ${gLevel.mines - gGame.manuallyPlacedMines}`

            if (gGame.manuallyPlacedMines === gLevel.mines) {
                elMineCount.style.display = 'none'
                gGame.userSetMines = false
                gGame.manuallyPlacedMines = 0
                startTimer()
                setMinesNegsCount(gBoard)
                gGame.isOn = true
                return
            } else return

            // sets mines for 7 boom mode
        } else if (gGame.is7Boom === true) {
            place7BoomMines()
            
        } else {
            placeRandomMines(gLevel.mines, i, j)
        }

        startTimer()
        setMinesNegsCount(gBoard)
        gGame.isOn = true
    }

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
            gSuccess.play()

            // pushes to undo array of objects
            var cellCopy = JSON.parse(JSON.stringify(cell))
            gUndoActions.push(cellCopy)
            ////////////////////////////////////////////

            cell.isShown = true
            
            if (cell.minesAroundCount === 0) {
                fullExpandShown(gBoard, elCell, i, j)
                
                // for Undo 
                gUndoActions.push(gNebs)
                ////////////////////////////////////////////
                
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

            // pushes to undo array of objects
            var cellCopy = JSON.parse(JSON.stringify(cell))
            gUndoActions.push(cellCopy)
            ////////////////////////////////////////////

            gGame.minesExploded++
            gLevel.lives--
            cell.isShown = true

            elCell.innerText = gMINE
            elCell.classList.add('mine')

            var lives = '❤️'.repeat(gLevel.lives)
            document.querySelector('span.lives').innerText = `Lives Left: ${lives}`

            if (gLevel.lives === 0) {
                onGameOver()
                return
            }
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
    elCell.innerText = (cell.minesAroundCount === 0) ? '' : cell.minesAroundCount
    if (!gGame.isHintOn) gGame.shownCount++
    else if (cell.isMine === true) elCell.innerText = gMINE
    classListChange(elCell)

    // Hint mode
    hintModeTimeOut(elCell)
}