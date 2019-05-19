window.onload = main;

const whiteimages = [
	addImage("/assets/images/chess/white-pawn.png"),
	addImage("/assets/images/chess/white-rook.png"),
	addImage("/assets/images/chess/white-knight.png"),
	addImage("/assets/images/chess/white-bishop.png"),
	addImage("/assets/images/chess/white-queen.png"),
	addImage("/assets/images/chess/white-king.png"),
];
const blackimages = [
	addImage("/assets/images/chess/black-pawn.png"),
	addImage("/assets/images/chess/black-rook.png"),
	addImage("/assets/images/chess/black-knight.png"),
	addImage("/assets/images/chess/black-bishop.png"),
	addImage("/assets/images/chess/black-queen.png"),
	addImage("/assets/images/chess/black-king.png"),
];

var images;

const WHITE = "#eeeed2";
const BROWN = "#b5651d";


function addImage(url) {
	const img = document.createElement("img");
	img.src = url;
	img.alt = url + " Not found";
	return img;
}


function index(i, j, cols=8) {
	return i * cols + j;
}

const defaultBoard = [
	-2, -3, -4, -5, -6, -4, -3, -2,
	-1, -1, -1, -1, -1, -1, -1, -1,
	0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0,
	1, 1, 1, 1, 1, 1, 1, 1,
	2, 3, 4, 5, 6, 4, 3, 2,
];

const moveSets = [
	pawnMoves,
	rookMoves,
	knightMoves,
	bishopMoves,
	queenMoves,
	kingMoves,
];

function inBounds(i, j) {
	return i >= 0 && i < 8 && j >= 0 && j < 8;
}


function pawnMoves(board, i, j, sign) {
	const moves = [];
	if(((sign == -1 && j == 1) || (sign == 1 && j == 6)) && sign != Math.sign(board[index(j - 2*sign, i)])) {
		moves.push({i:i, j:j-2*sign});
	}
	if(sign != Math.sign(board[index(j - sign, i)])) {
		moves.push({i:i, j:j-sign});
	}
	return moves;
}

function rookMoves(board, i, j, sign) {
	const moves = [];
	var x = i, y = j;
	do {
		x++;
		if(inBounds(x, y) && Math.sign(board[index(y, x)]) != sign) {
			moves.push({i:x, j:y});
		}
	} while(inBounds(x, y) && Math.sign(board[index(y, x)]) == 0);
	x = i, y = j;
	do {
		x--;
		if(inBounds(x, y) && Math.sign(board[index(y, x)]) != sign) {
			moves.push({i:x, j:y});
		}
	} while(inBounds(x, y) && Math.sign(board[index(y, x)]) == 0);
	x = i, y = j;
	do {
		y++;
		if(inBounds(x, y) && Math.sign(board[index(y, x)]) != sign) {
			moves.push({i:x, j:y});
		}
	} while(inBounds(x, y) && Math.sign(board[index(y, x)]) == 0);
	x = i, y = j;
	do {
		y--;
		if(inBounds(x, y) && Math.sign(board[index(y, x)]) != sign) {
			moves.push({i:x, j:y});
		}
	} while(inBounds(x, y) && Math.sign(board[index(y, x)]) == 0);
	x = i, y = j;
	return moves;
}

function knightMoves(board, i, j, sign) {
	const possible = [
		{i:i + 2, j:j + 1},
		{i:i + 2, j:j - 1},
		{i:i - 2, j:j + 1},
		{i:i - 2, j:j - 1},

		{i:i + 1, j:j + 2},
		{i:i + 1, j:j - 2},
		{i:i - 1, j:j + 2},
		{i:i - 1, j:j - 2},
	];
	const moves = [];
	for(var k = 0;k < possible.length;k++) {
		if(inBounds(possible[k].i, possible[k].j) && Math.sign(board[index(possible[k].j, possible[k].i)]) != sign) {
			moves.push(possible[k]);
		}
	}
	return moves;
}

function bishopMoves(board, i, j, sign) {
		const moves = [];
	var x = i, y = j;
	do {
		x++;
		y++;
		if(inBounds(x, y) && Math.sign(board[index(y, x)]) != sign) {
			moves.push({i:x, j:y});
		}
	} while(inBounds(x, y) && Math.sign(board[index(y, x)]) == 0);
	x = i, y = j;
	do {
		x--;
		y--;
		if(inBounds(x, y) && Math.sign(board[index(y, x)]) != sign) {
			moves.push({i:x, j:y});
		}
	} while(inBounds(x, y) && Math.sign(board[index(y, x)]) == 0);
	x = i, y = j;
	do {
		y++;
		x--;
		if(inBounds(x, y) && Math.sign(board[index(y, x)]) != sign) {
			moves.push({i:x, j:y});
		}
	} while(inBounds(x, y) && Math.sign(board[index(y, x)]) == 0);
	x = i, y = j;
	do {
		y--;
		x++;
		if(inBounds(x, y) && Math.sign(board[index(y, x)]) != sign) {
			moves.push({i:x, j:y});
		}
	} while(inBounds(x, y) && Math.sign(board[index(y, x)]) == 0);
	x = i, y = j;
	return moves;
}

