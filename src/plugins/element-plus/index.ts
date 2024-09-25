import { type App } from 'vue'
import ElementPlus from 'element-plus'

export function loadElementPlus(app: App) {
  /** Element Plus component is fully introduced */
  app.use(ElementPlus)
}
