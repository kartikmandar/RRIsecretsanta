// Background Music
const backgroundMusic = document.getElementById("background-music");


window.onload = () => {
  document.body.addEventListener("click", () => {
    if (backgroundMusic.paused) {
      backgroundMusic.play();
    }
  }, { once: true });
};

// Word Groups (Unique words only)
const words = [
  {
    group: "Sorcerer's Stone",
    words: ["Quirrell", "Mirror", "Philosopher", "Fluffy", "Dursley", "Nicholas", "Sorcerer", "Chess", "Troll", "Hagrid"],
  },
  {
    group: "Chamber of Secrets",
    words: ["Basilisk", "Lockhart", "Petrified", "Polyjuice", "TomRiddle", "Fawkes", "Diary", "Mandrake", "Ginny", "Spider"],
  },
  {
    group: "Prisoner of Azkaban",
    words: ["Dementor", "Lupin", "Patronus", "TimeTurner", "Buckbeak", "Sirius", "Werewolf", "Boggart", "KnightBus", "Azkaban"],
  },
  {
    group: "Goblet of Fire",
    words: ["Cedric", "Maze", "Portkey", "Beauxbatons", "Durmstrang", "Triwizard", "Dragons", "RitaSkeeter", "Graveyard", "Gillyweed"],
  },
  {
    group: "Order of the Phoenix",
    words: ["Umbridge", "DA", "Prophecy", "Thestral", "Marietta", "Ministry", "Occlumency", "Room", "Veil", "StMungos"],
  },
  {
    group: "Half-Blood Prince",
    words: ["Horcrux", "Sectumsempra", "FelixFelicis", "Inferi", "SlugClub", "Riddle", "Potion", "Dumbledore", "Snape", "Cave"],
  },
  {
    group: "Deathly Hallows Part 1",
    words: ["Snatcher", "Locket", "Xenophilius", "Dobby", "Hallow", "Doe", "Tent", "Godric's", "Bathilda", "Sword"],
  },
  {
    group: "Deathly Hallows Part 2",
    words: ["Nagini", "Resurrection", "ElderWand", "Battle", "Harry", "Neville", "Bellatrix", "Voldemort", "Hogwarts", "Fiendfyre"],
  },
];

// Game Variables
let selectedWords = [];
let correctGroups = 0;
let timeLeft = 900; // 15 minutes in seconds
let timerInterval;
let incorrectAttempts = 0; // Track the number of incorrect guesses

// Sounds
const correctSound = document.getElementById("correct-sound");
const incorrectSound = document.getElementById("incorrect-sound");
const gameOverSound = document.getElementById("gameover-sound");

// Shuffle Words
const shuffledWords = words.flatMap((group) => group.words).sort(() => Math.random() - 0.5);

// DOM Elements
const grid = document.getElementById("grid");
const validateBtn = document.getElementById("validate-btn");
const status = document.getElementById("status");
const timerElement = document.getElementById("time-left");
const restartBtn = document.getElementById("restart-btn");

// Render the Grid
function renderGrid() {
  grid.innerHTML = "";
  shuffledWords.forEach((word) => {
    const tile = document.createElement("div");
    tile.className = "word-tile";
    tile.textContent = word;
    tile.onclick = () => selectWord(tile, word);
    grid.appendChild(tile);
  });
}

// Select Words
function selectWord(tile, word) {
  if (tile.classList.contains("selected")) {
    tile.classList.remove("selected");
    selectedWords = selectedWords.filter((w) => w !== word);
  } else {
    tile.classList.add("selected");
    selectedWords.push(word);
  }
  validateBtn.disabled = selectedWords.length !== 10;
}

// Validate Selected Group
function validateGroup() {
  const matchedGroup = words.find((group) =>
    group.words.every((word) => selectedWords.includes(word))
  );

  if (matchedGroup) {
    // Correct Group
    status.textContent = "Correct Group!";
    playSound(correctSound);
    correctGroups++;
    selectedWords.forEach((word) => {
      const tile = [...grid.children].find((t) => t.textContent === word);
      tile.classList.add("correct");
      tile.classList.remove("selected");
      tile.onclick = null; // Can't reselect correct words
    });
  } else {
    // Incorrect Group
    status.textContent = "Incorrect Group!";
    playSound(incorrectSound);
    incorrectAttempts++; // Increment incorrect attempts

    selectedWords.forEach((word) => {
      const tile = [...grid.children].find((t) => t.textContent === word);
      tile.classList.add("incorrect");
      tile.classList.remove("selected");
      setTimeout(() => tile.classList.remove("incorrect"), 500);
    });

    // If user reaches 10 incorrect attempts, give a hint
    if (incorrectAttempts === 10) {
      alert("Hint: The connections are actually the Harry Potter movies!");
    }
  }

  // Clear selected words after checking
  selectedWords = [];
  validateBtn.disabled = true;

  if (correctGroups === words.length) {
    gameOver("You Win! 🎉");
  }
}

// Timer Function
function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;
    if (timeLeft === 0) gameOver("Time's Up! ⏰");
  }, 1000);
}

// Game Over
function gameOver(message) {
  clearInterval(timerInterval);
  status.textContent = message;
  playSound(gameOverSound);
  validateBtn.style.display = "none";
  restartBtn.style.display = "inline-block";

  // If the user won the game, show the pop-up message.
  if (message.includes("You Win")) {
    alert("Kick it so hard that it shoots up in the sky");
  }
}

// Play Sound Helper
function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

// Restart Game
function restartGame() {
  location.reload();
}

// Event Listeners
validateBtn.onclick = validateGroup;
restartBtn.onclick = restartGame;

// Initialize Game
renderGrid();
startTimer();
