const colors = ["white", "black"];

var currentPlayer, turn;

class Player {
	constructor(canvas, context, me, board) {
		this.canvas = canvas;
		this.context = context;
		this.me = me;
		this.ishuman = false;
		this.lbl = document.getElementById("playerid");
	}

	play(board) {
		currentPlayer = this;
		this.lbl.style.display = "inline-block";
		this.lbl.className = "circle " + colors[this.me - 1];
	}
};

class RandomAI extends Player {
	constructor(canvas, context, me, board) {
		super(canvas, context, me, board);
	}
	play(board) {
		super.play(board);
		drawBoard(this.canvas, this.context, board, []);
		const moves = possibleMoves(board, this.me, turn);
		if(moves.length == 0) {
			if(endgame(board, turn)) {
				finish(this.canvas, this.context, board);
				return;
			}
			this.other.play(board, turn);
		}
		const move = moves[Math.floor(Math.random() * moves.length)];
		makeMove(board, this.me, turn, move);
		turn++;
		this.other.play(board, turn);
	}
};

class HumanPlayer extends Player {
	constructor(canvas, context, me, board) {
		super(canvas, context, me, board);
		this.ishuman = true;
	}
	play(board) {
		super.play(board, turn);
		this.moves = possibleMoves(board, this.me, turn);
		drawBoard(this.canvas, this.context, board, this.moves);
		if(this.moves.length == 0) {
			if(endgame(board, turn)) {
				finish(this.canvas, this.context, board);
				return;
			}
		}

	}
}

const ai = {"human":HumanPlayer, "random":RandomAI};


window.onload = function() {
	const canvas = document.getElementById("board");
	const context = canvas.getContext("2d");
	const resetBtn = document.getElementById("reset-btn");
	const player1Select = document.getElementById("player1-select");
	const player2Select = document.getElementById("player2-select");

	var players, board, availableMoves;

	function reset(event) {
		document.getElementById("winner").innerHTML = "";
		board = Array(8).fill().map(() => Array(8).fill(0));
		turn = 0;

		players = [new ai[player1Select.value](canvas, context, 1, board),
			new ai[player2Select.value](canvas, context, 2, board)]
		players[0].other = players[1];
		players[1].other = players[0];
		players[0].play(board);
	}



	resetBtn.addEventListener("click", reset);
	player1Select.addEventListener("change", reset);
	player2Select.addEventListener("change", reset);

	canvas.addEventListener("click", function(event) {
		if(currentPlayer.ishuman) {
			const rect = canvas.getBoundingClientRect();
			const width = rect.width;
			const height = rect.height;
			const mouseX = event.clientX - rect.left;
			const mouseY = event.clientY - rect.top;
			const moves = currentPlayer.moves;
			for(var i = 0;i < moves.length;i++) {
				const xboundlow = moves[i].x * (width / 8);
				const xboundhigh = (moves[i].x + 1) * (width / 8);
				const yboundlow = moves[i].y * (height / 8);
				const yboundhigh = (moves[i].y + 1) * (height / 8);
				if(mouseX >  xboundlow && mouseX < xboundhigh &&
					mouseY >  yboundlow && mouseY < yboundhigh) {
					makeMove(board, currentPlayer.me, turn, moves[i]);
					turn++;
					currentPlayer.other.play(board, turn);
				}
			}
		}
	});

	reset();
};

function finish(canvas, context, board) {
	drawBoard(canvas, context, board, []);
	const p1 = score(board, 1);
	const p2 = score(board, 2);
	const win = p1 > p2 ? 1 : p2 > p1 ? 2 : 0;
	// const win = winner(board);

	var msg;
	if(win == 0) {
		msg = "Tie " + p1 + " - " + p2;
		document.getElementById("playerid").style.display = "none";
	}
	else {
		msg = "Wins " + (p1 > p2 ? p1 : p2) + " - " + (p1 < p2 ? p1 : p2);
		document.getElementById("playerid").className = "circle " + colors[win-1];
	}
	document.getElementById("winner").innerHTML = msg;
}

