class TicTacToe extends Game {
	constructor(canvas, context, player1, player2) {
		super(canvas, context, player1, player2);
	}

	draw() {
		const width3 = this.width/3;
		const width6 = this.width/6;
		const height3 = this.height/3;
		const height6 = this.height/6;
		this.context.fillStyle = "white";
		this.context.fillRect(0, 0, this.width, this.height);

		this.context.strokeStyle = "black";
		this.context.lineWidth = 1;
		for(var x = this.width/3;x <= 2*width3;x+=width3) {
			this.context.beginPath();
			this.context.moveTo(x, 0);
			this.context.lineTo(x, this.height);
			this.context.stroke();
		}

		for(var y = this.width/3;y <= 2*height3;y+=height3) {
			this.context.beginPath();
			this.context.moveTo(0, y);
			this.context.lineTo(this.width, y);
			this.context.stroke();
		}

		this.context.font = 11 * this.width/24 + "px Arial";
		this.context.fillStyle = "black"
		this.context.textAlign = "center";
		for(var i = 0, k = 0;i < 3;i++) {
			for(var j = 0;j < 3;j++, k++) {
				if(this.board[k] != 0) {
					const p = this.board[k] == 1 ? "X" : "O";
					this.context.fillText(p, i * width3 + width6, j * height3 + height3);
				}
			}
		}

		this.context.font = width6 + "px Arial";
		this.context.fillStyle = "red";
		this.context.textAlign = "center";
		if(this.winner != 0) {
			console.log(this.win_stat);
			this.context.fillText("Winner: " + (this.winner == 1 ? "X" : "O"), this.width/2, this.height/2);
			this.context.strokeStyle = "red";
			this.context.lineWidth = 5;
			this.context.beginPath();
			this.context.moveTo(width3 * this.win_stat.r1 + width6, height3 * this.win_stat.c1 + height6);
			this.context.lineTo(width3 * this.win_stat.r2 + width6, height3 * this.win_stat.c2 + height6);
			this.context.stroke();
		}
		else if(this.done()) {
			this.context.fillText("Cat's Game", this.width/2, this.height/2);
		}
	}

	onclick(x, y, width, height) {
		const i = Math.floor(3 * x / width);
		const j = Math.floor(3 * y / height);
		const k = i * 3 + j;
		if(this.players[this.playerIdx].ishuman && this.board[k] == 0) {
			this.makeMove(k);
			this.players[this.playerIdx].play();
		}
		// if(this.winner == 0 && this.board[k] == 0) {
		// 	this.board[k] = this.person;
		// 	this.person = -this.person;
		// 	this.checkWinner();
		// 	this.draw();
		// }
	}

	reset(player1, player2) {
		this.board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
		this.person = 1;
		this.winner = 0;
		this.win_stat = {
			r1: 0,
			c1: 0,
			r2: 0,
			c2: 0
		};
		super.reset(player1, player2);
	}

	getCurrentAvailableMoves() {
		var moves = [];
		for(var i = 0;i< 9;i++) {
			if(this.board[i] == 0) {
				moves.push(i);
			}
		}
		return moves;
	}

	makeMove(move) {
		if(this.winner == 0) {
			this.board[move] = this.playerIdx == 0 ? 1 : -1;
			this.playerIdx = this.playerIdx == 0 ? 1 : 0;
			// this.board[move] = this.person;
			// this.person = -this.person;
			this.checkWinner();
			this.draw();
		}
	}

	done() {
		for(var i = 0;i < 9;i++) {
			if(this.board[i] == 0) {
				return false;
			}
		}
		return true;
	}

	checkWinner() {
		var rowsum = [0, 0, 0];
		var colsum = [0, 0, 0];
		var diagsum = [0, 0];
		var i, j, k;
		for(i = 0, k = 0;i < 3;i++) {
			for(j = 0;j < 3;j++, k++) {
				colsum[j] += this.board[k];
				rowsum[i] += this.board[k];
				if(i == j) {
					diagsum[0] += this.board[k];
				}
				if(i + j == 2) {
					diagsum[1] += this.board[k];
				}
			}
		}
		for(i = 0;i < 3;i++) {
			if(Math.abs(rowsum[i]) == 3) {
				this.winner = Math.sign(rowsum[i]);
				this.win_stat = {
					r1: i,
					c1: 0,
					r2: i,
					c2: 2
				};

				return;
			}
			if(Math.abs(colsum[i]) == 3) {
				this.winner =  Math.sign(colsum[i]);
				this.win_stat = {
					r1: 0,
					c1: i,
					r2: 2,
					c2: i
				};
				return;
			}
			if(i < 2 && Math.abs(diagsum[i]) == 3) {
				this.winner = Math.sign(diagsum[i]);
				if(i == 0) {
					this.win_stat = {
						r1: 0, c1:0, r2:2, c2:2
					}
				}
				else {
					this.win_stat = {
						r1: 0, c1:2, r2:2, c2:0
					}
				}
				return;
			}
		}
	}
}

games['tic-tac-toe'] = {
	game_class: TicTacToe,
	game_name: "Tic-Tac-Toe"
};
