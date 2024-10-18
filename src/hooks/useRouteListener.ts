import { onBeforeUnmount } from 'vue'
import mitt, { type Handler } from 'mitt'
import { type RouteLocationNormalized } from 'vue-router'

/** Type of callback function */
type Callback = (route: RouteLocationNormalized) => void

const emitter = mitt()
const key = Symbol('ROUTE_CHANGE')
let latestRoute: RouteLocationNormalized

/** Set the latest routing information and trigger routing change events */
export const setRouteChange = (to: RouteLocationNormalized) => {
  // Triggering Events
  emitter.emit(key, to)
  // Cache the latest routing information
  latestRoute = to
}

/** Listening to routes alone will waste rendering performance. Use the publish-subscribe model for distribution management */
export function useRouteListener() {
  /** Callback function collection */
  const callbackList: Callback[] = []

  /** Listen for route changes (can be executed immediately) */
  const listenerRouteChange = (callback: Callback, immediate = false) => {
    // Cache callback function
    callbackList.push(callback)
    // Listen for events
    emitter.on(key, callback as Handler)
    // You can choose to execute a callback function immediately
    immediate && latestRoute && callback(latestRoute)
  }

  /** Remove route change event listener */
  const removeRouteListener = (callback: Callback) => {
    emitter.off(key, callback as Handler)
  }

  /** Remove listener before component destruction */
  onBeforeUnmount(() => {
    for (const callback of callbackList) {
      removeRouteListener(callback)
    }
  })

  return { listenerRouteChange, removeRouteListener }
}
