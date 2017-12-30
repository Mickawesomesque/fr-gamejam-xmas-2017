import {
  Camera,
  Physics,
  State,
  Timer,
} from 'phaser'

export default class extends State {
  init () {
    this.physics.startSystem(Physics.ARCADE)
  }

  create () {
    this.tourist = this.add.sprite(
      this.rnd.pick([100, this.game.width - 100]),
      this.rnd.between(100, this.game.height - 100),
      'tourist'
    )
    this.physics.enable(this.tourist, Physics.ARCADE)
    this.tourist.anchor.setTo(0.5)
    this.tourist.body.allowDrag = true
    this.tourist.body.bounce.setTo(0.3)
    this.tourist.body.collideWorldBounds = true
    this.tourist.body.drag.setTo(10)
    this.tourist.body.maxVelocity.setTo(500)
    this.tourist.data.isGrabbed = false
    this.tourist.events.onInputDown.add(this.grabTourist, this)
    this.tourist.events.onInputUp.add(this.launchTourist, this)
    this.tourist.inputEnabled = true
    this.tourist.input.start(0, true)

    this.touristDrag = this.add.tileSprite(0, 0, 16, 16, 'tourist-drag')
    this.physics.enable(this.touristDrag, Physics.ARCADE)
    this.touristDrag.alpha = 0
    this.touristDrag.anchor.setTo(0.5, 0)
    this.touristDrag.body.allowGravity = true

    this.yeti = this.add.sprite(this.world.centerX, this.world.centerY, 'yeti')
    this.physics.enable(this.yeti, Physics.ARCADE)
    this.world.sendToBack(this.yeti)
    this.yeti.anchor.setTo(0.5)
    this.yeti.body.immovable = true

    const yetiBodyRadius = this.yeti.width / 2
    this.yeti.body.setCircle(
      yetiBodyRadius,
      -yetiBodyRadius + 0.5 * (this.yeti.width / this.yeti.scale.x),
      -yetiBodyRadius + 0.5 * (this.yeti.height / this.yeti.scale.y)
    )
    this.yeti.scale.setTo(2)
  }

  update () {
    this.physics.arcade.collide(this.tourist, this.yeti, this.wakePissedOffYeti, null, this)

    if (this.yeti.data.isPissedOff) {
      return
    }

    if (this.tourist.data.isGrabbed) {
      const rotation = this.physics.arcade.angleToPointer(this.tourist) - (90 * (Math.PI / 180))

      this.touristDrag.alpha = 1
      this.touristDrag.height = this.physics.arcade.distanceToPointer(this.tourist)
      this.touristDrag.rotation = rotation
    }
  }

  grabTourist (_, pointer) {
    this.tourist.body.stop()
    this.tourist.body.allowGravity = false
    this.tourist.data.isGrabbed = true
    this.tourist.moves = false

    this.touristDrag.x = this.tourist.x
    this.touristDrag.y = this.tourist.y
  }

  launchTourist () {
    const vx = (this.tourist.x - this.input.activePointer.worldX) * 2
    const vy = (this.tourist.y - this.input.activePointer.worldY) * 2

    this.tourist.body.allowGravity = true
    this.tourist.body.velocity.setTo(vx, vy)
    this.tourist.data.isGrabbed = false
    this.tourist.moves = true

    this.touristDrag.alpha = 0
  }

  wakePissedOffYeti () {
    this.camera.shake(0.01, Timer.SECOND, true, Camera.SHAKE_BOTH, true)
    this.tourist.body.stop()
    this.world.bringToTop(this.yeti)

    this.tourist.body.moves = false
    this.yeti.data.isPissedOff = true
  }
}
