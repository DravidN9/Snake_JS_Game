// DOM Elements
const board = document.querySelector('.board');
const blockHeight = 50;
const blockWidth = 50;

let modal = document.querySelector('.modal');
let startBtn = document.querySelector('.btn-start');
let startGameModal = document.querySelector('.start-game');
let gameOverModal = document.querySelector('.game-over');
let restartBtn = document.querySelector('.btn-restart');

let currentScore = document.querySelector('#current-score');
let highScore = document.querySelector('#high-score');
let timer = document.querySelector('#time');
// Game board dimensions
let cols = Math.floor(board.clientWidth / blockWidth);
let rows = Math.floor(board.clientHeight / blockHeight);

// Game state
let snake = [{x: 1, y: 3}];
let blocks = [];
let direction = 'right';
let food = {x:Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols)};

// Score and timing
let score = 0;



let highestScore = `${localStorage.getItem('highScore') ? localStorage.getItem('highScore') : 0}`;
// yahan par local storage se high score ko retrieve kar rahe hain, agar high score exist karta hai 
// toh usko parse karke integer me convert kar ke highestScore variable me store kar rahe hain,
//  agar high score exist nahi karta hai toh highestScore variable ko 0 se initialize kar rahe hain.
highScore.textContent = `${highestScore}`;
let time = `00-00`;

let intervalId = null;
let timerIntervalId = null;
// Initialize game board with grid blocks
for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    const block = document.createElement('div');
    block.classList.add('block');
    
    board.appendChild(block);
    block.innerText = `${i}-${j}`;

    blocks[`${i}-${j}`] = block;
  }
}

// Handle arrow key input for snake direction
addEventListener('keydown', (event) => {
  if(event.key === 'ArrowLeft'){
    direction = 'left';
  }
  else if(event.key === 'ArrowRight'){
    direction = 'right';
  }
  else if(event.key === 'ArrowUp'){
    direction = 'up';
  }
  else if(event.key === 'ArrowDown'){
    direction = 'down';
  } 
});

// Main game render function
function render(){
  let head = null;

  // Display food on board
  blocks[`${food.x}-${food.y}`].classList.add('food');

  // Calculate new head position based on direction
  if(direction=='left'){
    head = {x: snake[0].x, y: snake[0].y - 1};
  }
  else if(direction=='right'){
    head = {x: snake[0].x, y: snake[0].y + 1};
  }
  else if(direction=='up'){
    head = {x: snake[0].x - 1, y: snake[0].y};
  }
  else if(direction=='down'){
    head = {x: snake[0].x + 1, y: snake[0].y};
  }

  // Check collision with walls - game over
  if(head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols){
    clearInterval(intervalId);

    modal.style.display = 'flex';
    startGameModal.style.display = 'none';
    gameOverModal.style.display = 'flex';

    return;
  }

  // Check collision with food
  if(head.x === food.x && head.y === food.y){
    blocks[`${food.x}-${food.y}`].classList.remove('food');
    food = {x:Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols)};
    blocks[`${food.x}-${food.y}`].classList.add('food');

    snake.unshift(head);

    score+=10;
    currentScore.textContent = `${score}`;

    if(score > highestScore){
      highestScore = score;
     localStorage.setItem('highScore', highestScore.toString());
    }

  }


  // Update snake position on board
  snake.forEach(part => {
    blocks[`${part.x}-${part.y}`].classList.remove('fill');
  });

  snake.unshift(head);
  snake.pop();
  
  snake.forEach(part => {
    blocks[`${part.x}-${part.y}`].classList.add('fill');
  });
}


// Start game on button click
startBtn.addEventListener('click', () => {
  modal.style.display = 'none';
  intervalId = setInterval(() => {
    render();
  }, 400);
timerIntervalId = setInterval(() => {
let [min, sec]= time.split('-').map(Number);
if(sec==59){
min +=1;
sec=0;
}
else{
sec+=1;
}
  time = `${min}-${sec}`;
  timer.textContent = `${time}`;

},1000);
  
});

restartBtn.addEventListener('click', restartGame);

// Restart game function
function restartGame(){  
  blocks[`${food.x}-${food.y}`].classList.remove('food');
  snake.forEach(part => {
    blocks[`${part.x}-${part.y}`].classList.remove('fill');
  });
  score = 0;
  time = `00-00`;
  direction = 'right';
  modal.style.display = 'none';
  gameOverModal.style.display = 'none';
  snake = [{x: 1, y: 3}];
  food = {x:Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols)};

  intervalId = setInterval(() => {
    render();
  }, 400);
}
