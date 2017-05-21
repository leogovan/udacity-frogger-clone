//Define "constants". Allows to tune game rules and make it more easy or hard

//Canvas parameters
var CANVAS_HEIGHT = 606;
var CANVAS_WIDTH = 505;

// ENEMY_* defines behavior of enemies
var ENEMY_COLLISION_RADIUS = 50; //How close your need to be to collide
var ENEMY_DELAY_MAX = -300;
var ENEMY_DELAY_MIN = -50; //Choose random initial X-position of bug between MIN and MAX
var ENEMY_NUMBER = 3; //Initial number of bugs
var ENEMY_SPEED_MAX = 200;
var ENEMY_SPEED_MIN = 50; //Choose random initial speed of bug between MIN and MAX
var ENEMY_Y_MIN = 50;
var ENEMY_Y_MAX = 250; //Choose random initial Y-position of bug between MIN and MAX

// ENEMY_* defines behavior of master-enemies (updated enemies)
var ENEMY_MASTER_NUMBER = 1;
var ENEMY_MASTER_SPEED_FACTOR = 1.5; //relative to non-master enemy
var ENEMY_MASTER_COLLISION_RADIUS = 75;

//LEVELUP_* defines what happens when hero reachs water
var LEVELUP_ACCELERATION_FACTOR = 1.1; //how enemies are accelerted
var LEVELUP_ACCELERATION_PROBABILITY = 0.4;
var LEVELUP_NEW_ENEMY_PROBABILITY = 0.2;
var LEVELUP_NEW_MASTER_PROBABILITY = 0.1; //probability of possible negative effects (enemy acceleration, new enemies)
var LEVELUP_GEM_O_PROBABILITY = 0.15;
var LEVELUP_GEM_B_PROBABILITY = 0.1;
var LEVELUP_GEM_G_PROBABILITY = 0.3;
var LEVELUP_HEART_PROBABILITY = 0.1; //probability of possible positive effects (appearence of gems and hearts,
//which can slow down enemies, kill them or add lives to player)

//PLAYER_* defines behavior of player
var PLAYER_LIVES = 3; //starting number of lives
var PLAYER_START_X = 200;
var PLAYER_START_Y = 430; //starting position
var PLAYER_STEP = 30; //length of step
var PLAYER_WATER_POINTS = 1; //how much player erans points for reaching the water

//BENEFIT_* defines benefits(gems and hearts) parameters
var BENEFIT_COLLISION_RADIUS = 50; //how close player need to come to grab gem/heart
var BENEFIT_SLOWDOWN_FACTOR = 0.9; //how enemies are slowed down by green gem
var BENEFIT_X_MIN = 0;
var BENEFIT_X_MAX = CANVAS_WIDTH - 100;
var BENEFIT_Y_MIN = ENEMY_Y_MIN;
var BENEFIT_Y_MAX = ENEMY_Y_MAX; //X,Y coordinates in which benefit is randomly placed

//Global variables
var gameState = "BeforeGame"; //Defines current state of the game. Possible states = ["BeforeGame","Game","AfterGame"]
var playerSprite = 'images/char-boy.png'; //Default player's sprite

/**
 * @class
 * @description Basic enemy class
 * @param {string} sprite - The image of an enemy
 * @param {number} x - X-coordinate of an enemy
 * @param {number} y - X-coordinate of an enemy
 * @param {number} speed - initial speed of an enemy
 * @param {string} type - type of an enemy
 */
var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
    this.x = Math.random() * (ENEMY_DELAY_MAX - ENEMY_DELAY_MIN) + ENEMY_DELAY_MIN;
    this.y = Math.random() * (ENEMY_Y_MAX - ENEMY_Y_MIN) + ENEMY_Y_MIN;
    this.speed = Math.random() * (ENEMY_SPEED_MAX - ENEMY_SPEED_MIN) + ENEMY_SPEED_MIN;
    this.type = "Bug";
};

/**
 * @function
 * @description Change enemies speed in "factor" times
 * @param {number} factor - in how much times change speed of an enemy
 */
Enemy.prototype.accelerate = function(factor) {
    this.speed *= factor;
};

/**
 * @function
 * @description Draw enemy on the screen
 */
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 * @function
 * @description Manage enemy's movement and collisions with player
 * @param {number} dt - current time (affects on movement)
 */
Enemy.prototype.update = function(dt) {
    //manage movement:
    this.x = (this.x + 100 + (this.speed * dt)) % (CANVAS_WIDTH + 150) - 100;
    //manage collision:
    if (Math.sqrt(Math.pow((this.x - player.x), 2) + Math.pow((this.y - player.y), 2)) < ENEMY_COLLISION_RADIUS) {
        player.collision();
    }
};

/**
 * @description EnemyMaster class - subclass of "Enemy"
 * @class
 * @param {number} direction - defines initial direction: 1 for right, -1 for left
 */
var EnemyMaster = function() {
    Enemy.call(this);
    this.sprite = 'images/enemy-master-bug-r.png';
    this.direction = 1;
    this.speed *= ENEMY_MASTER_SPEED_FACTOR;
    this.type = "MasterBug";
};

