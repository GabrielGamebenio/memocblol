const levels = [
  { name: 'Fácil', pairs: 6 },
  { name: 'Médio', pairs: 8 },
  { name: 'Difícil', pairs: 10 }
];

const cardsArray = [
  { name: 'Pele', img: './img/pele.jpg' },
  { name: 'Zidane', img: './img/zidane.jpg' },
  { name: 'Messi', img: './img/messi.jpg' },
  { name: 'Neymar', img: './img/neymar.jpg' },
  { name: 'Cristiano Ronaldo', img: './img/c_ronaldo.jpg' },
  { name: 'Modric', img: './img/modric.jpg' },
  { name: 'Mbappe', img: './img/mbappe.jpg' },
  { name: 'Kaka', img: './img/kaka.jpg' },
  { name: 'Maradona', img: './img/maradona.jpg' },
  { name: 'Romario', img: './img/romario.jpg' }
];

let gameBoard = document.getElementById('game-board');
let resetButton = document.getElementById('reset');
let timerElement = document.getElementById('timer');
let rankingList = document.getElementById('ranking-list');
let loginScreen = document.getElementById('login-screen');
let gameScreen = document.getElementById('game-screen');
let loginForm = document.getElementById('login-form');
let efficiencyElement = document.getElementById('efficiency');
let errorsElement = document.getElementById('errors');
let matchesElement = document.getElementById('matches');
let levelElement = document.getElementById('level');

let cards = [];
let flippedCards = [];
let matchedCards = [];
let timer;
let timeElapsed = 0;
let playerName = '';
let playerEmail = '';
let errors = 0;
let matches = 0;
let currentLevel = 0;

function startGame() {
  resetGame();
  createCards();
  shuffleCards();
  displayCards();
  startTimer();
  loadRanking();
}

function resetGame() {
  clearInterval(timer);
  timeElapsed = 0;
  timerElement.textContent = "00:00";
  errors = 0;
  matches = 0;
  errorsElement.textContent = errors;
  matchesElement.textContent = matches;
  efficiencyElement.textContent = "100%";
  flippedCards = [];
  matchedCards = [];
}

function createCards() {
  cards = [];
  let numPairs = levels[currentLevel].pairs;
  for (let i = 0; i < numPairs; i++) {
      cards.push({ name: cardsArray[i].name, img: cardsArray[i].img });
      cards.push({ name: cardsArray[i].name, img: cardsArray[i].img });
  }
}

function shuffleCards() {
  cards.sort(() => 0.5 - Math.random());
}

function displayCards() {
  gameBoard.innerHTML = '';
  cards.forEach((card, index) => {
      gameBoard.innerHTML += `
          <div class="card" data-name="${card.name}">
              <div class="card-inner">
                  <div class="card-front">?</div>
                  <div class="card-back">
                      <img src="${card.img}" alt="${card.name}">
                  </div>
              </div>
          </div>
      `;
  });
  document.querySelectorAll('.card').forEach(card => card.addEventListener('click', flipCard));
}

function flipCard() {
  if (this.classList.contains('flip') || flippedCards.length === 2) return;
  this.classList.add('flip');
  flippedCards.push(this);

  if (flippedCards.length === 2) {
      checkMatch();
  }
}

function checkMatch() {
  if (flippedCards[0].dataset.name === flippedCards[1].dataset.name) {
      matchedCards.push(...flippedCards);
      matches++;
      matchesElement.textContent = matches;
      flippedCards = [];
      updateEfficiency();
      if (matchedCards.length === cards.length) {
          clearInterval(timer);
          advanceLevel();
      }
  } else {
      setTimeout(() => {
          flippedCards.forEach(card => card.classList.remove('flip'));
          flippedCards = [];
      }, 1000);
      errors++;
      errorsElement.textContent = errors;
      updateEfficiency();
  }
}

function startTimer() {
  clearInterval(timer);
  timeElapsed = 0;
  timer = setInterval(() => {
      timeElapsed++;
      let minutes = Math.floor(timeElapsed / 60).toString().padStart(2, '0');
      let seconds = (timeElapsed % 60).toString().padStart(2, '0');
      timerElement.textContent = `${minutes}:${seconds}`;
  }, 1000);
}

function updateEfficiency() {
  let totalMoves = errors + matches;
  let efficiency = ((matches / totalMoves) * 100).toFixed(2);
  efficiencyElement.textContent = `${efficiency}%`;
}

function advanceLevel() {
  if (currentLevel < levels.length - 1) {
      currentLevel++;
      levelElement.textContent = currentLevel + 1;
      startGame();
  } else {
      alert("Parabéns! Você completou todos os níveis.");
  }
}

// Event listeners
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  playerName = document.getElementById('name').value;
  playerEmail = document.getElementById('email').value;
  loginScreen.style.display = 'none';
  gameScreen.style.display = 'block';
  startGame();
});

resetButton.addEventListener('click', startGame);
