import {
  Camera,
  Easing,
  Physics,
  State,
  Timer,
} from 'phaser'

import Tourist from '../actors/Tourist'

import { changeState } from '../utils'

export default class extends State {
  init () {
    this.physics.startSystem(Physics.ARCADE)
  }

  create () {
    this.dollars = this.add.group()
    this.dollars.enableBody = true
    this.dollars.physicsBodyType = Physics.ARCADE

    this.tourist = new Tourist(this.game, this.world.centerX, this.world.centerY)

    this.yeti = this.add.sprite(
      this.rnd.between(100, this.world.width - 100),
      this.world.height - 200,
      'yeti'
    )
    this.physics.enable(this.yeti, Physics.ARCADE)
    this.world.sendToBack(this.yeti)
    this.yeti.anchor.setTo(0.5)
    this.yeti.collideWorldBounds = true
    this.yeti.body.immovable = true
    this.yeti.data.awakeningDelay = this.time.create(false)
    this.yeti.data.awakeningDelay.add(5 * Timer.SECOND, this.onYetiAwakening, this)
    this.yeti.data.awakeningDelay.start()
    this.yeti.data.movingDelay = this.time.create(false)
    this.yeti.scale.setTo(0.7)

    const yetiBodyRadius = this.yeti.width / 2
    this.yeti.body.setCircle(
      yetiBodyRadius,
      -yetiBodyRadius + 0.5 * (this.yeti.width / this.yeti.scale.x),
      -yetiBodyRadius + 0.5 * (this.yeti.height / this.yeti.scale.y)
    )

    this.yetiArea = this.add.sprite(this.yeti.x, this.yeti.y, 'yeti-area')
    this.physics.enable(this.yetiArea, Physics.ARCADE)
    this.world.sendToBack(this.yetiArea)
    this.yetiArea.anchor.setTo(0.5)
    this.yetiArea.body.immovable = true
    this.yetiArea.scale.setTo(1.7)

    const yetiAreaBodyRadius = this.yeti.width / 2
    this.yetiArea.body.setCircle(
      yetiAreaBodyRadius,
      -yetiAreaBodyRadius + 0.5 * (this.yetiArea.width / this.yetiArea.scale.x),
      -yetiAreaBodyRadius + 0.5 * (this.yetiArea.height / this.yetiArea.scale.y)
    )

    this.yetiDestination = this.add.sprite(0, 0, 'yeti-area')
    this.world.sendToBack(this.yetiDestination)
    this.yetiDestination.alpha = 0
    this.yetiDestination.anchor.setTo(0.5)

    const action = this.game.device.desktop ? 'Click' : 'Tap'
    this.gameOverMessage = this.add.text(
      this.world.centerX,
      310,
      `${action} to restart`,
      {
        align: 'center',
        fill: '#0A0A0A',
        font: 'Luckiest Guy',
        fontSize: 64,
      }
    )
    this.gameOverMessage.alpha = 0
    this.gameOverMessage.anchor.setTo(0.5)

    this.yetiAreaAlphaTween = this.add.tween(this.yetiArea)
      .to({ alpha: 0.3 }, Timer.SECOND, Easing.Linear.None, true, 0, -1, true)
    this.yetiAreaScaleTween = this.add.tween(this.yetiArea.scale)
      .to({ x: 2.5, y: 2.5 }, 2 * Timer.SECOND, Easing.Linear.None, true, 0, -1, true)
    this.yetiDestinationAlphaTween = null
    this.yetiMovementTween = null
    this.yetiMovingTween = this.add.tween(this.yeti)
      .to({ angle: this.yeti.angle - 30 }, Timer.SECOND)
      .to({ angle: this.yeti.angle + 30 }, 1.5 * Timer.SECOND)
      .loop(true)
      .yoyo(true)
      .start()

    this.canRestart = false

    this.dollarSpawner = this.time.create(false)
    this.dollarSpawner.add(2 * Timer.SECOND, this.spawnDollar, this)
    this.dollarSpawner.start()
  }

