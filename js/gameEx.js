class Game {
	constructor(name) {
		this.startScreen = document.querySelector(".screen-start");
		this.gameScreen = document.querySelector(".screen-game");
		this.overScreen = document.querySelector(".screen-over");
		this.grid = document.querySelector(".grid");
		this.resultDisplay = document.querySelector(".results");
		this.audio = document.getElementsByTagName("audio");
		this.nameScreen = document.querySelector(".player");
		this.finalOver = document.querySelector(".over-final");
		this.nameOver = document.querySelector(".name-player-over");
		this.scoreOver = document.querySelector(".score-player-over");

		this.squares = [];
		this.name = name;
		this.results = 0;
		this.currentShooterIndex = 202;
		this.currentLaserIndex = 0;
		this.player = new Player(
			this.name,
			this.results,
			this.currentShooterIndex,
			this.squares
		);
		this.width = 15;
		this.aliensRemoved = [];
		this.timeLeft = 30;
		this.invadersId;
		this.isGoingRight = true;
		this.direction = 1;
		this.alienInvaders = [
			0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 30,
			31, 32, 33, 34, 35, 36, 37, 38, 39,
		];
		this.currentLaserIndex;
		this.song = new Audio("music/screen1.wav");
		this.song.volume = 0.2;
	}

	//dibuja a los aliens
	draw() {
		this.squares = Array.from(document.querySelectorAll(".grid div"));

		for (let i = 0; i < this.alienInvaders.length; i++) {
			if (!this.aliensRemoved.includes(i)) {
				this.squares[this.alienInvaders[i]].classList.add("invader");
			}
		}
	}

	start() {
		//Con esto esconderas la pantalla de inicio y final
		this.startScreen.style.display = "none";
		this.gameScreen.style.display = "flex";
		this.overScreen.style.display = "none";

		this.audio[0].pause();
		this.audio[1].volumen = 0.2;
		this.audio[1].play();
		this.nameScreen.innerHTML = this.name;

		//Creo la grilla
		for (let i = 0; i < this.width * this.width; i++) {
			const square = document.createElement("div");
			this.grid.appendChild(square);
		}

		//creo los invaders

		this.draw();

		this.invadersId = setInterval(() => {
			this.moveInvaders();
		}, 200);
		this.squares[this.currentShooterIndex].classList.add("shooter");
	}

	//elimina a los aliens
	remove() {
		for (let i = 0; i < this.alienInvaders.length; i++) {
			this.squares[this.alienInvaders[i]].classList.remove("invader");
		}
	}

	moveInvaders() {
		const leftEdge = this.alienInvaders[0] % this.width === 0;
		const rightEdge =
			this.alienInvaders[this.alienInvaders.length - 1] % this.width ===
			this.width - 1;
		this.remove();

		if (rightEdge && this.isGoingRight) {
			for (let i = 0; i < this.alienInvaders.length; i++) {
				this.alienInvaders[i] += this.width + 1;
				this.direction = -1;
				this.isGoingRight = false;
			}
		}

		if (leftEdge && !this.isGoingRight) {
			for (let i = 0; i < this.alienInvaders.length; i++) {
				this.alienInvaders[i] += this.width - 1;
				this.direction = 1;
				this.isGoingRight = true;
			}
		}

		for (let i = 0; i < this.alienInvaders.length; i++) {
			this.alienInvaders[i] += this.direction;
		}

		this.draw();

		if (this.squares[this.currentShooterIndex].classList.contains("invader")) {
			//this.resultDisplay.innerHTML = "GAME OVER";
			this.gameOver("GAME OVER");
			clearInterval(this.invadersId);
		}

		if (this.aliensRemoved.length === this.alienInvaders.length) {
			//this.resultDisplay.innerHTML = "YOU WIN";
			this.gameOver("YOU WIN");
			clearInterval(this.invadersId);
		}
	}

	moveShooter(e) {
		this.squares[this.currentShooterIndex].classList.remove("shooter");
		switch (e.key) {
			case "ArrowLeft":
				if (this.currentShooterIndex % this.width !== 0)
					this.currentShooterIndex -= 1;
				break;
			case "ArrowRight":
				if (this.currentShooterIndex % this.width < this.width - 1)
					this.currentShooterIndex += 1;
				break;
		}
		this.squares[this.currentShooterIndex].classList.add("shooter");
	}

	shoot(e) {
		let laserId;
		let currentLaserIndex = this.currentShooterIndex;
		if (e.key === "ArrowUp") {
			laserId = setInterval(() => {
				{
					this.squares[currentLaserIndex].classList.remove("laser");
					currentLaserIndex -= this.width;

					this.squares[currentLaserIndex].classList.add("laser");

					if (this.squares[currentLaserIndex].classList.contains("invader")) {
						this.squares[currentLaserIndex].classList.remove("laser");
						this.squares[currentLaserIndex].classList.remove("invader");
						this.squares[currentLaserIndex].classList.add("boom");

						setTimeout(
							() => this.squares[currentLaserIndex].classList.remove("boom"),
							300
						);
						clearInterval(laserId);

						const alienRemoved = this.alienInvaders.indexOf(currentLaserIndex);
						this.aliensRemoved.push(alienRemoved);
						this.results++;
						this.resultDisplay.innerHTML = this.results;
					}
				}
			}, 100);
		}
	}

	gameOver(msn) {
		this.startScreen.style.display = "none";
		this.gameScreen.style.display = "none";
		this.overScreen.style.display = "flex";

		this.audio[1].pause();
		this.audio[2].volumen = 0.2;
		this.audio[2].play();

		this.finalOver.innerHTML = msn;
		this.nameOver.innerHTML = this.name;
		this.scoreOver.innerHTML = this.results;

		const scoresFromLocal = JSON.parse(localStorage.getItem("highScores"));
		//if there was nothing in the local storage

		if (!scoresFromLocal) {
			//create a high scores in my local storage
			localStorage.setItem("highScores", JSON.stringify([this.results]));
		} else {
			scoresFromLocal.push(this.results);
			//sort high scores from high to low
			scoresFromLocal.sort((a, b) => b - a);
			const topThree = scoresFromLocal.slice(0, 3);
			localStorage.setItem("highScores", JSON.stringify(topThree));
		}

		//displaying the scores on the game over page
		const realHighScores = JSON.parse(localStorage.getItem("highScores"));

		const orderedList = document.createElement("ol");
		realHighScores.forEach((oneScore) => {
			const liElement = document.createElement("li");
			liElement.innerText = `${this.name} ` + oneScore;
			orderedList.appendChild(liElement);
		});
		this.overScreen.appendChild(orderedList);
	}
}
