class GuaLabel {
    constructor(game, text) {
        this.game = game
        this.text = text
    }
    static new(game, text) {
        return new this(game, text)
    }
    draw() {
        this.game.context.fillText(this.text, 100, 190)
    }
    update() {}
}

class GuaPraticle extends PlaneImage {
    constructor(game) {
        super(game, 'fire')
        this.setup()
    }
    setup() {
        this.life = 12
    }
    init(x, y, vx, vy) {
        this.x = x
        this.y = y
        this.vx = vx
        this.vy = vy
    }
    update() {
        this.life--
        this.x += this.vx
        this.y += this.vy
        var factor = 0.02
        this.vx += factor * this.vx
        this.vy += factor * this.vy
    }
}

class ParticleSystem {
    constructor(game) {
        this.game = game
        this.setup()
    }
    static new(game) {
        return new this(game)
    }
    setup() {
        this.duration = 50
        this.x = 150
        this.y = 200
        this.numberOfPaticles = 100
        this.particles = []
    }
    update() {
        this.duration--
        //添加小火花
        if (this.particles.length < this.numberOfPaticles) {
            var p = GuaPraticle.new(this.game)
            //设置初始化坐标
            var speed = 2
            var vx = randomBetween(-speed, speed)
            var vy = randomBetween(-speed, speed)
            p.init(this.x, this.y, vx, vy)
            this.particles.push(p)
        }
        //更新所有的小火花
        for (var p of this.particles) {
            p.update()
        }
        //删除死掉的小火花
        this.particles = this.particles.filter(p => p.life > 0)
    }
    draw() {
        if (this.duration < 0) {
            //规定时间删除掉
            //临时方案应该从scene删除自己才可以
            return
        }
        for (var p of this.particles) {
            p.draw()
        }
    }
}

class SceneTitle extends PlaneScene {
    constructor(game) {
        super(game)
        var label = GuaLabel.new(game, 'hello')
        this.addElement(label)

        var ps = ParticleSystem.new(game)
        this.addElement(ps)
    }
    draw() {
        super.draw()
        // draw labels
        // this.game.context.fillText('按 k 开始游戏', 100, 190)
    }
}