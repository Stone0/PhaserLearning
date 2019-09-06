
var width = 800;
var height = 600;

var game = new Phaser.Game(width, height, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var player;
var player_move;
var timeBegin;
var timeText;
var mouseText;
var btnPaused;

function preload() {
    
    game.load.image('btnP', 'img/paused.png', 32, 32);
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
    
    timeBegin = game.add.text(50, 10, 'begin: ' + getCurDate('m'), { fontSize: '32px', fill: '#000' });
    timeText = game.add.text(50, 50, 'time: 00:00:00', { fontSize: '32px', fill: '#000' });
    mouseText = game.add.text(50, 350, 'mouse: (0,0)', { fontSize: '32px', fill: '#000' });
    
    btnPaused = game.add.button(500, 10, 'btnP', btnPaused, this);
    // btnPaused.anchor.setTo(0.5,0.5);
    btnPaused.scale.setTo(0.5, 0.5);
    
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
    
    timeText.text = 'time: ' + getCurDate('m');
    // wait(100);
    
}

function btnPaused() {
    console.log("click");
    console.log(game.input.activePointer.x + ',' + game.input.activePointer.y);
    
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

