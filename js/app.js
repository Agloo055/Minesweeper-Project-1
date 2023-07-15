//console.log("Hello!")

// COLORS for RADAR //
const colors = [
    'gray',
    'blue',
    'green',
    'purple',
    'black',
    'teal',
    'brown',
    'darkblue',
    'orange',
    'red'
]

// DOM VARIABLES //
const boardBtn = document.getElementById('makeBoard')
const boardEl = document.getElementById('board')

const beginnerBtn = document.getElementById('beginner')
const intermediateBtn = document.getElementById('intermediate')
const hardBtn = document.getElementById('hard')

const flagEl = document.getElementById('flags')
const timeEl = document.getElementById('timer')

const resultsEl = document.getElementById('results')

const toggleRulesBtn  = document.getElementById('toggleRules')
const toggleControlsBtn  = document.getElementById('toggleControls')

const rulesEl = document.getElementById('intructions')
const controlsEl = document.getElementById('controls')

// Sweeper CLASS //
class Sweeper {
    constructor(row=3,column=3,bomb=1) {
        this.row = row
        this.column = column
        this.bomb = bomb
        this.flag = bomb
        this.unrevealed = 0

        this.timer = 0
        this.time = 0
        this.hasTimeStart = false

        this.gameBoard = []
        this.boardTokens = []

        this.win = false
        this.loss = false
        this.gameOver = false
    }

    // MAKE BOARD //
    makeBoard (rowNum, columnNum, bombNum) {
        this.clearBoard()

        this.row = rowNum
        this.column = columnNum
        this.bomb = bombNum
        this.flag = bombNum
        this.unrevealed = (this.row * this.column) - this.bomb

        this.updateFlagCount()

        for(let i = 0; i < this.row; i++){
            const rows = []
            for(let j = 0; j < this.column; j++){
                rows.push(0)
            }
            this.gameBoard.push(rows)
        }
        let hasPlaced = false
        let rRow
        let rColumn

        for (let i = 1; i <= this.bomb; i++){
            hasPlaced = false
            while(!hasPlaced){
                rRow = Math.floor(Math.random()* this.row)
                rColumn = Math.floor(Math.random()* this.column)
                if(this.gameBoard[rRow][rColumn] !== -1){
                    hasPlaced = true
                    this.gameBoard[rRow][rColumn] = -1
                    this.updateRadars(rRow, rColumn)
                }
            }
        }    
    }

    // CLEAR BOARD //
    clearBoard () {
        this.time = 0
        timeEl.innerText = '000'
        if(this.hasTimeStart){
            clearInterval(this.timer)
        }
        this.hasTimeStart = false
        this.loss = false
        this.win = false
        this.gameOver = false

        resultsEl.innerText = ''
        resultsEl.classList.add('is-hidden')

        while(this.gameBoard.length !== 0){
            this.gameBoard.pop()
        }
        while(this.boardTokens.length !== 0){
            let token = this.boardTokens.pop()
            token.squareEl.remove()
        }
    }

    // PLACING RADAR NUMBERS //
    updateRadars (bRow, bColumn) {
        if((bRow - 1) >= 0){
            this.updateRadar(bRow - 1, bColumn)
        }
        if((bRow - 1) >= 0 && (bColumn - 1) >= 0){
            this.updateRadar(bRow - 1, bColumn - 1)
        }
        if((bRow - 1) >= 0 && (bColumn + 1) < this.column){
            this.updateRadar(bRow - 1, bColumn + 1)
        }
        if((bRow + 1) < this.row){
            this.updateRadar(bRow + 1, bColumn)
        }
        if((bRow + 1) < this.row && (bColumn - 1) >= 0){
            this.updateRadar(bRow + 1, bColumn - 1)
        }
        if((bRow + 1) < this.row && (bColumn + 1) < this.column){
            this.updateRadar(bRow + 1, bColumn + 1)
        }
        if((bColumn - 1) >= 0){
            this.updateRadar(bRow, bColumn - 1)
        }
        if((bColumn + 1) < this.column){
            this.updateRadar(bRow, bColumn + 1)
        }
    }

