// core
import { createApp } from 'vue'

import App from '@/App.vue'
import store from '@/store'
import router from '@/router'
import '@/router/permission'
// load
import { loadSvg } from '@/icons'
import { loadPlugins } from '@/plugins'
import { loadDirectives } from '@/directives'
// css
import 'normalize.css'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/styles/index.scss'
import '@/styles/tailwind.css'

const app = createApp(App)

/** Load plugins */
loadPlugins(app)
/** Load global SVG */
loadSvg(app)
/** Load custom directives */
loadDirectives(app)

app.use(store).use(router)
router.isReady().then(() => {
  app.mount('#app')
})
