class Othello extends Game {
	constructor(canvas, context, player1, player2) {
		super(canvas, context, player1, player2);
	}

	draw() {
		const width8 = this.canvas.width/8;
		const width16 = this.canvas.width/16;
		const height8 = this.canvas.height/8;
		const height16 = this.canvas.height/16;

		this.context.fillStyle = "#009933"
		this.context.fillRect(0, 0, this.width, this.height);

		this.context.strokeStyle = "black";
		this.context.lineWidth = 1;
		for(var x = width8;x <= 7 * width8; x += width8) {
			this.context.beginPath();
			this.context.moveTo(x, 0);
			this.context.lineTo(x, this.height);
			this.context.stroke();
		}

		for(var y = height8;y <= 7 * height8;y += height8) {
			this.context.beginPath();
			this.context.moveTo(0, y);
			this.context.lineTo(this.width, y);
			this.context.stroke();
		}

		for(var i = 0, k = 0;i < 8;i++) {
			for(var j = 0;j < 8;j++, k++) {
				if(this.board[k] != 0) {
					this.context.beginPath();
					this.context.arc(i * width8 + width16, j * height8 + height16, width16, 0, 2 * Math.PI);
					this.context.fillStyle = this.board[k] == 1 ? "white" : "black";
					this.context.fill();
				}
			}
		}

		this.context.strokeStyle = this.playerIdx == 0 ? "white" : "black";
		this.context.lineWidth = 3;
		for(var i = 0;i < this.moves.length;i++) {
			const k = this.moves[i];
			const x = Math.floor(k / 8);
			const y = k % 8;
			this.context.beginPath();
			this.context.strokeRect(x * width8, y * height8,  width8,  height8);
		}

		this.context.font = this.width/7 + "px Arial";
		this.context.fillStyle = "red";
		this.context.textAlign = "center";
		if(this.winner != 0 || this.done ){
			this.context.fillText("Winner: " + (this.winner == 1 ? "White" : this.winner == -1 ? "Black" : "Tie"), this.width/2, this.height/3);
			var score_text;
			if(this.winner == 0) {
				score_text = "" + this.score(-1);
			}
			else {
				const lose = this.winner == 1 ? -1 : 1;
				score_text = this.score(this.winner) + " - " + this.score(lose);
			}
			this.context.fillText(score_text, this.width/2, 2*this.height/3);
		}
	}

	onclick(x, y, width, height) {
		const i = Math.floor(8 * x / width);
		const j = Math.floor(8 * y / height);
		const k = i * 8 + j;
		var canMove = false;
		for(var p = 0;p < this.moves.length;p++) {
			if(this.moves[p] == k) {
				canMove = true;
			}
		}
		console.log(canMove, this.players[this.playerIdx].ishuman);
		if(this.players[this.playerIdx].ishuman && canMove && this.winner == 0) {
			this.makeMove(k);
			this.players[this.playerIdx].play();
		}
	}

	makeMove(move) {
		if(this.winner == 0) {
			var person = this.playerIdx == 0 ? 1 : -1;
			this.placePiece(this.board, person, move, this.turn);
			this.turn++;
			this.playerIdx = this.playerIdx == 1 ? 0 : 1;
			person = -person;
			this.moves = this.getPossibleMoves(this.board, person, this.turn);
			if(this.moves.length == 0) {
				this.playerIdx = this.playerIdx == 1 ? 0 : 1;
				person = -person;
				this.turn++;
				this.moves = this.getPossibleMoves(this.board, person, this.turn);
				if(this.moves.length == 0) {
					this.setWinner();
					this.done = true;
				}
			}
			this.draw();
		}
	}

	getCurrentAvailableMoves() {
		return this.moves;
	}

	score(player) {
		var sum = 0;
		for(var i = 0;i < 64;i++) {
			if(this.board[i] == player) {
				sum++;
			}
		}
		return sum;
	}

	reset(player1, player2) {
		this.board = Array(64).fill(0);
		this.winner = 0;
		this.turn = 0;
		this.moves = this.getPossibleMoves(this.board, 1, this.turn);
		this.done = false;
		super.reset(player1, player2);
	}

	setWinner() {
		var sum = 0;
		for(var i = 0;i < 64;i++) {
			sum += this.board[i];
		}
		this.winner = Math.sign(sum);
	}

	inBounds(i, j) {
		return i >= 0 && i < 8 && j >= 0 && j < 8;
	}

	moveDir(board, person, i, j, si, sj) {
		var k;
		while(true) {
			i += si;
			j += sj;
			k = i * 8 + j;
			if(!this.inBounds(i,j) || board[k] == 0 || board[k] == person) {
				break;
			}
			board[k] = person;
		}
	}

	placePiece(board, person, move, turn) {
		board[move] = person;
		if(turn >= 4) {
			const i = Math.floor(move/8);
			const j = move % 8;
			for(var si = -1;si < 2;si++) {
				for(var sj = -1;sj < 2;sj++) {
					if(this.checkDir(board, person, i+si, j+sj, si, sj)) {
						this.moveDir(board, person, i, j, si, sj);
					}
				}
			}
		}
	}

	checkDir(board, person, i, j, si, sj) {
		var k = i * 8 + j;
		if(!this.inBounds(i, j) || board[k] == person || board[k] == 0) {
			return false;
		}
		while(true) {
			i += si;
			j += sj;
			k = i * 8 + j;
			if(!this.inBounds(i, j) || board[k] == 0) {
				return false;
			}
			if(board[k] == person) {
				return true;
			}
		}
	}

	getPossibleMoves(board, person, turn) {
		var moves = [];
		if(turn < 4) {
			if(board[27] == 0) {
				moves.push(27);
			}
			if(board[28] == 0) {
				moves.push(28);
			}
			if(board[35] == 0) {
				moves.push(35);
			}
			if(board[36] == 0) {
				moves.push(36);
			}
		}
		else {
			for(var i = 0, k = 0;i < 8;i++) {
				for(var j = 0;j < 8;j++, k++) {
					if(board[k] == 0) {
						for(var si = -1;si < 2;si++) {
							for(var sj = -1;sj < 2;sj++) {
								if(si == 0 && sj == 0) {
									continue;
								}
								if(this.checkDir(board, person, i + si, j + sj, si, sj)) {
									moves.push(k);
								}
							}
						}
					}
				}
			}
		}
		return moves;
	}
}

games['othello'] = {
	game_class: Othello,
	game_name: "Othello/Reversi"
};
