import { State } from 'phaser'

import { centerGameObjects, changeState } from '../utils'

export default class extends State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)
    //
    // load your assets
    //
    this.load.image('hand', 'assets/images/hand.png')
    this.load.image('tourist', 'assets/images/tourist.png')
    this.load.image('tourist-drag', 'assets/images/tourist-drag.png')
    this.load.image('yeti', 'assets/images/yeti.png')
    this.load.image('yeti-area', 'assets/images/yeti-area.png')
  }

  create () {
    changeState(this, 'Tutorial1')
  }
}
