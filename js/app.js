console.log("Hello!")

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
const revealBtn = document.getElementById('reveal')

// Sweeper CLASS //
class Sweeper {
    constructor(row=3,column=3,bomb=1) {
        this.row = row
        this.column = column
        this.bomb = bomb
        this.gameBoard = []
        this.boardTokens = []
        this.win = false
        this.loss = false
        this.gameOver = false
    }

    makeBoard (rowNum, columnNum, bombNum) {
        this.row = rowNum
        this.column = columnNum
        this.bomb = bombNum

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
        while(this.gameBoard.length !== 0){
            this.gameBoard.pop()
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
            //console.log(square)
            let gridA = square.style.gridArea.split(" / ")
            gridA = gridA.map((i) => {
                return parseInt(i)
            })
            
            let idxLoc = 0
            this.boardTokens.forEach((elem, idx) => {
                if(elem.rowStart === gridA[0] && elem.colStart === gridA[1] && elem.rowEnd === gridA[2] && elem.colEnd === gridA[3]){
                    idxLoc = idx
                    return
                }
            })
            if(!this.boardTokens[idxLoc].isRevealed)
            {
                //console.log(this.boardTokens[idxLoc])
                this.revealSpace(idxLoc)
            }
        }
    }

    revealSpace (index) {
        this.boardTokens[index].isRevealed = true
        if(this.boardTokens[index].number >= 0){
            this.boardTokens[index].squareEl.style.backgroundColor = colors[this.boardTokens[index].number]
        }else{
            this.boardTokens[index].squareEl.style.backgroundColor = colors[9]
        }
        console.log("Revealed!")
        if(this.boardTokens[index].squareEl.classList.contains('empty')){
            this.flood(index)
        }else if(this.boardTokens[index].squareEl.classList.contains('bomb')){
            console.log('bomb!')
        }
    }

    flood (index) {
        console.log('flood!')
    }
}

const sweep = new Sweeper()

// Tests //
const testBoard = () => {
    sweep.clearBoard()
    sweep.makeBoard(9,9,10)
    sweep.constructBoardObj()
    sweep.constructBoardEls()
    //console.log(sweep.boardTokens)
}

const testReveal = (e) => {
    //console.log(sweep.boardTokens[0])
    sweep.revealSquare(e.target)
    //console.log(e.target)

}

// DOM EVENTS //
boardBtn.addEventListener('click', testBoard)
boardEl.addEventListener('click', testReveal)