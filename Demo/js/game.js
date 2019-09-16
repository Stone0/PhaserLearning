var width = 800;
var height = 600;

var game = new Phaser.Game(width, height, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render});

var player;
var player_move;
var timeBegin;
var timeText;
var mouseText;
var btnPaused;
var btnStart;
var platform;
var snakeHead;
var snakeSection = new Array();
var snakePath = new Array();
var numSnakeSections = 7;
var snakeSpacer = 12;
var showDebug = true;

function preload() {
    game.load.image('btnP', 'img/paused.png', 32, 32);
    game.load.image('btnS', 'img/start.png', 32, 32);
    game.load.image('head', 'img/snakeHead.png', 32, 32);
    game.load.image('section', 'img/snakeSection1.png', 32, 32);
    game.load.image('exp', 'img/exp.png', 32, 32);
    game.load.spritesheet('dude', 'img/dude.png', 32, 48);
    game.load.spritesheet('baddie', 'img/baddie.png', 32, 32);
}

function create() {
    game.stage.backgroundColor="#848484";
    // game.physics.startSystem(Phaser.Physics.ARCADE);
    // player = game.add.sprite(50, 50, 'dude');
    // player.frame = 4;
    
    player_move = game.add.sprite(50, 150, 'dude');
    game.physics.arcade.enable(player_move);
    player_move.frame = 4;
    player_move.animations.add('left', [0, 1, 2, 3], 9, true);
    player_move.animations.add('right', [5, 6, 7, 8], 9, true);
    platform = new Phaser.Rectangle(0, 250, 800, 20);
    
    baddies = game.add.sprite(50, 200, 'baddie');
    game.physics.arcade.enable(baddies);
    baddies.frame = 2;
    baddies.animations.add('left', [1, 0, 1], 3, true);
    baddies.animations.add('right', [2, 3, 2], 3, true);
    // baddies.body.bounce.y = 0;
    baddies.body.gravity.y = 50;
    
    timeBegin = game.add.text(50, 10, 'begin: ' + getCurDate('m'), { fontSize: '32px', fill: '#000' });
    timeText = game.add.text(50, 50, 'time: 00:00:00', { fontSize: '32px', fill: '#000' });
    mouseText = game.add.text(50, 350, 'mouse: (0,0)', { fontSize: '32px', fill: '#000' });
    
    btnPaused = game.add.button(500, 10, 'btnP', btnPaused, this);
    // btnPaused.anchor.setTo(0.5,0.5);
    btnPaused.scale.setTo(0.5, 0.5);
    btnStart = game.add.button(game.world.centerX-48, game.world.centerY-44, 'btnS', btnStart, this);
    btnStart.scale.setTo(0.5, 0.5);
    btnStart.visible = false;
    
    snakeHead = game.add.sprite(100, 250, 'head');
    snakeHead.scale.setTo(0.5, 0.5);
    snakeHead.anchor.setTo(1, 0.5);
    game.physics.enable(snakeHead, Phaser.Physics.ARCADE);
    // snakeHead.body.allowRotation = true;
    
    snakeSection[0] = snakeHead;
    for (var i = 1; i <= numSnakeSections; i++) {
        snakeSection[i] = game.add.sprite(snakeHead.x-(i*snakeSpacer), snakeHead.y, 'section');
        snakeSection.push(game.add.sprite(snakeHead.x-(i*snakeSpacer), snakeHead.y, 'section'))
        snakeSection[i].scale.setTo(0.5, 0.5);
        snakeSection[i].anchor.setTo(1, 0.5);
        snakePath.push(new Phaser.Point(snakeSection[i].x, snakeSection[i].y));
    }
    
    // for (var i = 0; i <= numSnakeSections; i++) {
    //     snakePath[i] = new Phaser.Point(snakeSection[i].x, snakeSection[i].y);
    // }
    
    exp = game.add.sprite(0, 0, 'exp');
}