EnemyMaster.prototype = Object.create(Enemy.prototype);
EnemyMaster.prototype.constructor = EnemyMaster;
/**
 * @function
 * @description Manage master-enemy's movement and collisions with player
 */
EnemyMaster.prototype.update = function(dt) {
    //manage movement:
    this.x = (this.x + 100 + (this.speed * dt * this.direction)) % (CANVAS_WIDTH + 150) - 100;

    //turn left
    if ((this.direction == 1) && (this.x > CANVAS_WIDTH)) {
        this.direction = -1;
        this.y = Math.random() * (ENEMY_Y_MAX - ENEMY_Y_MIN) + ENEMY_Y_MIN;
        this.sprite = 'images/enemy-master-bug-l.png';
    }

    //turn right
    if ((this.direction == -1) && (this.x < -100)) {
        this.direction = 1;
        this.y = Math.random() * (ENEMY_Y_MAX - ENEMY_Y_MIN) + ENEMY_Y_MIN;
        this.sprite = 'images/enemy-master-bug-r.png';
    }

    //manage collision:
    if (Math.sqrt(Math.pow((this.x - player.x), 2) + Math.pow((this.y - player.y), 2)) < ENEMY_MASTER_COLLISION_RADIUS) {
        player.collision();
    }
};

/**
 * @description Player class
 * @class
 * @param {string} sprite - The image of a player
 * @param {number} x - X-coordinate of a player
 * @param {number} y - X-coordinate of a player
 * @param {number} points - points earned by player
 * @param {string} lives - live of player
 */
var Player = function() {
    this.sprite = playerSprite;
    this.x = PLAYER_START_X;
    this.y = PLAYER_START_Y;
    this.points = 0;
    this.lives = PLAYER_LIVES;
};

/**
 * @function
 * @description In case of collision with an enemy - move player to initial position and decrease his lives
 */
Player.prototype.collision = function() {
    this.x = PLAYER_START_X;
    this.y = PLAYER_START_Y;
    this.lives -= 1;
};

/**
 * @function
 * @description Manage what happening when player grabs benefits
 */
Player.prototype.grab = function(benefit) {
    //Apply benefit profit:
    benefit.makeProfit();
    //Delete benefit:
    var len = allBenefits.length;
    for (i = 0; i < len; i++) {
        if ((allBenefits[i].x == benefit.x) && (allBenefits[i].y == benefit.y)) {
            allBenefits.splice(i, 1);
            return 0;
        }
    }
};

/**
 * @function
 * @description Handles input fom keyboard. Manage players's movement and collision with borders
 * @param {number} key - button pressed
 */
Player.prototype.handleInput = function(key) {
    if ((key == "left") && (this.x - PLAYER_STEP > -25)) {
        this.x -= PLAYER_STEP;
    }
    if ((key == "right") && (this.x + PLAYER_STEP < CANVAS_WIDTH - 70)) {
        this.x += PLAYER_STEP;
    }
    if ((key == "down") && (this.y + PLAYER_STEP < PLAYER_START_Y)) {
        this.y += PLAYER_STEP;
    }
    if (key == "up") {
        this.y -= PLAYER_STEP;
    }
};

/**
 * @function
 * @description Draw player on the screen
 */
Player.prototype.render = function() {
    ctx.font = "15pt Verdana";
    ctx.fillStyle = "yellow";
    ctx.fillText("Points: " + this.points, 405, 75);
    ctx.fillStyle = "red";
    ctx.font = "bold 15pt Verdana";
    ctx.fillText("Lives: " + this.lives, 10, 75);
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 * @function
 * @description Manage players lives and effects when player reaches the water
 */
Player.prototype.update = function() {

    /**
     * @function
     * @description Pick a random index from the array
     * @param probabilityList - array, contains list of probabilities: array[i] is a probability of picking element number "i"
     * e.g. [0.4, 0.3, 0.3] - in 40% cases function return "0", in 30% function return "1" and in 30% - "2".
     */
    function chooseRandomItem(probabilityList) {
        var tmp = Math.random();
        var sum = 0;
        var len = probabilityList.length;
        var i = 0;
        while ((sum < tmp) && (i < len)) {
            sum += probabilityList[i];
            i++;
        }
        return i - 1;
    }

    //If player reaches water:
    if (this.y < 10) {
        //Move player to initial locaton, add points
        this.x = PLAYER_START_X;
        this.y = PLAYER_START_Y;
        this.points += PLAYER_WATER_POINTS;

        //Apply possible negative effects
        var negative = chooseRandomItem([
            LEVELUP_ACCELERATION_PROBABILITY,
            LEVELUP_NEW_ENEMY_PROBABILITY,
            LEVELUP_NEW_MASTER_PROBABILITY,
            1
        ]);
        switch (negative) {
            case 0: //Accelerate enemies:
                var len = allEnemies.length;
                for (var i = 0; i < len; i++) {
                    allEnemies[i].accelerate(LEVELUP_ACCELERATION_FACTOR);
                }
                break;
            case 1: //Add new enemy:
                allEnemies.push(new Enemy());
                break;
            case 2: //Add new master-enemy:
                allEnemies.push(new EnemyMaster());
                break;
        }

        //Apply possible positive effects (add orange gem, blue gem, green gem, heart)
        var positive = chooseRandomItem([
            LEVELUP_GEM_O_PROBABILITY,
            LEVELUP_GEM_B_PROBABILITY,
            LEVELUP_GEM_G_PROBABILITY,
            LEVELUP_HEART_PROBABILITY,
            1
        ]);
        switch (positive) {
            case 0: //Add orange gem
                allBenefits.push(new BenefitGemOrange());
                break;
            case 1: //Add blue gem
                allBenefits.push(new BenefitGemBlue());
                break;
            case 2: //Add green gem
                allBenefits.push(new BenefitGemGreen());
                break;
            case 3: //Add heart
                allBenefits.push(new BenefitHeart());
                break;
        }
    }

    //if you out of lives - the game stops:
    if (this.lives < 1) {
        gameState = "AfterGame";
    }
};

/**
 * @description Basic benefit (gems and heart) class. Doesn't used directly (only its subclasses are used)
 * @class
 * @param {string} sprite - The image of a benefit
 * @param {number} x - X-coordinate of a player
 * @param {number} y - X-coordinate of a player
 */
var Benefit = function() {
    this.sprite = 'images/Heart.png'; //default value, if something goes wrong
    this.x = Math.random() * (BENEFIT_X_MAX - BENEFIT_X_MIN) + BENEFIT_X_MIN;
    this.y = Math.random() * (BENEFIT_Y_MAX - BENEFIT_Y_MIN) + BENEFIT_Y_MIN;
};

/**
 * @function
 * @description Draw benefit on the screen
 */
Benefit.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 80, 140);
};

