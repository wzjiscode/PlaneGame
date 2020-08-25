const config = {
    player_speed: 10,
    cloud_speed: 1,
    enemy_speed: 5,
    bullet_speed: 5,
    fire_cooldown: 9,
}

class Bullet extends PlaneImage {
    constructor(game) {
        super(game, 'bullet')
        this.setup()
        this.column = new Array(10)
    }
    setup() {
        this.speed = config.bullet_speed
    }
    //update方法实时加载更新y坐标
    update() {
        //this.x , this.y是子弹的坐标，this.speed是子弹的速度
        this.y -= this.speed
        this.column.push(this.x, this.y)
        return this.column
        // 返回值将更新后的x,y坐标传递给 Enemy类作碰撞检测
    }
}
class Player extends PlaneImage {
    constructor(game) {
        super(game, 'player')
        this.setup()
    }
    setup() {
        this.speed = 5
        this.cooldown = 0
    }
    update() {
        this.speed = config.player_speed
        if (this.cooldown > 0) {
            this.cooldown--
        }
    }
    fire() {
        if (this.cooldown == 0) {
            this.cooldown = config.fire_cooldown
            var x = this.x + this.w / 2
            var y = this.y
            var b = Bullet.new(this.game)
            b.x = x
            b.y = y
            this.scene.addElement(b)
        }
    }
    moveLeft() {
        this.x -= this.speed
    }
    moveRight() {
        this.x += this.speed
    }
    moveUp() {
        this.y -= this.speed
    }
    moveDown() {
        this.y += this.speed
    }
}

const randomBetween = function(start, end) {
    var n = Math.random() * (end - start + 1)
    return Math.floor(n + start)
}

class Enemy extends PlaneImage {
    constructor(game) {
        var type = randomBetween(1, 2)
        var name = 'enemyplane' + type
        super(game, name)
        //实例化Bullet
        this.bullet = Bullet.new(game)
        this.setup()

    }
    setup() {
        this.speed = randomBetween(1, 2)
        this.x = randomBetween(0, 350)
        this.y = -randomBetween(0, 200)
        log(this.bullet.update) //得到的是初始化的值，而不是实时更新的子弹坐标

    }
    update() {
        this.y += this.speed
        if (this.y > 600) {
            this.setup()
        }
    }
}

class Cloud extends PlaneImage {
    constructor(game) {
        super(game, 'cloud')
        this.setup()

    }
    setup() {
        this.speed = 1
        this.x = randomBetween(0, 350)
        this.y = -randomBetween(0, 200)
    }
    update() {
        this.y += this.speed
        if (this.y > 600) {
            this.setup()
        }
    }
    debug() {
        this.speed = config.cloud_speed
    }
}

class Scene extends PlaneScene {
    constructor(game) {
        super(game)
        this.setup()
        this.setupInputs()
    }
    setup() {
        var game = this.game
        this.numberOfElemies = 10
        this.bg = PlaneImage.new(game, 'sky')
        this.cloud = Cloud.new(game, 'cloud')
        // this.player = PlaneImage.new(game, 'player')
        this.player = Player.new(game)
        this.player.x = 160
        this.player.y = 500

        this.addElement(this.bg)
        this.addElement(this.cloud)
        this.addElement(this.player)

        this.addElemies()
        //add particles
        var ps = ParticleSystem.new(this.game)
        this.addElement(ps)
    }
    addElemies() {
        var es = []
        for (var i = 0; i < this.numberOfElemies; i++) {
            var e = Enemy.new(this.game)
            es.push(e)
            this.addElement(e)
        }
        this.enemies = es
    }
    setupInputs() {
        var game = this.game
        var s = this
        game.registerAction('a', function() {
            s.player.moveLeft()
        })
        game.registerAction('d', function() {
            s.player.moveRight()
        })
        game.registerAction('w', function() {
            s.player.moveUp()
        })
        game.registerAction('s', function() {
            s.player.moveDown()
        })
        game.registerAction('j', function() {
            s.player.fire()
        })
    }
    update() {
        // log(super.update())
        this.cloud.y += 1
        super.update()
    }
}