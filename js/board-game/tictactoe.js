class TicTacToe extends Game
{
    constructor(context, canvas)
    {
        super(context, canvas);
        this.w3 = this.width / 3;
        this.h3 = this.height / 3;
        this.w6 = this.w3 / 2;
        this.h6 = this.h3 / 2;
        this.grid = new Array(9).fill(0);
        this.winner = 0;
        this.winningCombo = -1;
        this.combos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // vertical
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // horizontal
            [0, 4, 8], [2, 4, 6] // diagonal
        ]
    }

    draw()
    {
        this.context.fillStyle = "white";
        this.context.fillRect(0, 0, this.width, this.height);
        this.context.strokeStyle = "black";
        this.context.lineWidth = 1;
        for(var i = 1;i < 3;i++)
        {
            let x = i * this.w3;
            let y = i * this.h3;
            this.context.beginPath();
            this.context.moveTo(x, 0);
            this.context.lineTo(x, this.height);
            this.context.stroke();
            this.context.beginPath();
            this.context.moveTo(0, y);
            this.context.lineTo(this.width, y);
            this.context.stroke();
        }

        this.context.lineWidth = 15;
        for(var i = 0;i < 3;i++)
        {
            for(var j = 0;j < 3;j++)
            {
                let idx = i * 3 + j;
                if(this.grid[idx] == 1)
                {
                    let rad = Math.min(this.w6, this.h6);
                    let off = rad * 0.1;
                    let x1 = i * this.w3 + off;
                    let y1 = j * this.h3 + off;
                    let x2 = (i + 1) * this.w3 - off;
                    let y2 = (j + 1) * this.h3 - off;
                    this.context.beginPath();
                    this.context.moveTo(x1, y1);
                    this.context.lineTo(x2, y2);
                    this.context.moveTo(x2, y1);
                    this.context.lineTo(x1, y2);
                    this.context.stroke();

                }
                else if(this.grid[idx] == 2)
                {
                    let x = i * this.w3 + this.w6;
                    let y = j * this.h3 + this.h6;
                    let rad = Math.min(this.w6, this.h6);
                    this.context.beginPath();
                    this.context.arc(x, y, rad * 0.9 , 0, Math.PI * 2);
                    this.context.stroke();
                }
            }
        }

        this.context.font = this.w6 + "px Arial";
		this.context.fillStyle = "red";
		this.context.textAlign = "center";
        if(this.winner != 0)
        {
            this.context.strokeStyle = "red";
            let combo = this.combos[this.winningCombo];
            console.log(combo);
            let first = combo[0];
            let last = combo[2];
            let i1 = Math.floor(first / 3);
            let j1 = first % 3;
            let i2 = Math.floor(last / 3);
            let j2 = last % 3;
            console.log("(" + i1 + "," + j1 + ")");
            console.log("(" + i2 + "," + j2 + ")");
            let x1 = i1 * this.w3 + this.w6;
            let y1 = j1 * this.h3 + this.h6;
            let x2 = i2 * this.w3 + this.w6;
            let y2 = j2 * this.h3 + this.h6;
            this.context.beginPath();
            this.context.moveTo(x1, y1);
            this.context.lineTo(x2, y2);
            this.context.stroke();
            this.context.fillText("Winner: " + (this.winner == 1 ? "X" : "O"), this.width / 2, this.height / 2);
        }
        else if(!this.hasMovesLeft())
        {
            this.context.fillText("Cat's Game", this.width / 2, this.height / 2);
        }
    }

    hasMovesLeft(_player)
    {
        for(var i = 0;i < this.grid.length;i++)
        {
            if(this.grid[i] == 0)
            {
                return true;
            }
        }
        return false;
    }

    possibleMoves(_player)
    {
        var moves = [];
        for(var i = 0;i < this.grid.length;i++)
        {
            if(this.grid[i] == 0)
            {
                moves.push(i);
            }
        }
        return moves;
    }

    makeMove(player, move)
    {
        if(this.winner == 0 && this.grid[move] == 0)
        {
            this.grid[move] = player;
            this.getWinner();
            this.draw();
            return player == 1 ? 2 : 1;
        }
        return player;
    }

    clickToMove(x, y, width, height)
    {
        let i = Math.floor(3 * x / width);
		let j = Math.floor(3 * y / height);
		return i * 3 + j;
    }

    getWinner()
    {
        for(var i = 0;i < this.combos.length;i++)
        {
            let combo = this.combos[i];
            if(this.grid[combo[0]] != 0 && this.grid[combo[0]] == this.grid[combo[1]] && this.grid[combo[0]] == this.grid[combo[2]])
            {
                this.winner = this.grid[combo[0]];
                this.winningCombo = i;
            }
        }
    }

    copy()
    {
        var game = new TicTacToe(this.canvas, this.context);
        game.grid = this.grid.slice();
        game.winner = this.winner;
        game.winningCombo = this.winningCombo;
        return game;
    }

    getScore(player)
    {
        var score = 0;
        for(var i = 0;i < this.grid.length;i++)
        {
            if(this.grid[i] == player)
            {
                score++;
            }
        }
        return score;
    }
}