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

    this.hand = this.add.sprite(this.tourist.x, this.tourist.y, 'hand')
    this.hand.anchor.setTo(0.4, 0.1)

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

    this.add
      .text(
        this.world.centerX,
        250,
        'To launch the snowboarder',
        {
          align: 'center',
          fill: '#0A0A0A',
          font: 'Luckiest Guy',
          fontSize: 42,
        }
      )
      .anchor.setTo(0.5)

    const action = this.game.device.desktop ? 'Click' : 'Tap'
    this.instructions = this.add.text(
      this.world.centerX,
      310,
      `${action} & drag`,
      {
        align: 'center',
        fill: '#0A0A0A',
        font: 'Luckiest Guy',
        fontSize: 64,
      }
    )
    this.instructions.anchor.setTo(0.5)

    this.handTween = this.add.tween(this.hand)
      .to({ x: 200, y: 650 }, 1.3 * Timer.SECOND, Easing.Linear.None)
      .loop(true)
      .start(Timer.SECOND)

    this.timer = null
  }

  update () {
    if (this.tourist.data.isGrabbed && !this.timer) {
      this.timer = this.time.create()
      this.timer.add(0.5 * Timer.HALF, changeState, this, this, 'Tutorial2')
      this.timer.start()
    }
  }
}
