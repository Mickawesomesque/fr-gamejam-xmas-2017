import { State } from 'phaser'
import { centerGameObjects } from '../utils'

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
    this.load.image('tourist', 'assets/images/mushroom2.png')
    this.load.image('tourist-drag', 'assets/images/tourist-drag.png')
  }

  create () {
    this.state.start('Game')
  }
}
