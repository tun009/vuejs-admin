import { type Ref, onBeforeUnmount, ref } from 'vue'
import { debounce } from 'lodash-es'

type Observer = {
  watermarkElMutationObserver?: MutationObserver
  parentElMutationObserver?: MutationObserver
  parentElResizeObserver?: ResizeObserver
}

/** Default configuration */
const defaultConfig = {
  /** Defense (enabled by default, can prevent watermark from being deleted or hidden, but may cause performance loss) */
  defense: true,
  /** Text color */
  color: '#c0c4cc',
  /** Text transparency */
  opacity: 0.5,
  /** Text font size */
  size: 16,
  /** Text font */
  family: 'serif',
  /** Text tilt angle */
  angle: -20,
  /** The width of a watermark (the larger the value, the lower the watermark density) */
  width: 300,
  /** The height of a watermark (the larger the value, the lower the watermark density) */
  height: 200
}

type DefaultConfig = typeof defaultConfig

/** body element */
const bodyEl = ref<HTMLElement>(document.body)

/**
 * Create a watermark
 * 1. You can choose to pass in the container element to mount the watermark, the default is body
 * 2. Watermark defense is done, which can effectively prevent others from opening the console to delete or hide the watermark
 */
export function useWatermark(parentEl: Ref<HTMLElement | null> = bodyEl) {
  /** Backup text */
  let backupText: string
  /** Final configuration */
  let mergeConfig: DefaultConfig
  /** Watermark element */
  let watermarkEl: HTMLElement | null = null
  /** Observer */
  const observer: Observer = {
    watermarkElMutationObserver: undefined,
    parentElMutationObserver: undefined,
    parentElResizeObserver: undefined
  }

  /** Creating a base64 image */
  const createBase64 = () => {
    const { color, opacity, size, family, angle, width, height } = mergeConfig
    const canvasEl = document.createElement('canvas')
    canvasEl.width = width
    canvasEl.height = height
    const ctx = canvasEl.getContext('2d')
    if (ctx) {
      ctx.fillStyle = color
      ctx.globalAlpha = opacity
      ctx.font = `${size}px ${family}`
      ctx.rotate((Math.PI / 180) * angle)
      ctx.fillText(backupText, 0, height / 2)
    }
    return canvasEl.toDataURL()
  }

  /** Update watermark element */
  const updateWatermarkEl = (
    options: Partial<{
      width: number
      height: number
    }> = {}
  ) => {
    if (!watermarkEl) return
    backupText && (watermarkEl.style.background = `url(${createBase64()}) left top repeat`)
    options.width && (watermarkEl.style.width = `${options.width}px`)
    options.height && (watermarkEl.style.height = `${options.height}px`)
  }

  /** Remove the listener for the watermark element and container element. You can specify which listener to remove by passing a parameter. If no parameter is passed, all listeners are removed by default. */
  const removeListener = (kind: 'mutation' | 'resize' | 'all' = 'all') => {
    // Remove mutation listener
    if (kind === 'mutation' || kind === 'all') {
      observer.watermarkElMutationObserver?.disconnect()
      observer.watermarkElMutationObserver = undefined
      observer.parentElMutationObserver?.disconnect()
      observer.parentElMutationObserver = undefined
    }
    // Remove resize listener
    if (kind === 'resize' || kind === 'all') {
      observer.parentElResizeObserver?.disconnect()
      observer.parentElResizeObserver = undefined
    }
  }

  /** Clear Watermark */
  const clearWatermark = () => {
    if (!parentEl.value || !watermarkEl) return
    // Remove the listener for the watermark element and container element
    removeListener()
    // Remove the watermark element
    try {
      parentEl.value.removeChild(watermarkEl)
    } catch {
      // For example, in the absence of defense, the user opens the console and deletes this element
      console.warn('The watermark element no longer exists, please recreate it')
    } finally {
      watermarkEl = null
    }
  }

  /** Creating a watermark element */
  const createWatermarkEl = () => {
    const isBody = parentEl.value!.tagName.toLowerCase() === bodyEl.value.tagName.toLowerCase()
    const watermarkElPosition = isBody ? 'fixed' : 'absolute'
    const parentElPosition = isBody ? '' : 'relative'
    watermarkEl = document.createElement('div')
    watermarkEl.style.pointerEvents = 'none'
    watermarkEl.style.top = '0'
    watermarkEl.style.left = '0'
    watermarkEl.style.position = watermarkElPosition
    watermarkEl.style.zIndex = '99999'
    const { clientWidth, clientHeight } = parentEl.value!
    updateWatermarkEl({ height: clientHeight, width: clientWidth })
    // Set the watermark container to relative positioning
    parentEl.value!.style.position = parentElPosition
    // Add the watermark element to the watermark container
    parentEl.value!.appendChild(watermarkEl)
  }

  /** Listen for changes in watermark elements and container elements (DOM changes & DOM size changes) */
  const addElListener = (targetNode: HTMLElement) => {
    // Determine whether to enable defense
    if (mergeConfig.defense) {
      // Prevent repeated addition of listeners
      if (!observer.watermarkElMutationObserver && !observer.parentElMutationObserver) {
        // Listen for DOM changes
        // eslint-disable-next-line no-use-before-define
        addMutationListener(targetNode)
      }
    } else {
      // No mutation listener is needed when there is no defense
      removeListener('mutation')
    }
    // Prevent repeated addition of listeners
    if (!observer.parentElResizeObserver) {
      // Listen for DOM size changes
      // eslint-disable-next-line no-use-before-define
      addResizeListener(targetNode)
    }
  }

  /** Refresh watermark (called during defense) */
  const updateWatermark = debounce(() => {
    clearWatermark()
    createWatermarkEl()
    addElListener(parentEl.value!)
  }, 100)

  /** Listen for DOM changes */
  const addMutationListener = (targetNode: HTMLElement) => {
    // Callback executed when a change is observed
    const mutationCallback = debounce((mutationList: MutationRecord[]) => {
      // Watermark defense (prevent users from manually deleting watermark elements or hiding watermarks via CSS)
      mutationList.forEach(
        debounce((mutation: MutationRecord) => {
          switch (mutation.type) {
            case 'attributes':
              mutation.target === watermarkEl && updateWatermark()
              break
            case 'childList':
              mutation.removedNodes.forEach((item) => {
                item === watermarkEl && targetNode.appendChild(watermarkEl)
              })
              break
          }
        }, 100)
      )
    }, 100)
    // Create an observer instance and pass in a callback
    observer.watermarkElMutationObserver = new MutationObserver(mutationCallback)
    observer.parentElMutationObserver = new MutationObserver(mutationCallback)
    // Start observing the target node with the above configuration
    observer.watermarkElMutationObserver.observe(watermarkEl!, {
      // Observe whether the target node attributes have changed, the default is true
      attributes: true,
      // Observe whether the target child node has been added or deleted, the default is false
      childList: false,
      // Whether to expand to observe all descendant nodes, the default is false
      subtree: false
    })
    observer.parentElMutationObserver.observe(targetNode, {
      attributes: false,
      childList: true,
      subtree: false
    })
  }

  /** Set watermark */
  const setWatermark = (text: string, config: Partial<DefaultConfig> = {}) => {
    if (!parentEl.value) {
      console.warn('Please call the setWatermark method to set the watermark after DOM mounting is completed')
      return
    }
    // Backup text
    backupText = text
    // Merge configuration
    mergeConfig = { ...defaultConfig, ...config }
    // Create or update watermark element
    watermarkEl ? updateWatermarkEl() : createWatermarkEl()
    // Listen for changes in watermark element and container element
    addElListener(parentEl.value)
  }

  /** Listen for DOM size changes */
  const addResizeListener = (targetNode: HTMLElement) => {
    // Update the size of the entire watermark when the size of the targetNode element changes
    const resizeCallback = debounce(() => {
      const { clientWidth, clientHeight } = targetNode
      updateWatermarkEl({ width: clientWidth, height: clientHeight })
    }, 500)
    // Create an observer instance and pass in a callback
    observer.parentElResizeObserver = new ResizeObserver(resizeCallback)
    // Start observing the target node
    observer.parentElResizeObserver.observe(targetNode)
  }

  /** Remove watermarks and various listeners before the component is uninstalled */
  onBeforeUnmount(() => {
    clearWatermark()
  })

  return { setWatermark, clearWatermark }
}
