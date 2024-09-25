import SvgIcon from '@/components/SvgIcon/index.vue'

/** Components registered globally by app.component need to declare TS types here to get type hints provided by the Volar plugin) */
declare module 'vue' {
  export interface GlobalComponents {
    SvgIcon: typeof SvgIcon
  }
}

export {}