function canPlay(board, player, turn) {
	return possibleMoves(board, player, turn).length > 0;
}

function endgame(board, turn) {
	return !canPlay(board, 1, turn) && !canPlay(board, 2, turn);
}

function winner(board) {
	const p1 = score(board, 1);
	const p2 = score(board, 2);
	return p1 > p2 ? 1 : p2 > p1 ? 2 : 0;
}

function score(board, player) {
	var total = 0;
	for(var i = 0;i < 8;i++) {
		for(var j = 0;j < 8;j++) {
			if(board[i][j] == player) {
				total++;
			}
		}
	}
	return total;
}

function inBounds(i, j) {
	return i >= 0 && i < 8 && j >= 0 && j < 8;
}

function checkDir(board, player, i, j, si, sj) {
	if(!inBounds(i, j) || board[i][j] == player || board[i][j] == 0) {
		return false;
	}
	while(true) {
		i += si;
		j += sj;
		if(!inBounds(i,j) || board[i][j] == 0) {
			return false;
		}
		if(board[i][j] == player) {
			return true;
		}
	}
}

function moveDir(board, player, i, j, si, sj) {
	while(true) {
		i += si;
		j += sj;
		if(!inBounds(i,j) || board[i][j] == 0 || board[i][j] == player) {
			break;
		}
		board[i][j] = player;
	}
}

function makeMove(board, player, turn, move) {
	board[move.x][move.y] = player;
	if (turn >= 4) {
		for(var si = -1;si <= 1;si++) {
			for(var sj = -1;sj <= 1;sj++) {
				if(si == 0 && sj == 0) {
					continue;
				}
				if(checkDir(board, player, move.x+si, move.y+sj, si, sj)) {
					moveDir(board, player, move.x, move.y, si, sj);
				}
			}
		}
	}
}

function canMove(board, player, turn, move) {
	const moveid = move.x * 8 + move.y;
	if(board[move.x][move.y] != 0) {
		return false;
	}
	if(turn < 4) {
		return moveid == 27 || moveid == 28 || moveid == 35 || moveid == 36;
	}
	for(var si = -1;si <= 1;si++) {
		for(var sj = -1;sj <= 1;sj++) {

			if(si == 0 && sj == 0) {
				continue;
			}
			console.log("(" + si + "," + sj + ")");
			if(checkDir(board, player, move.x + si, move.y + sj, si, sj)) {
				return true;
			}
		}
	}
	return false;
}

function possibleMoves(board, player, turn) {
	console.log("possibleMoves(" + player + "," + turn + ")");
	var moves = [];
	for(var i = 0;i < 8;i++) {
		for(var j = 0;j < 8;j++) {
			const move = {x:i, y:j};
			if(canMove(board, player, turn, move)) {
				moves.push(move)
			}
		}
	}
	return moves;
}

function drawBoard(canvas, context, board, moves) {
	const width = canvas.width;
	const height = canvas.height;
	context.fillStyle = "#009933"
	context.fillRect(0, 0, width, height);

	context.strokeStyle = "#000000";
	context.lineWidth = 1;
	for(var x = width/8;x < width;x += width/8) {
		context.beginPath();
		context.moveTo(x, 0);
		context.lineTo(x, height);
		context.stroke();
	}
	for(var y = height/8;y < height;y += height/8) {
		context.beginPath();
		context.moveTo(0, y);
		context.lineTo(width, y);
		context.stroke();
	}
	for(var i = 0;i < 8;i++) {
		for(var j = 0;j < 8;j++) {
			if(board[i][j] != 0) {
				context.beginPath();
				context.arc(i * width/8 + width/16, j * height/8 + height/16, width/16, 0, 2 * Math.PI);
				context.fillStyle = colors[board[i][j]-1];
				context.fill();
			}
		}
	}
	for(var i = 0;i < moves.length;i++) {
		context.beginPath();
		context.strokeStyle = colors[currentPlayer.me-1];
		context.lineWidth = 3;
		context.strokeRect(moves[i].x * width/8, moves[i].y * height/8,  width/ 8,  height/8);
	}
}
