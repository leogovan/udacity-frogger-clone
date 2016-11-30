// Enemies our player must avoid
var Enemy = function(x, y) {
    // Setting the Enemy initial location (you need to implement)
    this.x = x;
    this.y = y;
    // Generating random speed value
    var enemySpeed = Math.round(Math.random() * (350 - 10) + 50);
    // Setting the Enemy speed value
    this.speed = enemySpeed;
    // Loading the enemy image
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x += this.speed * dt;
    // resets enemy position once it reaches end of board
    if (this.x > 500) {
        this.x = -80;
    }
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
};

// Draw the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Player class
var Player = function() {
    // player start co-ordinates
    this.x = 200;
    this.y = 300;
    // Loading the player image
    this.sprite = 'images/char-boy.png';
};

// Update method
Player.prototype.update = function() {

};

// Render method
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
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


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [new Enemy(0, 60), new Enemy(0, 145), new Enemy(0, 230), new Enemy(0,195)];
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
