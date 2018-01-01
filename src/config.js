import {
  AUTO,
  ScaleManager,
} from 'phaser'

import { name as pkgName } from '../package.json'

export default {
  height: 960,
  localStorageName: pkgName,
  // parent: 'content',
  renderer: AUTO,
  scaleMode: ScaleManager.SHOW_ALL,
  width: 640,
}
