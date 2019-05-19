const symbols = [' ', 'X', 'O'];


var currentPlayer, winner;

class Player {
	constructor(canvas, context, me) {
		this.canvas = canvas;
		this.context = context;
		this.me = me;
		this.ishuman = false;
		this.lbl = document.getElementById("currentPlayer");
	}

	play(board) {
		currentPlayer = this;
		this.lbl.style.display = "inline-block";
		this.lbl.innerHTML = symbols[this.me];
	}
};

class RandomAI extends Player {
	constructor(canvas, context, me) {
		super(canvas, context, me);
	}
	play(board) {
		super.play(board);
		if(winner > -1) {
			return;
		}
		drawBoard(this.canvas, this.context, board);
		var moves = [];
		for(var i = 0;i < 9;i++) {
			if(board[i] == 0) {
				moves.push(i);
			}
		}
		const mv = moves[Math.floor(Math.random() * moves.length)];
		board[mv] = this.me;
		findWinner(this.canvas, this.context, board);
		if(winner > -1) {
			if(winner == 0) drawBoard(this.canvas, this.context, board);
			drawWinner(this.canvas, this.context);
			return;
		}
		this.other.play(board);
	}
};

class HumanPlayer extends Player {
	constructor(canvas, context, me, board) {
		super(canvas, context, me, board);
		this.ishuman = true;
	}
	play(board) {
		super.play(board);
		drawBoard(this.canvas, this.context, board);
	}
}

const ai = {"human":HumanPlayer, "random":RandomAI};


window.onload = function(event) {
	const canvas = document.getElementById("board");
	const resetBtn = document.getElementById("reset-btn");
	const player1Select = document.getElementById("player1-select");
	const player2Select = document.getElementById("player2-select");
	const context = canvas.getContext("2d");
	var board = [
		0, 0, 0,
		0, 0, 0,
		0, 0, 0
	];
	drawBoard(canvas, context, board);

	var players;

	function reset(event) {
		winner = -1;
		for(var i = 0;i < 9;i++) {
			board[i] = 0;
		}
		players = [new ai[player1Select.value](canvas, context, 1),
			new ai[player2Select.value](canvas, context, 2)];
		players[0].other = players[1];
		players[1].other = players[0];
		players[0].play(board);
	}

	// currentPlayerDisplay.innerHTML = symbols[player];
	canvas.addEventListener("click", function(event) {
		if(!currentPlayer.ishuman || winner > -1) {
			return;
		}
		const rect = canvas.getBoundingClientRect();
		const width = rect.width;
		const height = rect.height;
		const mouseX = event.clientX - rect.left;
		const mouseY = event.clientY - rect.top;
		for(var i = 0;i < 9;i++) {
			const x = i % 3;
			const y = Math.trunc(i / 3);
			const xboundlow = x * (width / 3);
			const xboundhigh = (x + 1) * (width / 3);
			const yboundlow = y * (height / 3);
			const yboundhigh = (y + 1) * (height / 3);

			if(mouseX >  xboundlow && mouseX < xboundhigh &&
					mouseY >  yboundlow && mouseY < yboundhigh) {
				if(board[i] != 0) {
					continue;
				}
				board[i] = currentPlayer.me;
				findWinner(canvas, context, board);
				if(winner > -1) {
					if(winner == 0) drawBoard(canvas, context, board);
					drawWinner(canvas, context);
					return;
				}

				currentPlayer.other.play(board);
			}
		}
	});


	resetBtn.addEventListener("click", reset);
	player1Select.addEventListener("change", reset);
	player2Select.addEventListener("change", reset);
	reset();
};

function drawWin(canvas, context, board, player, start, end) {
	drawBoard(canvas, context, board);
	const width = canvas.width;
	const height = canvas.height;
	const starti = start % 3;
	const startj = Math.trunc(start / 3);
	const endi = end % 3;
	const endj = Math.trunc(end / 3);
	context.strokeStyle = "red";
	context.lineWidth = 5;
	context.beginPath();
	context.moveTo(width/3 * starti + width/6, height/3 * startj + height/6);
	context.lineTo(width/3 * endi+ width/6, height/3 * endj + height/6);
	context.stroke();
}

function drawWinner(canvas, context) {
	const width = canvas.width;
	const height = canvas.height;
	context.font = width/6 + "px Arial";
	context.fillStyle = "red";
	context.textAlign = "center";
	if(winner > 0) {
		context.fillText("Winner: " + symbols[winner], width/2, height/2);
	}
	else {
		context.fillText("Cat's Game", width/2, height/2);
	}



}

function isWinner(canvas, context, player, board) {
	var leftDiag = 0, rightDiag = 0;
	for(var i = 0;i < 3;i++) {
		var row = 0, col = 0;
		for(var j = 0;j < 3;j++) {
			if(board[i*3+j] == player) {
				row++;
			}
			if(board[j * 3 + i] == player) {
				col++;
			}
			if(row == 3) {
				drawWin(canvas, context, board, player, i * 3, i * 3 + j);
				return true;
			}
			if(col == 3) {
				drawWin(canvas, context, board, player, i, j * 3 + i);
				return true;
			}
		}
	}
	if(board[0] == player && board[4] == player && board[8] == player) {
		drawWin(canvas, context, board, player, 0, 8);
		return true;
	}
	if(board[2] == player && board[4] == player && board[6] == player) {
		drawWin(canvas, context, board, player, 2, 6);
		return true;
	}
	return false;
}

function findWinner(canvas, context, board) {
	if(isWinner(canvas, context, 1, board)) {
		winner = 1;
	}
	else if(isWinner(canvas, context, 2, board)) {
		winner = 2;
	}
	else if(done(board)) {
		winner = 0;
	}
	else {
		winner = -1;
	}
}

function done(board) {
	var d = true;
	for(var i = 0;i < 9;i++) {
		if(board[i] == 0) {
			d = false;
		}
	}
	return d;
}

function placePiece(canvas, context, piece, place) {
	const width = canvas.width;
	const height = canvas.height;
	const i = place % 3;
	const j = Math.trunc(place / 3);
	context.font = 11*width/24 + "px Arial";
	context.fillStyle = "black";
	context.textAlign = "center";
	context.fillText(piece, i * width/3 + width/6, j * height/3 + height/3);
}

function drawBoard(canvas, context, board) {
	const width = canvas.width;
	const height = canvas.height;
	context.fillStyle = "white";
	context.fillRect(0, 0, width, height);


	context.strokeStyle = "black";
	context.lineWidth = 1;
	for(var x = width/3;x <= 2*width/3;x+=width/3) {
		context.beginPath();
		context.moveTo(x, 0);
		context.lineTo(x, height);
		context.stroke();
	}
	for(var y = height/3;y <= 2*height/3;y+=height/3) {
		context.beginPath();
		context.moveTo(0, y);
		context.lineTo(width, y);
		context.stroke();
	}
	for(var i = 0;i < 9;i++) {
		placePiece(canvas, context, symbols[board[i]], i);
	}
}