    updateRadar (radarRow, radarColumn) {
        if(this.gameBoard[radarRow][radarColumn] !== -1){
            this.gameBoard[radarRow][radarColumn]++
        }
    }

    // CREATING SEARCHABLE BOARD ELEMENTS //
    constructBoardObj () {
        for(let i = 0; i < this.row; i++){
            for(let j = 0; j < this.column; j++){
                const boardPiece = {}

                boardPiece.rowStart = i + 2
                boardPiece.colStart = j + 1
                boardPiece.rowEnd = i + 3
                boardPiece.colEnd = j + 2

                boardPiece.number = this.gameBoard[i][j]

                if(boardPiece.number === -1){
                    boardPiece.isBomb = true
                }else{
                    boardPiece.isBomb = false
                }

                if(boardPiece.number === 0){
                    boardPiece.isEmpty = true
                }else{
                    boardPiece.isEmpty = false
                }

                boardPiece.isRevealed = false
                boardPiece.isFlagged = false

                this.boardTokens.push(boardPiece)
            }
        }
    }

    constructBoardEls(){
        for(let i = 0; i < this.boardTokens.length; i++){

            const squareEl = document.createElement('div')

            squareEl.style.backgroundColor = '#333333'
            squareEl.style.fontFamily = "'Caprasimo', cursive"
            squareEl.style.fontSize = '40px'
            squareEl.style.textAlign = 'center'
            
            squareEl.style.gridColumn = `${this.boardTokens[i].colStart} / ${this.boardTokens[i].colEnd}`
            squareEl.style.gridRow = `${this.boardTokens[i].rowStart} / ${this.boardTokens[i].rowEnd}`

            squareEl.classList.add('square')

            if(this.boardTokens[i].isBomb){
                squareEl.classList.add('bomb')
            }else if (this.boardTokens[i].isEmpty){
                squareEl.classList.add('empty')
            }

            this.boardTokens[i].squareEl = squareEl
            boardEl.appendChild(squareEl)
        }
    }

    // EXTENDING INFO BAR
    makeInfo () {
        let infoArea = '"'
        for (let i = 0; i < this.column; i++){
            infoArea += `info`
            if((i+1)!== this.column){
                infoArea += ` `
            }else{
                infoArea += '"'
            }
        }

        boardEl.style.gridTemplateAreas = infoArea
    }

    // REVEAL SQUARE FUNCTIONALITIES //
    revealSquare (square) {
        if(square.classList.contains('square') && !this.gameOver){
            if(!this.hasTimeStart){
                this.startTimer()
            }
            let gridA = square.style.gridArea.split(" / ")
            gridA = gridA.map((i) => {
                return parseInt(i)
            })
            
            let idxLoc = this.getTokenIndex(gridA[0], gridA[1])
            this.revealSpace(idxLoc)
        }
    }

    revealSpace (index) {
        if(!this.boardTokens[index].isRevealed && !this.boardTokens[index].isFlagged){
            this.boardTokens[index].isRevealed = true
            this.boardTokens[index].squareEl.classList.add('revealed')

            if(!this.boardTokens[index].squareEl.classList.contains('bomb')){
                this.unrevealed--
            }

            this.boardTokens[index].squareEl.style.backgroundColor = colors[0]
            if(this.boardTokens[index].number > 0){
                this.boardTokens[index].squareEl.style.color = colors[this.boardTokens[index].number]
                this.boardTokens[index].squareEl.innerText = `${this.boardTokens[index].number}`
            }else if(this.boardTokens[index].number === 0){
                this.boardTokens[index].squareEl.style.color = colors[this.boardTokens[index].number]
            }
            if(this.boardTokens[index].squareEl.classList.contains('empty')){
                this.flood(index)
            }else if(this.boardTokens[index].squareEl.classList.contains('bomb')){
                this.loss = true
            }
            this.checkGameState(index)

        }
    }

