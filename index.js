const canvas = document.getElementById("gameBoard"); // get canvas
const gameBoard_ctx = canvas.getContext("2d"); //in order to draw on the screen, ask canvas for the context

class SnakeBody {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

let snakeSpeed = 7;

let cellCount = 20; //amount of cells (board); 20 vertically and 20 horizontally
let cellSize = canvas.width / cellCount -2; // 
let headX = 10; //position of the snake's head on X-axis
let headY = 10; //position of the snake's head on Y-axis
const snakeBodyParts = []; // we make it constat b/c we won't remove this array, we will just modify it
let tailLenght = 2; // when snake gets moving, it will automatically have 2 tail pieces

let foodX = 5;
let foodY = 5;

let xDirection = 0; // up or down
let yDirection = 0; // left or right

let score= 0;

const sound = new Audio("gulp.mp3");
const gameOverSound = new Audio("Mission-failed-sound-effect.mp3");

//Set game loop that will continiously update the screen 
function drawGame() {
    changeSnakePosition();
    let result = isGameOver();
    if(result) {
        return;
    }
    clearScreen();
    checkFoodCollision();
    drawFood();
    drawSnake();
    drawScore();
    setTimeout(drawGame, 1000/snakeSpeed); // how fast the snake moves
}

function isGameOver() {
    let gameOver = false; //equals false by default

    // walls
    //left side of the board
    if(headX < 0) {
        gameOver = true;
        gameOverSound.play();
    }
    //right side of the board
    else if(headX === cellCount) {
        gameOver = true; 
        gameOverSound.play();
    }
    // bottom of the board
    else if(headY < 0) {
        gameOver = true;
        gameOverSound.play();
    }
    // top of the board
    else if(headY === cellCount) {
        gameOver = true;
        gameOverSound.play();
    }

    if(gameOver) {
        gameBoard_ctx.fillStyle = "white";
        gameBoard_ctx.font = "3.5rem Roboto";
        gameBoard_ctx.fillText("Game Over!", canvas.width / 6.5, canvas.height / 2);
        
    }
    return gameOver;
}

function drawScore() {
    gameBoard_ctx.fillStyle = "white";
    gameBoard_ctx.font = "0.8rem Roboto";
    gameBoard_ctx.fillText("Score " + score, canvas.width - 50, 15)
}

function clearScreen() {
    gameBoard_ctx.fillStyle = "black";
    gameBoard_ctx.fillRect(0,0,canvas.width,canvas.height);
}

function drawSnake() {
    gameBoard_ctx.fillStyle = "purple";
    for(let i = 0; i < snakeBodyParts.length; i++) {
        let part = snakeBodyParts[i]; // get the item for that array; represents our part
        gameBoard_ctx.fillRect(part.x * cellCount, part.y * cellCount, cellSize, cellSize);
    }

    // put an item at the end of the list next to the head
    snakeBodyParts.push(new SnakeBody(headX, headY)); // where the head was
    if(snakeBodyParts.length > tailLenght) {
        snakeBodyParts.shift(); // remove the furthest item from the snake body parts if have more than our tail size
    }

    gameBoard_ctx.fillStyle = "purple";
    gameBoard_ctx.fillRect(headX * cellCount, headY * cellCount, cellSize, cellSize) // headX and headY multiplied by cellCount b/c the snake sould be within the board

}

function changeSnakePosition() {
    headX = headX + xDirection; // move snake's head left or right
    headY = headY + yDirection; // move snake's head up or down
}

function drawFood() {
    gameBoard_ctx.fillStyle = "white";
    gameBoard_ctx.fillRect(foodX * cellCount, foodY * cellCount, cellSize, cellSize)
}

function checkFoodCollision() {
    if(foodX === headX && foodY === headY) {
        foodX = Math.floor(Math.random() * cellCount); // get the random position of the food within the board game
        foodY = Math.floor(Math.random() * cellCount);
        tailLenght++; // if there is a collision we will increase the tail length
        score++;
        sound.play();
    }
}

document.body.addEventListener('keydown', keyDown);

function keyDown(event) {
    //go up
    if(event.keyCode == 38) {
        if(yDirection == 1)  // if I am moving down, I cannot move up
            return; // by writing return we exit keyDown function
        yDirection = -1;
        xDirection = 0;
    }

    //go down
    if(event.keyCode == 40) {
        if(yDirection == -1) // if I am moving up, I cannot move down
            return;
        yDirection = 1;
        xDirection = 0;
    }

    // go left 
    if(event.keyCode == 37) {
        if(xDirection == 1)
            return;
        yDirection = 0;
        xDirection = -1;
    }

    // go right 
    if(event.keyCode == 39) {
        if(xDirection == -1)
            return;
        yDirection = 0;
        xDirection = 1;
    }

    if(event.keyCode === 32) {
        location.reload();
    }
}

drawGame();