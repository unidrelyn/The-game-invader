window.onload = function () {
	const startButton = document.getElementById("start-button");
	const restartButton = document.getElementById("restart-button");
	const namePlayer = document.querySelector(".name-player");

	let game;

	startButton.addEventListener("click", function () {
		startGame();
	});
	restartButton.addEventListener("click", function () {
		location.reload();
	});

	function startGame() {
		if (namePlayer.value) {
			game = new Game(namePlayer.value);
			game.start();
		} else {
			alert("Please insert Your Name");
		}
	}

	document.addEventListener("keydown", (e) => game.moveShooter(e));
	document.addEventListener("keydown", (e) => game.shoot(e));
};
