console.log("Hello!")

// DOM VARIABLES //
let boardBtn = document.getElementById('makeBoard')


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
}

const sweep = new Sweeper()

// Tests //
const testBoard = () => {
    sweep.clearBoard()
    sweep.makeBoard(9,9,10)
}

// DOM EVENTS //
boardBtn.addEventListener('click', testBoard)