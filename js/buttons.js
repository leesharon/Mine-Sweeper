'use strict'

function activateHint(elBtn) {
    if (gGame.hintCount === 0) {
        gError.play()
        return
    }
    gGame.hintCount--
    gGame.isHintOn = true
    elBtn.querySelector('div').style.backgroundColor = 'green'
}

function hintModeTimeOut(elCell) {
    // Hint mode
    if (gGame.isHintOn) {
        gHintIntervalId = setTimeout(() => {
            elCell.innerHTML = ''
            elCell.classList.remove('shown')
            elCell.classList.add('hidden')
        }, 1300)
    }
    setTimeout(() => {
        gHintIntervalId = null
    }, 1300);
}

// changes level difficulty by pressing the button
function changeLevel(elBtn) {
    var lives = '❤️'.repeat(gLevel.lives)
    switch (gLevel.level) {
        case 'Beginner':
            gLevel.level = 'Intermediate'
            gLevel.mines = 12
            gLevel.size = 8
            gLevel.lives = 3
            document.querySelector('span.lives').innerText = `Lives Left: ${lives}`
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
            document.querySelector('span.lives').innerText = `Lives Left: ${lives}`
            break
    }

    restartGame()
    elBtn.innerHTML = gLevel.level
}

// indicates a safe cell for the user to click
function activateSafeClick(elBtn) {
    if (gGame.safeClicks === 0) {
        gError.play()
        return
    }

    var cell = getRandomEmptyCell(gBoard)
    var elCell = document.querySelector(`#cell-${cell.i}-${cell.j}`)
    elCell.classList.add('safe-click-target')
    elCell.classList.remove('hidden')
    setTimeout(() => {
        elCell.classList.remove('safe-click-target')
        elCell.classList.add('hidden')
    }, 1300)
    gGame.safeClicks--
    document.querySelector('.safe-click-span').innerText = `${gGame.safeClicks} Clicks Available`
}

function activateMinesMode() {
    if (gGame.isOn === true || gGame.isOver === true) {
        gError.play()
        return
    }
    gGame.userSetMines = true
    gMineSet.play()
    var elMineCount = document.querySelector('.mines-set')
    elMineCount.innerText = `Mines to Set: ${gLevel.mines - gGame.manuallyPlacedMines}`
    elMineCount.style.display = 'inline'
}

function undo() {

    if (gGame.isOver === true) return

    var poppedAction = gUndoActions.pop()
    var elCell = document.querySelector(`#cell-${poppedAction.i}-${poppedAction.j}`)

    // Undo mine case
    if (poppedAction.isMine === true) {
        gGame.minesExploded--
        gLevel.lives++

        elCell.innerText = ''
        elCell.classList.remove('mine')

        var lives = '❤️'.repeat(gLevel.lives)
        document.querySelector('span.lives').innerText = `Lives Left: ${lives}`

        // handles fullExpand case with array of objects
    } else if ((Object.prototype.toString.call(poppedAction) === '[object Array]')) {

        // Includes the clicked cell 
        poppedAction.push(gUndoActions.pop())

        for (let i = 0; i < poppedAction.length; i++) {
            let cellIdx = poppedAction[i]
            let cell = gBoard[cellIdx.i][cellIdx.j]
            var elCell = document.querySelector(`#cell-${cellIdx.i}-${cellIdx.j}`)

            gGame.shownCount--
            cell.isShown = false

            elCell.innerText = ''
            classListChange(elCell)
        }

    } else { // Undo single empty cell case
        gBoard[poppedAction.i][poppedAction.j] = poppedAction
        classListChange(elCell)
        elCell.innerText = ''
    }
}

function activate7Boom(elBtn) {
    if (gGame.isOn || gGame.isOver) return
    gGame.is7Boom = true
    elBtn.innerText = '7 BOOM💥 Mode'

}