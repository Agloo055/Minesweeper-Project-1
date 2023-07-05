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
        console.log(this.gameBoard)
    }

    updateRadars () {

    }

    updateRadar () {

    }
}

const sweep = new Sweeper()

// Tests //
const testBoard = () => {
    sweep.makeBoard(9,9,10)
}

// DOM EVENTS //
boardBtn.addEventListener('click', testBoard)