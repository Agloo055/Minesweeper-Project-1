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
const board = document.getElementById('board')


// Sweeper CLASS //
class Sweeper {
    constructor(row=0,column=0,bomb=0) {
        this.row = row
        this.column = column
        this.bomb = bomb
        this.gameBoard = []
        this.boardTokens = []
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
        console.log(this.gameBoard)
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
                boardPiece.rowEnd = i + 3
                boardPiece.colStart = j + 1
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

                this.boardTokens.push(boardPiece)
            }
        }
    }

    constructBoardEls(){
        for(let i = 0; i < this.boardTokens.length; i++){

            const squareEl = document.createElement('div')

            if(this.boardTokens[i].number >= 0){
                squareEl.style.backgroundColor = colors[this.boardTokens[i].number]
            }else{
                squareEl.style.backgroundColor = colors[9]
            }
            
            squareEl.style.gridColumn = `${this.boardTokens[i].colStart} / ${this.boardTokens[i].colEnd}`
            squareEl.style.gridRow = `${this.boardTokens[i].rowStart} / ${this.boardTokens[i].rowEnd}`

            if(this.boardTokens[i].isBomb){
                squareEl.setAttribute('id', 'bomb')
            }else if (this.boardTokens[i].isEmpty){
                squareEl.setAttribute('id', 'empty')
            }

            this.boardTokens[i].squareEl = squareEl
            board.appendChild(squareEl)
        }
    }
}

const sweep = new Sweeper()

// Tests //
const testBoard = () => {
    sweep.clearBoard()
    sweep.makeBoard(9,9,10)
    sweep.constructBoardObj()
    sweep.constructBoardEls()
}

// DOM EVENTS //
boardBtn.addEventListener('click', testBoard)