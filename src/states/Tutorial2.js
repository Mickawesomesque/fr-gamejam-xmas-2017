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
    this.dollar = this.add.sprite(this.world.width - 200, this.world.centerY, 'dollar')
    this.physics.enable(this.dollar, Physics.ARCADE)
    this.dollar.anchor.setTo(0.5)

    this.tourist = new Tourist(this.game, 200, this.world.centerY)

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
        'To get fame',
        {
          align: 'center',
          fill: '#0A0A0A',
          font: 'Luckiest Guy',
          fontSize: 42,
        }
      )
      .anchor.setTo(0.5)

    this.instructions = this.add.text(
      this.world.centerX,
      310,
      'Collect dollars',
      {
        align: 'center',
        fill: '#0A0A0A',
        font: 'Luckiest Guy',
        fontSize: 64,
      }
    )
    this.instructions.anchor.setTo(0.5)
  }

  update () {
    this.physics.arcade.overlap(this.tourist, this.dollar, this.onCollectDollar, null, this)
  }

  onCollectDollar () {
    this.dollar.kill()

    changeState(this.game, 'Game')
  }
}
