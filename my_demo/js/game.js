var width = 800;
var height = 600;

// 创建游戏对象,Phaser.AUTO自动检测渲染器
var game = new Phaser.Game(width, height, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var platforms;
var player;
var player_life = 5;
var baddies;
var baddies_life = 2;
var test_num = 0;
var cursors;
var stars;
var score = 0;
var scoreText;
var jump = 0;

// 游戏资源预加载
function preload() {
    // 加载背景
    game.load.image('sky', 'img/sky.png');
    // 加载平台
    game.load.image('ground', 'img/platform.png');
    // 加载星星
    game.load.image('star', 'img/star.png');
    // 加载玩家
    game.load.spritesheet('dude', 'img/dude.png', 32, 48);
    // 加载兔子
    game.load.spritesheet('baddie', 'img/baddie.png', 32, 32);
}

// 游戏场景创建
function create() {
    console.log(game.rnd.between(0, 10));
    // 启动arcade物理引擎
    game.physics.startSystem(Phaser.Physics.ARCADE);
    // 添加背景精灵
    game.add.sprite(0, 0, 'sky');
    
    // 创建平台组
    platforms = game.add.group();
    // 此组中元素都有物理属性(添加对象到group之前定义)
    platforms.enableBody = true;
    // 添加地板对象到平台组
    var ground = platforms.create(0, game.world.height - 64, 'ground');
    // 将地板按比例缩放(宽,高)
    ground.scale.setTo(2, 2);
    // 设置地板不可移动
    ground.body.immovable = true;
    
    // 添加横条对象到平台组
    var ledge = platforms.create(400, 400, 'ground');
    // 设置横条不可移动
    ledge.body.immovable = true;
    // 添加新的横条对象到平台组
    ledge = platforms.create(-150, 250, 'ground');
    // 设置新的横条不可移动
    ledge.body.immovable = true;
    
    // 添加玩家精灵
    player = game.add.sprite(20, 490, 'dude');
    // 开启玩家物理引擎
    game.physics.arcade.enable(player);
    // 设置y轴方向的反弹值
    player.body.bounce.y = 0;
    // 设置y轴方向的重力值
    player.body.gravity.y = 410;
    // 设置世界碰撞边界(不会掉出canvas)
    player.body.collideWorldBounds = true;
    // 定义向左的动画效果,12:每帧12秒,true:循环
    player.animations.add('left', [0, 1, 2, 3], 12, true);
    // 定义向右的动画效果,12:每帧12秒,true:循环
    player.animations.add('right', [5, 6, 7, 8], 12, true);
    
    // 创建兔子精灵
    // baddies = game.add.sprite(80, 505, 'baddie');
    baddies = game.add.sprite(80, 500, 'baddie');
    // 设置精灵动画的初始帧
    baddies.frame = 2;
    game.physics.arcade.enable(baddies);
    baddies.body.bounce.y = 0;
    baddies.body.gravity.y = 100;
    baddies.body.collideWorldBounds = true;
    baddies.animations.add('left', [1, 0, 1], 3, true);
    baddies.animations.add('right', [2, 3, 2], 3, true);
    
    // 初始化按键
    cursors = game.input.keyboard.createCursorKeys();
    
    // 创建星星组
    stars = game.add.group();
    stars.enableBody = true;
    for (var i = 0; i < 12; i++)
    {
        var star = stars.create(i * 70, -50, 'star');
        star.body.bounce.y = 0.2 + Math.random() * 0.2;
        star.body.gravity.y = 500;
    }
    
    // 更新文本对象
    scoreText = game.add.text(10, 10, '0', { fontSize: '32px', fill: '#000' });
}

// 游戏逻辑实现
function update() {
    // 
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(baddies, platforms);
    game.physics.arcade.collide(stars, platforms);
    
    // 添加重叠事件
    game.physics.arcade.overlap(player, stars, collectStar, null, this);
    
    // 设置玩家逻辑
    player.body.velocity.x = 0;
    if (cursors.left.isDown)
    {
        player.body.velocity.x = -150;
        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 150;
        player.animations.play('right');
    }
    else
    {
        player.animations.stop();
        player.frame = 4;
    }
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -350;
    }
    
    if (baddies_life != 0)
    {
        // if (jump == 2)
        // {
        //     if (baddies.frame == 2)
        //     {
        //         baddies.frame = 1;
        //         jump = 0;
        //     }
        //     else
        //     {
        //         baddies.frame = 2;
        //     }
        // }
        if (jump == 2)
        {
            console.log(baddies.frame);
            if (baddies.frame == 2)
            {
                baddies.frame = 1;
                jump = 0;
            }
        }
        // console.log(jump);
        
        if (baddies.frame == 2 && baddies.body.velocity.y == 0)
        {
            console.log('right');
            baddies.body.velocity.y = -40;
            baddies.body.velocity.x = 50;
            baddies.animations.play('right');
            jump++;
        }
        else if (baddies.frame == 1 && baddies.body.velocity.y == 0)
        {
            console.log('left');
            baddies.body.velocity.y = -40;
            baddies.body.velocity.x = -50;
            baddies.animations.play('left');
            jump++;
        }
    }
    
    function wait(ms){
        var start = new Date().getTime();
        var end = start;
        while(end < start + ms) {
            end = new Date().getTime();
        }
    }
    
    // wait(1000);
    // console.log(baddies_life);
    // wait(1000);
    // console.log(stars.length);
    
    // while (baddies_life != 0 && stars.length == baddies_life*2)
    // do 
    // {
    //     randomStarX = Math.floor((Math.random()*(width-47))+5);
    //     randomStarY = Math.floor((Math.random()*(height-44))+5);
    //     console.log(randomStarX + ',' + randomStarY);
    //     wait(3000);
    //     // var new_star = stars.create(randomStarX, randomStarY, 'star');
    //     // star = newStar;
    // }
    // while (stars.length == (12+baddies_life*4))
    // for (var i = 0; i < 12; i++)
    // {
    //     // var star = stars.create(i * 70, -50, 'star');
    //     // star.body.gravity.y = 500;
    //     // star.body.bounce.y = 0.2 + Math.random() * 0.2;
    // }
    // baddies.animations.stop();
}

function collectStar (player, star) {
    star.kill();
    
    score += 10;
    scoreText.text = score;
}
