import { onBeforeMount, onMounted, onBeforeUnmount } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { useRouteListener } from '@/hooks/useRouteListener'
import { DeviceEnum } from '@/constants/app-key'

/** Refer to Bootstrap's responsive design to set the maximum mobile width to 992 */
const MAX_MOBILE_WIDTH = 992

/** Change the Layout layout according to the browser width */
export default () => {
  const appStore = useAppStore()
  const { listenerRouteChange } = useRouteListener()

  /** Used to determine whether the current device is a mobile device */
  const _isMobile = () => {
    const rect = document.body.getBoundingClientRect()
    return rect.width - 1 < MAX_MOBILE_WIDTH
  }

  /** Used to handle window size change events */
  const _resizeHandler = () => {
    if (!document.hidden) {
      const isMobile = _isMobile()
      appStore.toggleDevice(isMobile ? DeviceEnum.Mobile : DeviceEnum.Desktop)
      isMobile && appStore.closeSidebar(true)
    }
  }
  /** Listen for route changes and adjust layout according to device type */
  listenerRouteChange(() => {
    if (appStore.device === DeviceEnum.Mobile && appStore.sidebar.opened) {
      appStore.closeSidebar(false)
    }
  })

  /** Add window size change event listener before component mounting */
  onBeforeMount(() => {
    window.addEventListener('resize', _resizeHandler)
  })

  /** After the component is mounted, determine the device type based on the window size and adjust the layout */
  onMounted(() => {
    if (_isMobile()) {
      appStore.toggleDevice(DeviceEnum.Mobile)
      appStore.closeSidebar(true)
    }
  })

  /** Remove the window size change event listener before the component is uninstalled */
  onBeforeUnmount(() => {
    window.removeEventListener('resize', _resizeHandler)
  })
}