    flood (index) {
        let tIndex = 0
        if((this.boardTokens[index].rowStart - 1) >= 2){
            tIndex = this.getTokenIndex(this.boardTokens[index].rowStart - 1, this.boardTokens[index].colStart)
            this.revealSpace(tIndex)
        }
        if((this.boardTokens[index].rowStart - 1) >= 2 && (this.boardTokens[index].colStart - 1) >= 1){
            tIndex = this.getTokenIndex(this.boardTokens[index].rowStart - 1, this.boardTokens[index].colStart - 1)
            this.revealSpace(tIndex)
        }
        if((this.boardTokens[index].rowStart - 1) >= 2 && (this.boardTokens[index].colStart + 1) < (this.column + 1)){
            tIndex = this.getTokenIndex(this.boardTokens[index].rowStart - 1, this.boardTokens[index].colStart + 1)
            this.revealSpace(tIndex)
        }
        if((this.boardTokens[index].rowStart + 1) < this.row + 2){
            tIndex = this.getTokenIndex(this.boardTokens[index].rowStart + 1, this.boardTokens[index].colStart)
            this.revealSpace(tIndex)
        }
        if((this.boardTokens[index].rowStart + 1) < this.row + 2 && (this.boardTokens[index].colStart - 1) >= 1){
            tIndex = this.getTokenIndex(this.boardTokens[index].rowStart + 1, this.boardTokens[index].colStart - 1)
            this.revealSpace(tIndex)
        }
        if((this.boardTokens[index].rowStart + 1) < this.row + 2 && (this.boardTokens[index].colStart + 1) < (this.column + 1)){
            tIndex = this.getTokenIndex(this.boardTokens[index].rowStart + 1, this.boardTokens[index].colStart + 1)
            this.revealSpace(tIndex)
        }
        if((this.boardTokens[index].colStart - 1) >= 1){
            tIndex = this.getTokenIndex(this.boardTokens[index].rowStart, this.boardTokens[index].colStart - 1)
            this.revealSpace(tIndex)
        }
        if((this.boardTokens[index].colStart + 1) < (this.column + 1)){
            tIndex = this.getTokenIndex(this.boardTokens[index].rowStart, this.boardTokens[index].colStart + 1)
            this.revealSpace(tIndex)
        }
    }

    // SEARCH FOR INDEX OF BOARD ELEMENT //
    getTokenIndex (rowStart, colStart){
        let index = 0
        this.boardTokens.forEach((elem, idx) => {
            if(elem.rowStart === rowStart && elem.colStart === colStart){    
                index = idx
                return
            }
        })
        return index
    }

    // FLAG FUNCTIONALITIES //
    updateFlagCount () {
        let flagNum = ''
        if(this.flag < 10) {
            flagNum += '00'
        }else if(this.flag < 100){
            flagNum += '0'
        }
        flagNum += this.flag
        flagEl.innerText = flagNum
    }

    toggleFlag (elem) {
        if(elem.classList.contains('square')){
            if(!elem.classList.contains('revealed')){
                let gridA = elem.style.gridArea.split(" / ")
                gridA = gridA.map((i) => {
                    return parseInt(i)
                })

                let idxLoc = this.getTokenIndex(gridA[0], gridA[1])
                if(this.boardTokens[idxLoc].isFlagged){
                    this.boardTokens[idxLoc].isFlagged = false
                    this.boardTokens[idxLoc].squareEl.innerText = ''
                    this.flag++
                    this.updateFlagCount()
                }else if (this.flag > 0){
                    this.boardTokens[idxLoc].isFlagged = true
                    this.boardTokens[idxLoc].squareEl.style.color = 'blueviolet'
                    this.boardTokens[idxLoc].squareEl.innerText = 'F'
                    this.flag--
                    this.updateFlagCount()
                }
            }
        }
    }

    // START TIMER //
    startTimer(){
        this.hasTimeStart = true
        let time = this.time
        let timer = this.timer
        timer = setInterval(() => {
            time++
            if(time >= 1000){
                clearInterval(timer)
            }else {
                let timeNum = ''
                if(time < 10) {
                    timeNum += '00'
                }else if(time < 100){
                    timeNum += '0'
                }
                timeNum += time
                timeEl.innerText = timeNum
            }
        }, 1000)
        this.timer = timer
    }
    
