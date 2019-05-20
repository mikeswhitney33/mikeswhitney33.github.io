window.onload = main;



function main() {
	const canvas = document.getElementById("board");
	const game_select = document.getElementById("game-select");
	const reset_btn = document.getElementById("reset-btn");
	const player1_select = document.getElementById("player1-select");
	const player2_select = document.getElementById("player2-select");

	const gameKeys = Object.keys(games);
	console.log(gameKeys);
	for(var i = 0;i < gameKeys.length;i++) {
		var op = document.createElement('option');
		op.value = gameKeys[i];
		op.appendChild(document.createTextNode(games[gameKeys[i]].game_name));
		game_select.appendChild(op);
	}


	const context = canvas.getContext("2d");

	var game;
	function update_game() {
		game = new games[game_select.value].game_class(canvas, context, playerClasses[player1_select.value],playerClasses[player2_select.value]);
	}

	function reset() {
		game.reset( playerClasses[player1_select.value], playerClasses[player2_select.value]);
	}

	canvas.addEventListener("click", function(event) {
		const rect = canvas.getBoundingClientRect();
		const width = rect.width;
		const height = rect.height;
		const mouseX = event.clientX - rect.left;
		const mouseY = event.clientY - rect.top;
		game.onclick(mouseX, mouseY, width, height);
	});

	reset_btn.addEventListener("click", reset);
	player1_select.addEventListener("change", update_game);
	player2_select.addEventListener("change", update_game);

	game_select.addEventListener("change", function(event) {
		update_game();
	});

	update_game();
}
