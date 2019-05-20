class Game {
	constructor(canvas, context, player1, player2) {
		this.canvas = canvas;
		this.context = context;
		this.width = this.canvas.width;
		this.height = this.canvas.height;
		this.reset(player1, player2);
	}

	draw() {

	}

	onclick(x, y, width, height) {

	}

	reset(player1, player2) {
		this.playerIdx = 0;
		this.players = [new player1(this), new player2(this)];

		this.players[this.playerIdx].play();
		this.draw();
	}

	getCurrentAvailableMoves() {

	}

	makeMove(move) {

	}
}

class Player {
	constructor(game) {
		this.ishuman = false;
		this.game = game;
	}

	play() {

	}
}

class HumanPlayer extends Player {
	constructor(game) {
		super(game);
		this.ishuman = true;
	}
}

class RandomAI extends Player {
	constructor(game) {
		super(game);
	}

	play() {
		var moves = this.game.getCurrentAvailableMoves();
		if(moves.length > 0) {
			var move = Math.floor(Math.random() * moves.length);
			this.game.makeMove(moves[move]);
			this.game.players[this.game.playerIdx].play();
		}
	}
}

var playerClasses = {
	"human": HumanPlayer,
	"randomai":RandomAI
}

var games = {}
