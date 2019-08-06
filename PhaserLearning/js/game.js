
var width = 800;
var height = 600;

var game = new Phaser.Game(width, height, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var platforms;
var player;
var cursors;
var stars;
var score = 0;
var scoreText;

function preload() {
    console.log('preload');
    game.load.image('bg', 'img/bg.jpg');
    game.load.image('pf', 'img/pf.png');
    game.load.image('star', 'img/star.png');
    game.load.image('exp', 'img/exp.png');
    game.load.image('xx', 'img/xxstandby.png');
    // game.load.spritesheet('xx', 'img/xxstandby.png', 32, 48);
}

function create() {
    console.log('create');
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.add.sprite(0, 0, 'bg');
    // game.add.sprite(10, 10, 'star');
    
    platforms = game.add.group();
    platforms.enableBody = true;
    var ground = platforms.create(0, game.world.height-120, 'pf');
    ground.scale.setTo(2, 1);
    ground.body.immovable = true;
    var ledge = platforms.create(400, 300, 'pf');
    ledge.body.immovable = true;
    ledge = platforms.create(-150, 150, 'pf');
    ledge.body.immovable = true;
    
    player = game.add.sprite(5, game.world.height-250, 'xx');
    game.physics.arcade.enable(player);
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 1000;
    player.body.collideWorldBounds = true;
    // player.animations.add('left', [0, 1, 2, 3], 10, true);
    // player.animations.add('right', [5, 6, 7, 8], 10, true);
    
    cursors = game.input.keyboard.createCursorKeys();
    
    stars = game.add.group();
    stars.enableBody = true;
    for (var i = 0; i < 12; i++)
    {
        var star = stars.create(i * 70, 0, 'star');
        star.body.gravity.y = 500;
        star.body.bounce.y = 0.5 + Math.random() * 0.2;
    }
    
    scoreText = game.add.text(10, 5, '0', { fontSize: '30px', fill: '#000' });
}

function update() {
    // console.log('update');
    game.physics.arcade.collide(player, platforms);
    
    player.body.velocity.x = 0;
    if (cursors.left.isDown)
    {
        player.body.velocity.x = -150;
        // player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 150;
        // player.animations.play('right');
    }
    else
    {
        player.animations.stop();
        // player.frame = 4;
    }
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -650;
    }
    
    game.physics.arcade.collide(stars, platforms);
    game.physics.arcade.overlap(player, stars, collectStar, null, this);
    
}

function collectStar (player, star) {
    star.kill();
    // randomStarX = Math.floor((Math.random()*(width-47))+5);
    // randomStarY = Math.floor((Math.random()*(height-44))+5);
    // console.log(randomStarX + ',' + randomStarY);
    // var newStar = stars.create(randomStarX, randomStarY, 'star');
    // star = newStar;
    
    score += 10;
    scoreText.text = score;
}