    // GAME STATE CHECKER //
    checkGameState(index){
        if(this.loss){
            this.gameOver = true
        }else if(this.unrevealed <= 0){
            this.win = true
            this.gameOver = true
        }

        if(this.gameOver){
            clearInterval(this.timer)
            let timeNum = parseInt(timeEl.innerText)

            if(this.win){
                for(let i = 0; i < this.boardTokens.length; i++){
                    if(!this.boardTokens[i].squareEl.classList.contains('revealed') && !this.boardTokens[i].isFlagged){
                        this.toggleFlag(this.boardTokens[i].squareEl)
                    }
                }
                resultsEl.classList.remove('is-hidden')
                resultsEl.innerText = `Congrats! You completed the board in ${timeNum} seconds!`
            
            }else if(this.loss){
                for(let i = 0; i < this.boardTokens.length; i++){
                    if(i === index){
                        this.boardTokens[i].squareEl.style.backgroundColor = colors[9]
                        this.boardTokens[i].squareEl.style.color = 'black'
                        this.boardTokens[i].squareEl.innerText = 'B'
                    } else if(this.boardTokens[i].isBomb && !this.boardTokens[i].isFlagged){
                        this.boardTokens[i].squareEl.style.backgroundColor = colors[0]
                        this.boardTokens[i].squareEl.style.color = colors[9]
                        this.boardTokens[i].squareEl.innerText = 'B'
                    } else if(this.boardTokens[i].isFlagged && !this.boardTokens[i].isBomb){
                        this.boardTokens[i].squareEl.style.backgroundColor = 'darkred'
                        this.boardTokens[i].squareEl.style.color = 'black'
                    }
                }
                resultsEl.classList.remove('is-hidden')
                resultsEl.innerText = `Too bad!`
            }
        }
    }
}

const sweep = new Sweeper()

// BUTTON EVENTS //
const reset = () => {
    sweep.makeBoard(sweep.row, sweep.column, sweep.bomb)
    sweep.makeInfo()
    sweep.constructBoardObj()
    sweep.constructBoardEls()
}

const reveal = (e) => {
    sweep.revealSquare(e.target)
}

const changeBeginner = () => {
    sweep.makeBoard(9, 9, 10)
    sweep.makeInfo()
    sweep.constructBoardObj()
    sweep.constructBoardEls()
}

const changeIntermediate = () => {
    sweep.makeBoard(16, 16, 40)
    sweep.makeInfo()
    sweep.constructBoardObj()
    sweep.constructBoardEls()
}

const changeHard = () => {
    sweep.makeBoard(16, 30, 99)
    sweep.makeInfo()
    sweep.constructBoardObj()
    sweep.constructBoardEls()
}

const toggleRules = () => {
    if(rulesEl.classList.contains('is-hidden')){
        if(!controlsEl.classList.contains('is-hidden')){
            controlsEl.classList.add('is-hidden')
        }
        rulesEl.classList.remove('is-hidden')
    }else{
        rulesEl.classList.add('is-hidden')
    }
}

const toggleControls = () => {
    if(controlsEl.classList.contains('is-hidden')){
        if(!rulesEl.classList.contains('is-hidden')){
            rulesEl.classList.add('is-hidden')
        }
        controlsEl.classList.remove('is-hidden')
    }else{
        controlsEl.classList.add('is-hidden')
    }
}

// START //
sweep.makeBoard(9, 9, 10)
sweep.makeInfo()
sweep.constructBoardObj()
sweep.constructBoardEls()

// DOM EVENTS //
boardBtn.addEventListener('click', reset)
boardEl.addEventListener('click', reveal)

beginnerBtn.addEventListener('click', changeBeginner)
intermediateBtn.addEventListener('click', changeIntermediate)
hardBtn.addEventListener('click', changeHard)

toggleRulesBtn.addEventListener('click', toggleRules)
toggleControlsBtn.addEventListener('click', toggleControls)

//Credit to https://stackoverflow.com/questions/70840870/trigger-click-on-keypress-on-hovered-element
var positionHovered = []

document.addEventListener('mousemove', (e) => {
    positionHovered = [e.clientX, e.clientY]
})

document.addEventListener('keydown', (event) => {
    if(event.code === 'KeyX'){
        let elem = document.elementFromPoint(positionHovered[0], positionHovered[1])
        if(!sweep.gameOver){
            sweep.toggleFlag(elem)
        }
    }
})