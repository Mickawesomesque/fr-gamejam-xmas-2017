import {
  Physics,
  Sprite,
} from 'phaser'

export default class extends Sprite {
  constructor (game, x, y) {
    super(game, x, y, 'tourist')

    game.physics.enable(this, Physics.ARCADE)
    game.add.existing(this)

    this.anchor.setTo(0.5)
    this.body.allowDrag = true
    this.body.bounce.setTo(0.3)
    this.body.collideWorldBounds = true
    this.body.drag.setTo(10)
    this.body.maxVelocity.setTo(500)
    this.data.isGrabbed = false
    this.data.grabEnabled = true
    this.events.onInputDown.add(this.grab, this)
    this.events.onInputUp.add(this.launch, this)
    this.inputEnabled = true
    this.input.start(0, true)

    this.body.setSize(64 / this.scale.x, 96 / this.scale.y, 24, 16)

    this.dragTrail = this.game.add.tileSprite(0, 0, 16, 16, 'tourist-drag')
    this.game.physics.enable(this.dragTrail, Physics.ARCADE)
    this.dragTrail.alpha = 0
    this.dragTrail.anchor.setTo(0.5, 0)
    this.dragTrail.body.allowGravity = true
  }

  update () {
    if (this.data.isGrabbed) {
      const rotation = this.game.physics.arcade.angleToPointer(this) - (90 * (Math.PI / 180))

      this.dragTrail.alpha = 1
      this.dragTrail.height = this.game.physics.arcade.distanceToPointer(this)
      this.dragTrail.rotation = rotation
    }
  }

  disable () {
    this.body.stop()
    this.body.moves = false
    this.data.grabEnabled = false
  }

  grab (_, pointer) {
    if (!this.data.grabEnabled) {
      return
    }

    this.body.stop()
    this.body.allowGravity = false
    this.data.isGrabbed = true

    this.dragTrail.x = this.x
    this.dragTrail.y = this.y
  }

  launch () {
    const vx = (this.x - this.game.input.activePointer.worldX) * 2
    const vy = (this.y - this.game.input.activePointer.worldY) * 2

    this.body.allowGravity = true
    this.body.velocity.setTo(vx, vy)
    this.data.isGrabbed = false

    this.dragTrail.alpha = 0
  }

  toggleGrab (grab) {
    this.data.grabEnabled = grab || !this.data.grabEnabled
  }
}
