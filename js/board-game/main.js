window.onload = main


function setOptions(select, options)
{
    let keys = Object.keys(options);
    for(var i = 0;i < keys.length;i++)
    {
        var op = document.createElement('option');
		op.value = keys[i];
		op.appendChild(document.createTextNode(options[keys[i]].name));
		select.appendChild(op);
    }
}


function main()
{
    let canvas = document.getElementById("board");
    let context = canvas.getContext("2d");
    let gameSelect = document.getElementById("game-select");
    let player1Select = document.getElementById("player1-select");
    let player2Select = document.getElementById("player2-select");
    let resetBtn = document.getElementById("reset-btn");


    let gameOptions =
    {
        "tictactoe":{
            "name":"TicTacToe",
            "game":TicTacToe
        },
        "othello":{
            "name":"Othello/Reversi",
            "game":Othello
        }
    }

    let playerOptions =
    {
        "human":{
            "name":"Human",
            "player":HumanPlayer
        },
        "randomai":{
            "name":"Random AI",
            "player":RandomAI
        },
        "minimax":{
            "name":"Minimax",
            "player":Minimax
        }
    }
    setOptions(gameSelect, gameOptions);
    setOptions(player1Select, playerOptions);
    setOptions(player2Select, playerOptions);

    function updatePlayer(p)
    {
        player = p;
        players[player].makeMove(game);
    }

    var player;;
    var players;

    function resetGame()
    {
        game = new gameOptions[gameSelect.value].game(context, canvas);
        game.draw();

        players = {
            1: new playerOptions[player1Select.value].player(1, updatePlayer),
            2: new playerOptions[player2Select.value].player(2, updatePlayer)
        };
        updatePlayer(1);
    }

    canvas.addEventListener("click", function(event) {
		const rect = canvas.getBoundingClientRect();
		const width = rect.width;
		const height = rect.height;
		const mouseX = event.clientX - rect.left;
		const mouseY = event.clientY - rect.top;
        move = game.clickToMove(mouseX, mouseY, width, height);
        updatePlayer(game.makeMove(player, move));
    });

    resetBtn.addEventListener("click", resetGame);
    gameSelect.addEventListener("change", resetGame);
    player1Select.addEventListener("change", resetGame);
    player2Select.addEventListener("change", resetGame);
    resetGame();
}