function queenMoves(board, i, j, sign) {
	const rook = rookMoves(board, i, j, sign);
	const bish = bishopMoves(board, i,j, sign);
	const moves = [];
	for(var i = 0;i < rook.length;i++) {
		moves.push(rook[i]);
	}
	for(var i = 0;i < bish.length;i++) {
		moves.push(bish[i]);
	}
	return moves;
}

function kingMoves(board, i, j, sign) {
	const moves = [];
	for(var si = -1;si < 2;si++) {
		for(var sj = -1;sj < 2;sj++) {
			if(si == 0 && sj == 0) {
				continue;
			}
			if(inBounds(i+si, j+sj) && Math.sign(board[index(j+sj, i+si)]) != sign) {
				moves.push({i:i+si, j:j+sj});
			}
		}
	}
	return moves;
}


class ChessGame {
	constructor(canvas, context) {
		this.canvas = canvas;
		this.context = context;
		this.width = canvas.width;
		this.height = canvas.height;
		this.cellWidth = this.width/8;
		this.cellHeight = this.height/8;
		this.cellCenterX = this.width / 16;
		this.cellCenterY = this.height / 16;
		this.selected = -1;
		this.moves = [];

		this.reset();
	}

	drawBoard() {
		var color = WHITE;
		for(var i = 0;i < 8;i++) {
			for(var j = 0;j < 8;j++) {
				this.context.fillStyle = color;
				this.context.fillRect(this.cellWidth * i, this.cellHeight * j, this.cellWidth, this.cellHeight);
				if(this.board[index(j, i)] > 0) {
					this.context.drawImage(whiteimages[Math.abs(this.board[index(j, i)])-1], this.cellWidth*i, this.cellHeight*j, this.cellWidth, this.cellHeight);
				}
				if(this.board[index(j, i)] < 0) {
					this.context.drawImage(blackimages[Math.abs(this.board[index(j, i)])-1], this.cellWidth*i, this.cellHeight*j, this.cellWidth, this.cellHeight);
				}
				if(j < 7){
					color = color == WHITE ? BROWN : WHITE;
				}
			}
		}
		for(var i = 0;i < this.moves.length;i++) {
			this.context.strokeStyle = "red";
			this.context.lineWidth = 2;
			this.context.strokeRect(this.cellWidth * this.moves[i].i, this.cellHeight * this.moves[i].j, this.cellWidth, this.cellHeight);
		}

		if(this.selected != -1) {
			const i = this.selected % 8;
			const j = Math.floor(this.selected / 8);
			this.context.strokeStyle = "blue";
			this.context.lineWidth = 2;
			this.context.strokeRect(this.cellWidth * i, this.cellHeight * j, this.cellWidth, this.cellHeight);
		}
	}

	onclick(x, y, w, h) {
		var cell;
		var celli, cellj;
		for(var i = 0;i < 8;i++) {
			const lowx = w/8 * i;
			const highx = w/8 * (i+1);
			if(x > lowx && x < highx) {
				for(var j = 0;j < 8;j++) {
					const lowy = h/8 * j;
					const highy = h/8 * (j+1);
					if(y > lowy && y < highy) {
						celli = i;
						cellj = j;
						cell = index(j, i);
						break;
					}
				}
			}
		}
		if(this.selected > -1 && Math.sign(this.board[index(cellj, celli)]) != Math.sign(this.board[this.selected]) ) {
			for(var i = 0;i < this.moves.length;i++) {
				const mv = this.moves[i];
				if(celli == mv.i && cellj == mv.j) {
					const p = this.board[this.selected];
					this.board[index(cellj, celli)] = p;
					this.board[this.selected] = 0;
					this.selected = -1;
					this.moves = [];
					this.drawBoard();
					break;
				}
			}
		}
		else if(this.board[cell] != 0) {
			const moves = moveSets[Math.abs(this.board[cell]) - 1](this.board, celli, cellj, Math.sign(this.board[cell]));
			if(moves.length > 0) {
				this.selected = cell;
				this.moves = moves;
			}
			this.drawBoard();
		}

	}

	reset(event) {
		this.board = Array.from(defaultBoard);
		this.drawBoard();
	}
}


function main() {
	const canvas = document.getElementById("board");
	const context = canvas.getContext("2d");
	const resetBtn = document.getElementById("reset-btn");
	const player1Select = document.getElementById("player1-select");
	const player2Select = document.getElementById("player2-select");

	const chess = new ChessGame(canvas, context);

	function reset(e) {
		chess.reset();
	}

	resetBtn.addEventListener("click", reset);
	player1Select.addEventListener("change", reset);
	player2Select.addEventListener("change", reset);

	canvas.addEventListener("click", function (event) {
		const rect = canvas.getBoundingClientRect();
		const width = rect.width;
		const height = rect.height;
		const mouseX = event.clientX - rect.left;
		const mouseY = event.clientY - rect.top;
		chess.onclick(mouseX, mouseY, width, height);
	});
}