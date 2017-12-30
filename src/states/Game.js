import {
  Physics,
  State,
} from 'phaser'

export default class extends State {
  init () {
    this.physics.startSystem(Physics.ARCADE)
  }

  create () {
    this.tourist = this.add.sprite(this.world.centerX, this.world.centerY, 'tourist')
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
  }

  update () {
    if (this.tourist.data.isGrabbed) {
      if (this.input.activePointer.withinGame === false) {
        this.launchTourist()
      }

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
}
