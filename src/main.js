import Phaser from 'phaser'

import BootState from './states/Boot'
import GameState from './states/Game'
import SplashState from './states/Splash'
import Tutorial1State from './states/Tutorial1'
import Tutorial2State from './states/Tutorial2'

import config from './config'

class Game extends Phaser.Game {
  constructor () {
    // const docElement = document.documentElement
    // const width = docElement.clientWidth > config.width ? config.width : docElement.clientWidth
    // const height = docElement.clientHeight > config.height ? config.height : docElement.clientHeight

    // super(width, height, Phaser.CANVAS, 'content', null)

    super(config)

    this.state.add('Boot', BootState, false)
    this.state.add('Splash', SplashState, false)
    this.state.add('Tutorial1', Tutorial1State, false)
    this.state.add('Tutorial2', Tutorial2State, false)
    this.state.add('Game', GameState, false)

    // with Cordova with need to wait that the device is ready so we will call the Boot state in another file
    if (!window.cordova) {
      this.state.start('Boot')
    }
  }
}

window.game = new Game()

if (window.cordova) {
  const app = {
    initialize: function () {
      document.addEventListener(
        'deviceready',
        this.onDeviceReady.bind(this),
        false
      )
    },

    // deviceready Event Handler
    //
    onDeviceReady: function () {
      this.receivedEvent('deviceready')

      // When the device is ready, start Phaser Boot state.
      window.game.state.start('Boot')
    },

    receivedEvent: function (id) {
      console.log('Received Event: ' + id)
    },
  }

  app.initialize()
}
