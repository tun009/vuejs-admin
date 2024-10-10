import { reactive, ref, watch } from 'vue'
import { defineStore } from 'pinia'

import { getSidebarStatus, setSidebarStatus } from '@/utils/cache/local-storage'
import { DeviceEnum, SIDEBAR_OPENED, SIDEBAR_CLOSED } from '@/constants/app-key'

interface Sidebar {
  opened: boolean
  withoutAnimation: boolean
}

/** Set the sidebar status local cache */
function handleSidebarStatus(opened: boolean) {
  opened ? setSidebarStatus(SIDEBAR_OPENED) : setSidebarStatus(SIDEBAR_CLOSED)
}

export const useAppStore = defineStore('app', () => {
  /** Sidebar status */
  const sidebar: Sidebar = reactive({
    opened: getSidebarStatus() !== SIDEBAR_CLOSED,
    withoutAnimation: false
  })
  /** Device type */
  const device = ref<DeviceEnum>(DeviceEnum.Desktop)

  /** Listen for sidebar opened status */
  watch(
    () => sidebar.opened,
    (opened) => handleSidebarStatus(opened)
  )

  /** Switch sidebar */
  const toggleSidebar = (withoutAnimation: boolean) => {
    sidebar.opened = !sidebar.opened
    sidebar.withoutAnimation = withoutAnimation
  }
  /** Close sidebar */
  const closeSidebar = (withoutAnimation: boolean) => {
    sidebar.opened = false
    sidebar.withoutAnimation = withoutAnimation
  }
  /** Switch device type */
  const toggleDevice = (value: DeviceEnum) => {
    device.value = value
  }

  return { closeSidebar, device, sidebar, toggleDevice, toggleSidebar }
})
