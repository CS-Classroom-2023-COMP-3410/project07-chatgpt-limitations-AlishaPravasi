document.addEventListener("DOMContentLoaded", () => {
  const gameGrid = document.getElementById("game-grid");
  const moveCounter = document.getElementById("move-counter");
  const timer = document.getElementById("timer");
  const startButton = document.getElementById("start-button");
  const restartButton = document.getElementById("restart-button");
  const gameContainer = document.querySelector(".game-container");

  const cards = [
    "🍎", "🍎", "🍌", "🍌", "🍇", "🍇", "🍓", "🍓",
    "🍒", "🍒", "🍍", "🍍", "🥝", "🥝", "🍉", "🍉"
  ];

  const fruitDanceMap = {
    "🍎": "pivot-dance",
    "🍌": "bounce-dance",
    "🍇": "top-pivot-dance",
    "🍓": "surprise-dance",
    "🍒": "swing-dance",
    "🍍": "jitter-dance",
    "🥝": "spin-dance",
    "🍉": "float-dance"
  };

  let flippedCards = [];
  let matchedPairs = 0;
  let moves = 0;
  let gameTimer = null;
  let secondsElapsed = 0;
  let gameStarted = false;

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function initializeGame() {
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    secondsElapsed = 0;
    moveCounter.textContent = moves;
    timer.textContent = "0:00";
    clearInterval(gameTimer);
    gameGrid.innerHTML = "";
    gameStarted = true;
    restartButton.disabled = false;
    startButton.disabled = true;

    shuffle(cards).forEach(card => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");

        const cardInner = document.createElement("div");
        cardInner.classList.add("card-inner");

        const cardFront = document.createElement("div");
        cardFront.classList.add("card-front");

        const cardBack = document.createElement("div");
        cardBack.classList.add("card-back");

        const fruitSpan = document.createElement("span");
        fruitSpan.textContent = card;
        fruitSpan.classList.add(fruitDanceMap[card]);
        cardBack.appendChild(fruitSpan);

        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        cardElement.appendChild(cardInner);

        cardElement.addEventListener("click", flipCard);
        gameGrid.appendChild(cardElement);
    });

    adjustGridSize();
    generateFruitBorder();
    startTimer();
  }

  function startTimer() {
    clearInterval(gameTimer);
    secondsElapsed = 0;
    gameTimer = setInterval(() => {
        secondsElapsed++;
        const minutes = Math.floor(secondsElapsed / 60);
        const seconds = secondsElapsed % 60;
        timer.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }, 1000);
  }

  function flipCard() {
    if (!gameStarted || flippedCards.length === 2) return;

    const card = this.querySelector('.card-inner');

    if (!this.classList.contains("flip")) {
        this.classList.add("flip");
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            moves++;
            moveCounter.textContent = moves;
            checkForMatch();
        }
    }
  }

  function checkForMatch() {
    const [card1, card2] = flippedCards;
    const cardBack1 = card1.querySelector(".card-back");
    const cardBack2 = card2.querySelector(".card-back");

    if (cardBack1.textContent === cardBack2.textContent) {
        card1.classList.add("match");
        card2.classList.add("match");

        matchedPairs++;
        flippedCards = [];

        if (matchedPairs === cards.length / 2) {
            clearInterval(gameTimer);
            setTimeout(() => {
                triggerConfetti();
                alert(`🎉 Congratulations! You completed the game in ${moves} moves and ${timer.textContent}.`);
            }, 500);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove("flip");
            card2.classList.remove("flip");
            flippedCards = [];
        }, 1000);
    }
  }

  function triggerConfetti() {
    const confettiContainer = document.createElement("div");
    confettiContainer.classList.add("confetti-container");
    document.body.appendChild(confettiContainer);

    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement("div");
        confetti.classList.add("confetti");

        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
        confetti.style.animationDelay = `${Math.random()}s`;

        confettiContainer.appendChild(confetti);
    }

    setTimeout(() => {
        confettiContainer.remove();
    }, 5000);
  }

  function adjustGridSize() {
    const cardSize = Math.min(window.innerWidth / 6, window.innerHeight / 6);
    document.querySelectorAll(".card").forEach(card => {
      card.style.width = `${cardSize}px`;
      card.style.height = `${cardSize}px`;
    });
  }

  function generateFruitBorder() {
    let fruitBorderContainer = document.querySelector(".fruit-border");
    if (!fruitBorderContainer) {
        fruitBorderContainer = document.createElement("div");
        fruitBorderContainer.classList.add("fruit-border");
        document.body.appendChild(fruitBorderContainer);
    }

    fruitBorderContainer.innerHTML = "";
    fruitBorderContainer.style.zIndex = "9999";

    const fruitOptions = ["🍎", "🍌", "🍇", "🍓", "🍒", "🍍", "🥝", "🍉"];
    const fruitSize = 30;
    const gameRect = gameContainer.getBoundingClientRect();

    function createFruit(x, y) {
        const fruitItem = document.createElement("div");
        fruitItem.classList.add("fruit-item");
        fruitItem.textContent = fruitOptions[Math.floor(Math.random() * fruitOptions.length)];
        fruitItem.style.position = "absolute";
        fruitItem.style.left = `${x}px`;
        fruitItem.style.top = `${y}px`;
        fruitItem.style.fontSize = `${fruitSize}px`;

        fruitBorderContainer.appendChild(fruitItem);
    }

    for (let x = gameRect.left - fruitSize; x < gameRect.right + fruitSize; x += fruitSize * 1.5) {
        createFruit(x, gameRect.top - fruitSize);
        createFruit(x, gameRect.bottom);
    }

    for (let y = gameRect.top - fruitSize; y < gameRect.bottom + fruitSize; y += fruitSize * 1.5) {
        createFruit(gameRect.left - fruitSize, y);
        createFruit(gameRect.right, y);
    }
  }

  function handleResize() {
    gameContainer.style.width = `${Math.min(90, window.innerWidth * 0.9)}vw`;
    gameContainer.style.height = `${Math.min(80, window.innerHeight * 0.8)}vh`;
    adjustGridSize();
    generateFruitBorder();
  }

  startButton.addEventListener("click", initializeGame);
  restartButton.addEventListener("click", initializeGame);
  window.addEventListener("resize", handleResize);
});
