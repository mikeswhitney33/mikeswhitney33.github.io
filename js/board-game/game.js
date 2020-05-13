class Game
{
    constructor(context, canvas)
    {
        this.context = context;
        this.canvas = canvas;
        this.width = canvas.width;
        this.height = canvas.height;
    }

    /**
     * Draws the board for playing
     */
    draw()
    {

    }

    /**
     * performs the move on the board
     * @param {the player making the move (either 1 or 2)} _player
     * @param {the move being made (a single number between 0 and n moves)} _move
     * @returns {the next player (either 1 or 2)}
     */
    makeMove(_player, _move)
    {

    }

    /**
     * converts a click to a move index
     * @param {x coordinate of the click} _x
     * @param {y coordinate of the click} _y
     * @param {the width of the bounding box } _width
     * @param {height of the bounding box} _height
     * @returns {the move converted from the click info}
     */
    clickToMove(_x, _y, _width, _height)
    {

    }

    /**
     * @returns {true if there are moves left to make, false otherwise}
     */
    hasMovesLeft(_player)
    {

    }

    /**
     * @param {the player whose moves we are checking}
     * @returns {a list of possible moves}
     */
    possibleMoves(_player)
    {

    }

    /**
     * makes a copy of the current game on which the player can do as he or she pleases and not affect the original game.
     * @returns {the copy of the current game}
     */
    copy()
    {

    }

    /**
     *
     * @param {the player whose score we are checking} _player
     * @returns {the score of the player given}
     */
    getScore(_player)
    {

    }
}