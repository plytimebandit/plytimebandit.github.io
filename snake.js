window.onload = function() {
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;
    const SPACE = 32;

    const WIDTH = 600
    const HEIGHT = 400
    const PIXEL_SIZE = WIDTH / 64

    const COLOR_SNAKE = '#ec633a';
    const COLOR_BG = '#242628';
    const COLOR_GAMEOVER = '#FF0000';
    const COLOR_FOOD = '#00FF00';
    const COLOR_POINTS = '#FFFFFF'

    // first elemet = tail; last element = head
    var snake = [
        [10, 10], [11, 10], [12, 10], [13, 10], [14, 10]
    ]
    var snakeDefault = snake.slice();
    var direction = RIGHT
    var foodCoords = getNewFoodCoords();

    var started = false;
    var gameOver = false;
    var directionChangeFreeze = false;
    var growSnake = false;
    var points = 0;
    var timer = 'undefined';

    updateUI();

    window.onkeydown = function(e) {
        if (gameOver) {
            snake = snakeDefault.slice();
            gameOver = false;
            started = false;
            direction = RIGHT;
            updateUI();
        } else if (started) {
            if (e.keyCode >= LEFT && e.keyCode <= DOWN) {
                if (directionChangeIsAllowed(e.keyCode)) {
                    direction = e.keyCode;
                    directionChangeFreeze = true;
                }
            } else if (e.keyCode == SPACE) {
                clearInterval(timer);
                started = false;
            }
        } else {
            timer = setInterval(snakeTimer, 100);
            started = true;
            gameOver = false;
        }
    }

    function directionChangeIsAllowed(keyCode) {
        if (directionChangeFreeze) {
            return false;
        }
        if (direction == RIGHT && keyCode != LEFT) {
            return true;
        }
        if (direction == LEFT && keyCode != RIGHT) {
            return true;
        }
        if (direction == UP && keyCode != DOWN) {
            return true;
        }
        if (direction == DOWN && keyCode != UP) {
            return true;
        }
        return false;
    }

    function snakeTimer() {
        stepSnake();
        checkCollision();
        updateUI();
    }

    function checkCollision() {
        var snakesHead = snake[snake.length - 1];
        var snakesHeadX = snakesHead[0];
        var snakesHeadY = snakesHead[1];

        // wall collisions
        if (snakesHeadX * PIXEL_SIZE >= WIDTH || snakesHeadX < 0) {
            gameOver = true;
        }
        if (snakesHeadY * PIXEL_SIZE >= HEIGHT || snakesHeadY < 0) {
            gameOver = true;
        }

        // collision with itself
        var justTail = snake.slice(0, snake.length-1);
        justTail.forEach(function(e) {
            if (e[0] == snakesHeadX && e[1] == snakesHeadY) {
                gameOver = true;
            }
        });

        // collected food
        if (snakesHeadX == foodCoords[0] && snakesHeadY == foodCoords[1]) {
            growSnake = true;
            points += 1;
            foodCoords = getNewFoodCoords();
        }

        if (gameOver) {
            clearInterval(timer);
        }
    }

    function stepSnake() {
        if (!growSnake) {
            snake.shift();
        }
        growSnake = false;

        var snakesHead = snake[snake.length - 1];

        var newX = snakesHead[0];
        var newY = snakesHead[1];
        if (direction == UP) {
            newY -= 1;
        } else if (direction == DOWN) {
            newY += 1;
        } else if (direction == LEFT) {
            newX -= 1;
        } else if (direction == RIGHT) {
            newX += 1;
        }
        snake.push([newX, newY]);
        directionChangeFreeze = false;
    }

    function updateUI() {
        var canvas = document.getElementById("snakeCanvas");
        var ctx = canvas.getContext("2d");

        if (gameOver) {
            ctx.fillStyle = COLOR_GAMEOVER;
            ctx.font = "30px Arial";
            ctx.textAlign = "center";
            ctx.fillText("Game Over", WIDTH/2, HEIGHT/2);
        } else {
            ctx.fillStyle = COLOR_BG;
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            ctx.fillStyle = COLOR_FOOD;
            ctx.fillRect(foodCoords[0]*PIXEL_SIZE+1, foodCoords[1]*PIXEL_SIZE+1, PIXEL_SIZE-2, PIXEL_SIZE-2);

            ctx.fillStyle = COLOR_SNAKE;
            snake.forEach(function(e) {
                ctx.fillRect(e[0]*PIXEL_SIZE+1, e[1]*PIXEL_SIZE+1, PIXEL_SIZE-2, PIXEL_SIZE-2);
            });

            ctx.fillStyle = COLOR_POINTS;
            ctx.font = "12px Arial";
            ctx.textAlign = "start";
            ctx.fillText("Points: " + points, 2, 12);
        }
    }

    function getNewFoodCoords() {
        var foodX = getRandomInt(WIDTH / PIXEL_SIZE);
        var foodY = getRandomInt(HEIGHT / PIXEL_SIZE);

        return [foodX, foodY];
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
}
