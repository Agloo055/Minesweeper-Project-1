//console.log("Hello!")

// DOM VARIABLES //
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

const boardBtn = document.getElementById('makeBoard')
const boardEl = document.getElementById('board')

const beginnerBtn = document.getElementById('beginner')
const intermediateBtn = document.getElementById('intermediate')
const hardBtn = document.getElementById('hard')

const flagEl = document.getElementById('flags')
const timeEl = document.getElementById('timer')

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
        //console.log(this.gameBoard)
        let infoArea = '"'
        for (let i = 0; i < this.column; i++){
            infoArea += `info`
            if((i+1)!== this.column){
                infoArea += ` `
            }else{
                infoArea += '"'
            }
        }
        // console.log(infoArea)
        // console.log(board.style.gridTemplateAreas)
        boardEl.style.gridTemplateAreas = infoArea
        // this.constructBoardObj()
        // this.constructBoardEls()
        // console.log(this.boardTokens)
        // console.log(this.gameBoard)
    }

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
        while(this.gameBoard.length !== 0){
            this.gameBoard.pop()
        }
        while(this.boardTokens.length !== 0){
            let token = this.boardTokens.pop()
            token.squareEl.remove()
        }
    }

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

            // if(this.boardTokens[i].number >= 0){
            //     squareEl.style.backgroundColor = colors[this.boardTokens[i].number]
            // }else{
            //     squareEl.style.backgroundColor = colors[9]
            // }

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
        //console.log(this.boardTokens)
    }

    revealSquare (square) {
        if(square.classList.contains('square')){
            console.log(this.hasTimeStart)
            if(!this.hasTimeStart){
                this.startTimer()
            }
            //console.log(square)
            let gridA = square.style.gridArea.split(" / ")
            gridA = gridA.map((i) => {
                return parseInt(i)
            })
            
            let idxLoc = this.getTokenIndex(gridA[0], gridA[1])
            //console.log(idxLoc)
            //console.log(this.boardTokens[idxLoc])
            this.revealSpace(idxLoc)
        }
    }

    revealSpace (index) {
        if(!this.boardTokens[index].isRevealed && !this.boardTokens[index].isFlagged){
            this.boardTokens[index].isRevealed = true
            this.boardTokens[index].squareEl.classList.add('revealed')

            if(!this.boardTokens[index].squareEl.classList.contains('bomb')){
                this.unrevealed--
                //console.log(this.unrevealed)
            }

            this.boardTokens[index].squareEl.style.backgroundColor = colors[0]
            if(this.boardTokens[index].number > 0){
                this.boardTokens[index].squareEl.style.color = colors[this.boardTokens[index].number]
                this.boardTokens[index].squareEl.innerText = `${this.boardTokens[index].number}`
            }else if(this.boardTokens[index].number === 0){
                this.boardTokens[index].squareEl.style.color = colors[this.boardTokens[index].number]
            }else {
                this.boardTokens[index].squareEl.style.color = colors[9]
                this.boardTokens[index].squareEl.innerText = 'B'
            }
            //console.log("Revealed!")
            if(this.boardTokens[index].squareEl.classList.contains('empty')){
                this.flood(index)
            }else if(this.boardTokens[index].squareEl.classList.contains('bomb')){
                console.log('bomb!')
                this.loss = true
            }
            //console.log(this.boardTokens[index])
            this.checkGameState(index)

        }
    }

    flood (index) {
        //console.log('flood!')
        //console.log(this.boardTokens[index])
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
            //console.log(square)
            if(!elem.classList.contains('revealed')){
                let gridA = elem.style.gridArea.split(" / ")
                gridA = gridA.map((i) => {
                    return parseInt(i)
                })

                let idxLoc = this.getTokenIndex(gridA[0], gridA[1])
                //console.log(this.boardTokens)
                if(this.boardTokens[idxLoc].isFlagged){
                    this.boardTokens[idxLoc].isFlagged = false
                    //this.boardTokens[idxLoc].squareEl.style.backgroundColor = '#333333'
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

    startTimer(){
        console.log("Hi")
        this.hasTimeStart = true
        let time = this.time
        let timer = this.timer
        timer = setInterval(() => {
            // console.log(this)
            // if(this.time === NaN || ttime === undefined || this.hasTimeStart === undefined){
            //     console.log("Hello")
            //     this.time = 0
            // }
            //this.hasTimeStart = true
            //console.log(time)
            time++
            //console.log(time)
            if(time >= 1000){
                clearInterval(timer)
            }else {
                //console.log(time)
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
        console.log(this.timer)
        console.log(this.time)
    }

    checkGameState(index){
        console.log(`win: ${this.win}
        loss: ${this.loss}`)
        if(this.loss){
            this.gameOver = true
        }else if(this.unrevealed <= 0){
            this.win = true
            this.gameOver = true
        }

        if(this.gameOver){
            clearInterval(this.timer)
        }
    }
}

const sweep = new Sweeper()

// BUTTON EVENTS //
const reset = () => {
    sweep.clearBoard()
    sweep.makeBoard(sweep.row, sweep.column, sweep.bomb)
    sweep.constructBoardObj()
    sweep.constructBoardEls()
    console.log(sweep.hasTimeStart)
    //console.log(sweep.boardTokens)
}

const reveal = (e) => {
    //console.log(sweep.boardTokens[0])
    sweep.revealSquare(e.target)
    //console.log(e.target)
}

const changeBeginner = () => {
    sweep.clearBoard()
    sweep.makeBoard(9, 9, 10)
    sweep.constructBoardObj()
    sweep.constructBoardEls()
}

const changeIntermediate = () => {
    sweep.clearBoard()
    sweep.makeBoard(16, 16, 40)
    sweep.constructBoardObj()
    sweep.constructBoardEls()
}

const changeHard = () => {
    sweep.clearBoard()
    sweep.makeBoard(16, 30, 99)
    sweep.constructBoardObj()
    sweep.constructBoardEls()
}

// START //
sweep.makeBoard(9, 9, 10)
sweep.constructBoardObj()
sweep.constructBoardEls()

// DOM EVENTS //
boardBtn.addEventListener('click', reset)
boardEl.addEventListener('click', reveal)

beginnerBtn.addEventListener('click', changeBeginner)
intermediateBtn.addEventListener('click', changeIntermediate)
hardBtn.addEventListener('click', changeHard)
//boardEl.addEventListener('keydown', testFlagToggle)

//Credit to https://stackoverflow.com/questions/70840870/trigger-click-on-keypress-on-hovered-element
var positionHovered = []

document.addEventListener('mousemove', (e) => {
    positionHovered = [e.clientX, e.clientY]
})

document.addEventListener('keydown', (event) => {
    if(event.code === 'KeyX'){
        //console.log(event.code)
        let elem = document.elementFromPoint(positionHovered[0], positionHovered[1])
        sweep.toggleFlag(elem)
    }
})