/**
 * @function
 * @description Manage collision with player
 */
Benefit.prototype.update = function() {
    if (Math.sqrt(Math.pow((this.x - player.x), 2) + Math.pow((this.y - player.y), 2)) < BENEFIT_COLLISION_RADIUS) {
        player.grab(this);
    }
};

/**
 * @description Subclass of "Benefit". Used to create blue gems
 * @class
 */
var BenefitGemBlue = function() {
    Benefit.call(this);
    this.sprite = 'images/Gem-Blue.png';
};

BenefitGemBlue.prototype = Object.create(Benefit.prototype);
BenefitGemBlue.prototype.constructor = BenefitGemBlue;
BenefitGemBlue.prototype.makeProfit = function() {
    //delete first EnemyMaster if exists. Else - do nothing
    var len = allEnemies.length;
    for (i = 0; i < len; i++) {
        if (allEnemies[i].type == "MasterBug") {
            allEnemies.splice(i, 1);
            return 0;
        }
    }
};

/**
 * @description Subclass of "Benefit". Used to create green gems
 * @class
 */
var BenefitGemGreen = function() {
    Benefit.call(this);
    this.sprite = 'images/Gem-Green.png';
};

BenefitGemGreen.prototype = Object.create(Benefit.prototype);
BenefitGemGreen.prototype.constructor = BenefitGemGreen;
BenefitGemGreen.prototype.makeProfit = function() {
    //slowdown all enemies
    var len = allEnemies.length;
    for (i = 0; i < len; i++) {
        allEnemies[i].accelerate(BENEFIT_SLOWDOWN_FACTOR);
    }
};

/**
 * @description Subclass of "Benefit". Used to create orange gems
 * @class
 */
var BenefitGemOrange = function() {
    Benefit.call(this);
    this.sprite = 'images/Gem-Orange.png';
};

BenefitGemOrange.prototype = Object.create(Benefit.prototype);
BenefitGemOrange.prototype.constructor = BenefitGemOrange;
BenefitGemOrange.prototype.makeProfit = function() {
    //delete first Enemy (not Enemy Master) if exists. Else - do nothing
    var len = allEnemies.length;
    for (i = 0; i < len; i++) {
        console.log(allEnemies[i].type);
        if (allEnemies[i].type == "Bug") {
            allEnemies.splice(i, 1);
            return 0;
        }
    }
};

/**
 * @description Subclass of "Benefit". Used to create hearts
 * @class
 */
var BenefitHeart = function() {
    Benefit.call(this);
    this.sprite = 'images/Heart.png';
};

BenefitHeart.prototype = Object.create(Benefit.prototype);
BenefitHeart.prototype.constructor = BenefitHeart;
BenefitHeart.prototype.makeProfit = function() {
    //add one more life
    player.lives += 1;
};

// Instantiating objects.
// All enemies objects are placed in an array called allEnemies
// Player object is placed in a variable called player'
// All benefits objects (zero by default) are placed in an array called allBenefits

var allEnemies = [];
for (var i = 0; i < ENEMY_NUMBER; i++) {
    allEnemies.push(new Enemy());
}

for (var i = 0; i < ENEMY_MASTER_NUMBER; i++) {
    allEnemies.push(new EnemyMaster());
}

var player = new Player();

var allBenefits = [];

// This listens for key presses and sends the keys
// to Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
