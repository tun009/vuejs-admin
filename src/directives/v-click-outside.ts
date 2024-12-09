import { DirectiveBinding } from 'vue'

// click-outside.directive.ts
export default {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const handler = (event: Event) => {
      if (!el.contains(event.target as Node)) {
        binding.value()
      }
    }

    document.addEventListener('click', handler)

    // Store the handler on the Vue component instance
    ;(el as any)._vueClickOutsideHandler = handler
  },
  unmounted(el: HTMLElement) {
    document.removeEventListener('click', (el as any)._vueClickOutsideHandler)
    delete (el as any)._vueClickOutsideHandler
  }
}
