class Othello extends Game
{
    constructor(context, canvas)
    {
        super(context, canvas);
        this.w8 = this.width / 8;
        this.w16 = this.width / 16;
        this.h8 = this.height / 8;
        this.h16 = this.height / 16;
        this.grid = new Array(64).fill(0);
        this.turn = 0;
        this.winner = 0;
        this.winningScore = 0;
        this.complete = false;
        this.availableMoves = [27, 28, 35, 36]
        this.scoreCard =
        [
            100, -50, 30, 10, 10, 30, -50, 100,
            -50, -100, -10, -10, -10, -100, -50,
            30, -10, 10, 10, 10, 10, -10, 30,
            10, -10, 10, 10, 10, 10, -10, 10,
            10, -10, 10, 10, 10, 10, -10, 10,
            30, -10, 10, 10, 10, 10, -10, 30,
            -50, -100, -10, -10, -10, -100, -50,
            100, -50, 30, 10, 10, 30, -50, 100
        ]
    }

    /**
     * Draws the board for playing
     */
    draw()
    {
        this.context.fillStyle = "green";
        this.context.fillRect(0, 0, this.width, this.height);
        this.context.strokeStyle = "black";
        this.context.lineWidth = 1;
        for(var i = 1;i < 8;i++)
        {
            let x = i * this.w8;
            let y = i * this.h8;
            this.context.beginPath();
            this.context.moveTo(x, 0);
            this.context.lineTo(x, this.height);
            this.context.stroke();
            this.context.beginPath();
            this.context.moveTo(0, y);
            this.context.lineTo(this.width, y);
            this.context.stroke();
        }

        for(var i = 0;i < 8;i++)
        {
            for(var j = 0;j < 8;j++)
            {
                let idx = i * 8 + j;
                if(this.grid[idx] == 0)
                {
                    continue;
                }
                let color = this.grid[idx] == 1 ? "white" : "black";
                this.context.fillStyle = color;
                let x = i * this.w8 + this.w16;
                let y = j * this.h8 + this.h16;
                let rad = Math.min(this.w16, this.h16);
                this.context.beginPath();
                this.context.arc(x, y, rad * 0.9, 0, Math.PI * 2);
                this.context.fill();
            }
        }

        this.context.strokeStyle = "red";
        this.context.lineWidth = 3;
        for(var idx = 0;idx < this.availableMoves.length;idx++)
        {
            let move = this.availableMoves[idx];
            let i = Math.floor(move / 8);
            let j = move % 8;
            let x = i * this.w8;
            let y = j * this.h8;
            this.context.strokeRect(x, y, this.w8, this.h8);
        }

        if(this.complete)
        {
            this.context.font = this.w8 + "px Arial";
            this.context.fillStyle = "red";
            this.context.textAlign = "center";
            var msg;
            if(this.winner == 1)
            {
                msg = "White wins: " + this.winningScore;
            }
            else if(this.winner == 2)
            {
                msg = "Black wins: " + this.winningScore;
            }
            else
            {
                msg = "Tie!";
            }
            this.context.fillText(msg, this.width/2, this.height/2);
        }
    }

    /**
     * performs the move on the board
     * @param {the player making the move (either 1 or 2)} _player
     * @param {the move being made (a single number between 0 and n moves)} _move
     * @returns {the next player (either 1 or 2)}
     */
    makeMove(player, move)
    {
        if(this.canMove(player, move))
        {
            this.grid[move] = player;
            let i = Math.floor(move / 8);
            let j = move % 8;
            for(var si = -1;si < 2;si++)
            {
                for(var sj = -1;sj < 2;sj++)
                {
                    if(si == 0 && sj == 0)
                    {
                        continue;
                    }
                    if(this.checkDir(player, i+si, j+sj, si, sj))
                    {
                        this.markDir(player, i+si, j+sj, si, sj);
                    }
                }
            }
            this.turn++;
            var res = player == 1 ? 2 : 1;
            this.setAvailableMoves(res);
            if(this.availableMoves.length == 0)
            {
                res = player;
                this.setAvailableMoves(res);
                if(this.availableMoves.length == 0)
                {
                    this.getWinner();
                }
            }
            this.draw();
            return res;
        }
        return player;
    }