  update () {
    if (this.yeti.data.isPissedOff) {
      if (this.canRestart && this.input.activePointer.isDown) {
        changeState(this.game, 'Game')
      }

      return
    }

    this.physics.arcade.collide(this.tourist, this.yetiArea, this.wakePissedOffYeti, null, this)
    this.physics.arcade.overlap(this.tourist, this.dollars, this.onCollectDollar, null, this)

    this.yetiArea.x = this.yeti.x
    this.yetiArea.y = this.yeti.y
  }

  onCollectDollar (_, dollar) {
    dollar.kill()
  }

  onYetiAwakening () {
    if (this.rnd.between(0, 10) > 7) {
      this.yetiDestination.x = this.tourist.x
      this.yetiDestination.y = this.tourist.y
    } else {
      this.yetiDestination.x = this.rnd.between(
        this.yeti.width,
        this.world.width - this.yeti.width
      )
      this.yetiDestination.y = this.rnd.between(
        this.yeti.height,
        this.world.height - this.yeti.height
      )
    }

    this.yetiDestinationAlphaTween = this.add.tween(this.yetiDestination)
      .from({ alpha: 0.4 }, Timer.HALF, Easing.Linear.None)
      .to({ alpha: 0.6 }, Timer.HALF, Easing.Linear.None)
      .loop(true)
      .start()

    this.yeti.data.movingDelay.add(Timer.SECOND, this.onYetiStartMoving, this)
    this.yeti.data.movingDelay.start()
  }

  onYetiStartMoving () {
    this.yetiMovementTween = this.add.tween(this.yeti)
      .to(
        { x: this.yetiDestination.x, y: this.yetiDestination.y },
        Timer.SECOND,
        Easing.Linear.None,
        true
      )
    this.yetiMovementTween.onComplete.add(() => {
      if (this.yetiDestinationAlphaTween) {
        this.yetiDestinationAlphaTween.stop()
        this.yetiDestination.alpha = 0
      }
    }, this)

    this.yeti.data.awakeningDelay.add(
      this.rnd.between(1, 7) * Timer.SECOND,
      this.onYetiAwakening,
      this
    )
    this.yeti.data.awakeningDelay.start()
  }

  spawnDollar () {
    this.dollars.create(
      this.rnd.between(50, this.world.width - 50),
      this.rnd.between(50, this.world.height - 50),
      'dollar'
    )

    this.dollarSpawner.add((this.rnd.frac() * 5) * Timer.SECOND, this.spawnDollar, this)
    this.dollarSpawner.start()
  }

  wakePissedOffYeti () {
    this.camera.shake(0.01, Timer.SECOND, true, Camera.SHAKE_BOTH, true)
    this.yeti.body.stop()
    this.yeti.data.awakeningDelay.stop()
    this.world.bringToTop(this.yetiArea)
    this.world.bringToTop(this.yeti)
    this.yetiAreaAlphaTween.stop()
    this.yetiAreaScaleTween.stop()

    if (this.yetiMovementTween) {
      this.yetiMovementTween.stop(true)
      this.yetiMovementTween = null
    }

    this.yetiMovingTween.stop()
    this.yeti.angle = 0

    const areaSize = Math.max(this.yetiArea.width, this.yetiArea.height) / this.yetiArea.scale.x
    const scale = (Math.max(this.world.width, this.world.height) / areaSize) + 10
    this.add.tween(this.yetiArea.scale)
      .to({ x: scale, y: scale }, Timer.HALF, Easing.Linear.None, true)

    this.yeti.data.isPissedOff = true
    this.yetiArea.alpha = 0.3

    this.tourist.disable()

    this.add.tween(this.gameOverMessage)
      .to({ alpha: 1 }, Timer.SECOND, Easing.Linear.None, true, Timer.SECOND)
      .onComplete.add(() => { this.canRestart = true }, this)
  }
}