function update() {
    mouseText.text = 'mouse: (' + game.input.activePointer.x + ',' + game.input.activePointer.y + ')';
    
    if (player_move.x <= 50) {
        player_move.body.velocity.x = 100;
        player_move.animations.play('right');
    } else if (player_move.x >= game.world.centerX-player_move.width) {
        player_move.body.velocity.x = -100;
        player_move.animations.play('left');
    }
    
    if (baddies.y >= 200) {
        baddies.body.velocity.y = -20;
        // baddies.body.velocity.y = 20;
    }
    baddies.body.velocity.x = 150;
    baddies.animations.play('right');
    
    timeText.text = 'time: ' + getCurDate('m');
    // wait(100);
    
    // snakeHead.rotation = game.physics.arcade.moveToPointer(snakeHead, 200, game.input.activePointer, 5000);
    snakeHead.body.setCircle(45, 40, 40);
    
    //自动向前行驶
    // snakeHead.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(snakeHead.angle, 80));
    
    
    // var part = snakePath.pop();
    // part.setTo(snakeHead.x, snakeHead.y);
    // snakePath.unshift(snakeHead.x, snakeHead.y);
    // for (var i = 1; i <= numSnakeSections; i++) {
    //     snakeSection[i].x = snakePath[i].x + (i*snakeSpacer);
    //     snakeSection[i].y = snakePath[i].y + (i*snakeSpacer);
    // }
    
    // game.time.events.loop(Phaser.Timer.SECOND, add_section, this);
    // game.time.events.repeat(Phaser.Timer.SECOND * 2, 10, createExp, this);
    game.time.events.add(Phaser.Timer.SECOND, fadeSprite, this);
    
    // add_section();
    
    game.input.onDown.add(showDebugInfo, this);
    
    screenWrap(snakeHead);
    
}

function fadeSprite() {
    game.add.tween(player_move).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
}

function createExp() {
    
}

function screenWrap(sprite) {
    if (sprite.x < 0) {
        sprite.x = game.width;
    } else if (sprite.x > game.width) {
        sprite.x = 0;
    }
    
    if (sprite.y < 0) {
        sprite.y = game.height;
    } else if (sprite.y > game.height) {
        sprite.y = 0;
    }
}

function add_section() {
    snakeHead.body.velocity.setTo(0, 0);
    snakeHead.body.angularVelocity = 0;
    snakeHead.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(snakeHead.angle, 50));
    // var part = snakePath.pop();
    var part = snakePath.shift();
    part.setTo(snakeHead.x, snakeHead.y);
    // snakePath.unshift(part);
    snakePath.push(part);
    for (var i = 1; i <= numSnakeSections; i++) {
        snakeSection[i].x = (snakePath[i * snakeSpacer]).x;
        snakeSection[i].y = (snakePath[i * snakeSpacer]).y;
    }
}

function showDebugInfo() {
    showDebug = (showDebug) ? false : true;

    if (!showDebug)
    {
        game.debug.reset();
    }
}

function render() {
    // game.debug.geom(platform, '#0fffff');
    // game.debug.spriteInfo(snakeHead, 32, 32);
    if (showDebug)
    {
        game.debug.bodyInfo(snakeHead, 32, game.world.height-100);
        game.debug.body(snakeHead);
    }
}

function createPlatform(y) {
    var platform = new Rectangle(0, y, game.width, 20);
    return platform;
}

function btnPaused() {
    console.log(">>> paused");
    console.log(game.input.activePointer.x + ',' + game.input.activePointer.y);
    
    // game.paused=true;
    player_move.visible = false;
    btnStart.visible = !btnStart.visible;
}

function btnStart() {
    console.log(">>> start");
    console.log(game.input.activePointer.x + ',' + game.input.activePointer.y);
    // game.resumed=true;
    player_move.visible = true;
    btnStart.visible = !btnStart.visible;
}

function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
        end = new Date().getTime();
    }
}

function getCurDate(m) {
    var d = new Date();
    // "2019/9/4"
    // d.toLocaleDateString()
    // "下午5:40:13"
    // d.toLocaleTimeString()
    // "2019/9/4 下午5:40:13"
    // d.toLocaleString()
    
    var hours = add_zero(d.getHours());
    var minutes = add_zero(d.getMinutes());
    var seconds = add_zero(d.getSeconds());
    var millseconds = '';
    var nd = '';
    if (m == 'm') {
        millseconds = d.getMilliseconds();
        nd = hours + ":" + minutes + ":" + seconds + "." + millseconds;
    } else {
        nd = hours + ":" + minutes + ":" + seconds;
    }
    return nd;
}

function add_zero(temp) {
    if (temp<10) return "0"+temp;
    else return temp;
}