    /**
     * converts a click to a move index
     * @param {x coordinate of the click} _x
     * @param {y coordinate of the click} _y
     * @param {the width of the bounding box } _width
     * @param {height of the bounding box} _height
     * @returns {the move converted from the click info}
     */
    clickToMove(x, y, width, height)
    {
        let i = Math.floor(8 * x / width);
		let j = Math.floor(8 * y / height);
		return i * 8 + j;
    }

    /**
     * @returns {true if there are moves left to make, false otherwise}
     */
    hasMovesLeft(player)
    {
        this.setAvailableMoves(player);
        return this.availableMoves.length > 0;
    }

    /**
     * @returns {a list of possible moves}
     */
    possibleMoves(player)
    {
        this.setAvailableMoves(player);
        return this.availableMoves;
    }

    /**
     * makes a copy of the current game on which the player can do as he or she pleases and not affect the original game.
     * @returns {the copy of the current game}
     */
    copy()
    {
        var game = new Othello(this.canvas, this.context);
        game.grid = this.grid.slice();
        game.turn = this.turn;
        game.winner = this.winner;
        game.winningScore = this.winningScore;
        game.complete = this.complete;
        game.availableMoves = this.availableMoves;
        return game;
    }

    canMove(player, move)
    {
        if(this.grid[move] != 0)
        {
            return false;
        }
        if(this.turn < 4)
        {
            return move == 27 || move == 28 || move == 35 || move == 36;
        }
        let i = Math.floor(move / 8);
        let j = move % 8;
        for(var si = -1;si < 2;si++)
        {
            for(var sj = -1; sj < 2;sj++)
            {
                if(si == 0 && sj == 0)
                {
                    continue;
                }
                if(this.checkDir(player, i+si, j+sj, si, sj))
                {
                    return true;
                }
            }
        }
        return false;
    }

    checkDir(player, i, j, si, sj)
    {
        if(i < 0 || i >= 8 || j < 0 || j >= 8)
        {
            return false;
        }
        var idx = i * 8 + j;
        if(this.grid[idx] == 0)
        {
            return false;
        }
        if(this.grid[idx] == player)
        {
            return false;
        }
        while(true)
        {
            var idx = i * 8 + j;
            if(i < 0 || i >= 8 || j < 0 || j >= 8)
            {
                return false;
            }
            if(this.grid[idx] == 0)
            {
                return false;
            }
            if(this.grid[idx] == player)
            {
                return true;
            }
            i+=si;
            j+=sj;
        }
        // var idx = i * 8 + j;
        // if(this.grid[idx] == 0 || this.grid[idx] == player)
        // {
        //     return false;
        // }
        // i+= si;
        // j+= sj;
        // while(true)
        // {
        //     if(i < 0 || i >= 8 || j < 0 || j >= 8)
        //     {
        //         return false;
        //     }
        //     idx = i * 8 + j;
        //     if(this.grid[idx] == player)
        //     {
        //         return true;
        //     }
        //     i += si;
        //     j += sj;
        // }
    }

    markDir(player, i, j, si, sj)
    {
        while(true)
        {
            let idx = i * 8 + j;
            if(this.grid[idx] == player)
            {
                break;
            }
            this.grid[idx] = player;
            i += si;
            j += sj;
        }
    }

    setAvailableMoves(player)
    {
        this.availableMoves = [];
        for(var move = 0;move < 64;move++)
        {
            if(this.canMove(player, move))
            {
                this.availableMoves.push(move);
            }
        }
    }

    getWinner()
    {
        var p1 = 0;
        var p2 = 0;
        for(var idx = 0;idx < 64;idx++)
        {
            if(this.grid[idx] == 1)
            {
                p1++;
            }
            if(this.grid[idx] == 2)
            {
                p2++;
            }
        }
        if(p1 > p2)
        {
            this.winner = 1;
            this.winningScore = p1;
        }
        else if(p2 > p1)
        {
            this.winner = 2;
            this.winningScore = p2;
        }
        else
        {
            this.winner = 0;
            this.winningScore = p1;
        }
        this.complete = true;
    }

    getScore(player)
    {
        var score = 0;
        for(var i = 0;i < this.grid.length;i++)
        {
            if(this.grid[i] == player)
            {
                score += this.scoreCard[i];
            }
        }
        return score;
    }
}