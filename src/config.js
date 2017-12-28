import {
  AUTO,
  ScaleManager,
} from 'phaser'

import { name as pkgName } from '../package.json'

export default {
  height: '100%',
  localStorageName: pkgName,
  // parent: 'content',
  renderer: AUTO,
  scaleMode: ScaleManager.SHOW_ALL,
  width: '100%',
}
