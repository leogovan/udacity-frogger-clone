var gameStatus = ["Game On", "Game Over"];

// Enemies our player must avoid
var Enemy = function(x, y) {
    // Setting the Enemy initial location
    this.x = x;
    this.y = y;
    // Generating random speed value
    var enemySpeed = Math.round(Math.random() * (350 - 10) + 50);
    // Setting the Enemy speed value
    this.speed = enemySpeed;
    // Loading the enemy image
    this.sprite = 'images/enemy-bug.png';
    // Setting the enemy collision area
    this.width = 50;
    this.height = 50;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x += this.speed * dt;
    // resets enemy position once it reaches end of board
    if (this.x > 500) {
        this.x = -80;
    }
    // Runs at each update to check for collisions
    this.collisions();
};

// Helper function to see enemy/player box area
function drawBox(x, y, width, height, color) {
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.stroke();
}

// Draws the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    // draws boxes around enemy objects
    drawBox(this.x, this.y + 77, 100, 67, "yellow");
};

// Collisions - this is bound to an instance of the enemy
Enemy.prototype.collisions = function() {
    var enemyBox = {
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height
    };
    var playerBox = {
        x: player.x,
        y: player.y,
        width: player.width,
        height: player.height
    };
    if (enemyBox.x < playerBox.x + playerBox.width &&
        enemyBox.x + enemyBox.width > playerBox.x &&
        enemyBox.y < playerBox.y + playerBox.height &&
        enemyBox.height + enemyBox.y > playerBox.y) {
        // collision detected!
        //console.log("Collision is detected.");
        player.collision();
    }
};

// Player class
var Player = function() {
    // player start co-ordinates
    this.x = 200;
    this.y = 400;
    // Loading the player image
    this.sprite = 'images/char-boy.png';
    // Player collision area
    this.width = 50;
    this.height = 50;
    // Player starting lives
    this.lives = 3;
};

// PLayer update method
Player.prototype.update = function() {
    if (this.y < 5) { // if player reaches the water
        this.reset(); // position resets
    }
};

// Player collision method

Player.prototype.collision = function() {
    this.lives -= 1;
    
    player.reset();
    //console.log(this.lives + " lives are left");
};

// Player reset method

Player.prototype.reset = function() {
    this.x = 200;
    this.y = 400;
};

// Player Render method
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    // draws a box around player object
    drawBox(this.x + 16, this.y + 62, 70, 78, "blue");
};


// Keyboard input handler
Player.prototype.handleInput = function(key) {
    switch (key) {
        case "left":
            if (this.x > 20) {
                this.x -= 28;
            }
            break;
        case "right":
            if (this.x < 380) {
                this.x += 28;
            }
            break;
        case "up":
            if (this.y > 0) {
                this.y -= 28;
            }
            break;
        case "down":
            if (this.y < 400) {
                this.y += 28;
            }
            break;
    }
};

// Places all enemy objects in an array called allEnemies
// Places the player object in a variable called player
var allEnemies = [new Enemy(0, 60), new Enemy(0, 145), new Enemy(0, 230), new Enemy(0, 195)];
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
