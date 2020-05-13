class Minimax extends Player
{
    constructor(player, callback)
    {
        super(player, callback);
    }

    /**
     * makes a move on the game
     * @param {the game to perform the move on} _game
     * @param {the players } _players
     */
    makeMove(game)
    {
        if(game.hasMovesLeft(this.player))
        {
            let moves = game.possibleMoves(this.player);
            var maxScore = -1e8;
            var chosenMoveIdx = 0;
            let other = this.player == 1 ? 2 : 1;
            var depth = 6;

            for(var i = 0;i < moves.length;i++)
            {
                let move = moves[i];
                let psudogame = this.prepGame(game);
                psudogame.makeMove(this.player, move);
                let score = this.minimax(depth, psudogame, other, -1e8, 1e8);
                if(score > maxScore)
                {
                    maxScore = score;
                    chosenMoveIdx = i;
                }
            }
            let chosenMove = moves[chosenMoveIdx];
            this.callback(game.makeMove(this.player, chosenMove));
        }
    }

    minimax(depth, game, player, alpha, beta)
    {
        let other = player == 1 ? 2 : 1;
        if(depth <= 0 || !game.hasMovesLeft(player))
        {
            return game.getScore(this.player);
        }
        if(player == this.player)
        {
            let moves = game.possibleMoves(player);
            var maxScore = -1e8;

            for(var idx = 0;idx < moves.length;idx++)
            {
                let move = moves[idx];
                let psudogame = this.prepGame(game);
                psudogame.makeMove(player, move);
                let score = this.minimax(depth-1, psudogame, other, alpha, beta);
                maxScore = Math.max(score, maxScore);
                alpha = Math.max(alpha, maxScore);
                if(beta <= alpha)
                {
                    break;
                }
            }
            return maxScore;
        }
        else
        {
            let moves = game.possibleMoves(player);
            var minScore = 1e8;
            let other = player == 1 ? 2 : 1;
            for(var idx = 0;idx < moves.length;idx++)
            {
                let move = moves[idx];
                let psudogame = this.prepGame(game);
                psudogame.makeMove(player, move);
                let score = this.minimax(depth-1, psudogame, other, alpha, beta);
                score = Math.min(score, minScore);
                beta = Math.min(beta, minScore);
                if(beta <= alpha)
                {
                    break;
                }
            }
            return minScore;
        }
    }
}