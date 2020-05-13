class Player
{
    constructor(player, callback)
    {
        this.player = player;
        this.callback = callback;
    }

    /**
     * makes a move on the game
     * @param {the game to perform the move on} _game
     * @param {the players } _players
     */
    makeMove(_game)
    {

    }

    prepGame(game)
    {
        var newGame = game.copy();
        newGame.draw = function(){};
        return newGame;
    }
}

class RandomAI extends Player
{
    constructor(player, callback)
    {
        super(player, callback);
    }

    makeMove(game)
    {
        if(game.hasMovesLeft(this.player))
        {
            let moves = game.possibleMoves(this.player);
            let move = moves[Math.floor(Math.random() * moves.length)];
            this.callback(game.makeMove(this.player, move));
        }
    }
}

class HumanPlayer extends Player
{
    constructor(player, callback)
    {
        super(player, callback);
    }
}