export const centerGameObjects = (objects) => {
  objects.forEach(function (object) {
    object.anchor.setTo(0.5)
  })
}

export const changeState = (game, key) => {
  game.camera.fade('#FFFFFF')
  game.camera.onFadeComplete.add(() => game.state.start(key), game)
}
