import {
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

    this.add
      .text(
        this.world.centerX,
        100,
        'Tutorial',
        {
          align: 'center',
          fill: '#0A0A0A',
          font: 'Luckiest Guy',
          fontSize: 124,
        }
      )
      .anchor.setTo(0.5)

    this.instructions = this.add.text(
      this.world.centerX,
      310,
      'Avoid the Yeti!',
      {
        align: 'center',
        fill: '#0A0A0A',
        font: 'Luckiest Guy',
        fontSize: 64,
      }
    )
    this.instructions.anchor.setTo(0.5)

    this.wakeYeti()
  }

  update () {
    if (this.yeti.x === this.yetiDestination.x && this.yeti.y === this.yetiDestination.y) {
      changeState(this.game, 'Game')
    }

    this.physics.arcade.overlap(
      this.tourist,
      this.yetiArea, () => { changeState(this.game, 'Tutorial3') },
      null,
      this
    )

    this.yetiArea.x = this.yeti.x
    this.yetiArea.y = this.yeti.y
  }

  wakeYeti () {
    this.yetiDestination.x = this.tourist.x
    this.yetiDestination.y = this.tourist.y

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
  }
}
