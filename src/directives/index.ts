import { type App } from 'vue'
import { permission } from './permission'
import vClickOutside from './v-click-outside'

/** Mount custom instructions */
export function loadDirectives(app: App) {
  app.directive('permission', permission)
  app.directive('click-outside', vClickOutside)
}
