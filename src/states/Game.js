import {
  Camera,
  Easing,
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

    const touristBodyRadius = this.tourist.width / 3
    this.tourist.body.setCircle(
      touristBodyRadius,
      -touristBodyRadius + 0.5 * (this.tourist.width / this.tourist.scale.x),
      -touristBodyRadius + 0.5 * (this.tourist.height / this.tourist.scale.y)
    )

    this.touristDrag = this.add.tileSprite(0, 0, 16, 16, 'tourist-drag')
    this.physics.enable(this.touristDrag, Physics.ARCADE)
    this.touristDrag.alpha = 0
    this.touristDrag.anchor.setTo(0.5, 0)
    this.touristDrag.body.allowGravity = true

    this.yeti = this.add.sprite(this.world.centerX, this.world.centerY, 'yeti')
    this.physics.enable(this.yeti, Physics.ARCADE)
    this.world.sendToBack(this.yeti)
    this.yeti.anchor.setTo(0.5)
    this.yeti.collideWorldBounds = true
    this.yeti.body.immovable = true
    this.yeti.data.awakeningDelay = this.time.create(false)
    this.yeti.data.awakeningDelay.add(5 * Timer.SECOND, this.onYetiAwakening, this)
    this.yeti.data.awakeningDelay.start()

    const yetiBodyRadius = this.yeti.width / 2
    this.yeti.body.setCircle(
      yetiBodyRadius,
      -yetiBodyRadius + 0.5 * (this.yeti.width / this.yeti.scale.x),
      -yetiBodyRadius + 0.5 * (this.yeti.height / this.yeti.scale.y)
    )
    this.yeti.scale.setTo(2)

    this.yetiArea = this.add.sprite(this.yeti.x, this.yeti.y, 'yeti-area')
    this.physics.enable(this.yetiArea, Physics.ARCADE)
    this.world.sendToBack(this.yetiArea)
    this.yetiArea.anchor.setTo(0.5)
    this.yetiArea.body.immovable = true
    this.yetiArea.scale.setTo(1.5)

    const yetiAreaBodyRadius = this.yeti.width / 2
    this.yetiArea.body.setCircle(
      yetiAreaBodyRadius,
      -yetiAreaBodyRadius + 0.5 * (this.yetiArea.width / this.yetiArea.scale.x),
      -yetiAreaBodyRadius + 0.5 * (this.yetiArea.height / this.yetiArea.scale.y)
    )

    this.yetiAreaAlphaTween = this.add.tween(this.yetiArea)
      .to({ alpha: 0.3 }, Timer.SECOND, Easing.Linear.None, true, 0, -1, true)
    this.yetiAreaScaleTween = this.add.tween(this.yetiArea.scale)
      .to({ x: 2.5, y: 2.5 }, 2 * Timer.SECOND, Easing.Linear.None, true, 0, -1, true)
    this.yetiMovingTween = null
  }

  update () {
    if (this.yeti.data.isPissedOff) {
      return
    }

    this.physics.arcade.collide(this.tourist, this.yetiArea, this.wakePissedOffYeti, null, this)

    this.yetiArea.x = this.yeti.x
    this.yetiArea.y = this.yeti.y

    if (this.tourist.data.isGrabbed) {
      const rotation = this.physics.arcade.angleToPointer(this.tourist) - (90 * (Math.PI / 180))

      this.touristDrag.alpha = 1
      this.touristDrag.height = this.physics.arcade.distanceToPointer(this.tourist)
      this.touristDrag.rotation = rotation
    }
  }

  render () {
    this.game.debug.body(this.yeti)
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

  onYetiAwakening () {
    const x = this.rnd.between(this.yeti.width, this.world.width - this.yeti.width)
    const y = this.rnd.between(this.yeti.height, this.world.height - this.yeti.height)

    this.yetiMovingTween = this.add.tween(this.yeti)
      .to({ x, y }, Timer.SECOND, Easing.Linear.None, true)

    this.yeti.data.awakeningDelay.add(
      this.rnd.between(1, 7) * Timer.SECOND,
      this.onYetiAwakening,
      this
    )
    this.yeti.data.awakeningDelay.start()
  }

  wakePissedOffYeti () {
    this.camera.shake(0.01, Timer.SECOND, true, Camera.SHAKE_BOTH, true)
    this.tourist.body.stop()
    this.yeti.body.stop()
    this.yeti.data.awakeningDelay.stop()
    this.world.bringToTop(this.yetiArea)
    this.world.bringToTop(this.yeti)
    this.yetiAreaAlphaTween.stop()
    this.yetiAreaScaleTween.stop()

    if (this.yetiMovingTween) {
      this.yetiMovingTween.stop()
    }

    const areaSize = Math.max(this.yetiArea.width, this.yetiArea.height) / this.yetiArea.scale.x
    const scale = (Math.max(this.world.width, this.world.height) / areaSize) + 10
    this.add.tween(this.yetiArea.scale)
      .to({ x: scale, y: scale }, Timer.HALF, Easing.Linear.None, true)

    this.tourist.body.moves = false
    this.yeti.data.isPissedOff = true
    this.yetiArea.alpha = 0.3
  }
}
