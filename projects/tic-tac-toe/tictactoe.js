const symbols = [' ', 'X', 'O'];

window.onload = function(event) {
	const canvas = document.getElementById("board");
	const resetBtn = document.getElementById("reset-btn");
	const currentPlayerDisplay = document.getElementById("currentPlayer");
	const context = canvas.getContext("2d");
	var board = [
		0, 0, 0,
		0, 0, 0,
		0, 0, 0
	];
	drawBoard(canvas, context, board);

	var player = 1;
	var winner = 0;

	currentPlayerDisplay.innerHTML = symbols[player];
	canvas.addEventListener("click", function(event) {
		const width = canvas.width;
		const height = canvas.height;
		const rect = canvas.getBoundingClientRect();
		const mouseX = event.clientX - rect.left;
		const mouseY = event.clientY - rect.top;
		if(!done(board) && winner == 0) {
			for(var i = 0;i < 9;i++) {
				const x = i % 3;
				const y = Math.trunc(i / 3);
				if(mouseX > x * width / 3 && mouseX <= (x+1) * width / 3 &&
					mouseY > y * height / 3 && mouseY <= (y+1) * height / 3) {
					board[i] = player;
					player = player == 1 ? 2 : 1;
					drawBoard(canvas, context, board);
				}
				winner = findWinner(canvas, context, board);
			}
			currentPlayerDisplay.innerHTML = symbols[player];
		}
		context.font = width/6 + "px Arial";
		context.fillStyle = "red";
		context.textAlign = "center";
		if(winner != 0) {
			context.fillText("Winner: " + symbols[winner], width/2, height/2);
			currentPlayerDisplay.innerHTML = symbols[winner];
		}
		else if(done(board)) {
			context.fillText("Cat's Game", width/2, height/2);
			currentPlayerDisplay.innerHTML = symbols[winner];
		}
	});


	resetBtn.addEventListener("click", function () {
		for(var i = 0;i < 9;i++) {
			board[i] = 0;
		}
		winner = 0;
		player = 1;
		currentPlayerDisplay.innerHTML = symbols[player];
		drawBoard(canvas, context, board);
	});
};

function drawWin(canvas, context, start, end) {
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
				drawWin(canvas, context, i * 3, i * 3 + j);
				return true;
			}
			if(col == 3) {
				drawWin(canvas, context, i, j * 3 + i);
				return true;
			}
		}
	}
	if(board[0] == player && board[4] == player && board[8] == player) {
		drawWin(canvas, context, 0, 8);
		return true;
	}
	if(board[2] == player && board[4] == player && board[6] == player) {
		drawWin(canvas, context, 2, 6);
		return true;
	}
	return false;
}

function findWinner(canvas, context, board) {
	if(isWinner(canvas, context, 1, board)) {
		return 1;
	}
	if(isWinner(canvas, context, 2, board)) {
		return 2;
	}
	return 0;
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
