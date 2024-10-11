/// <reference types="vitest" />

import { type ConfigEnv, type UserConfigExport, loadEnv } from 'vite'
import path, { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import svgLoader from 'vite-svg-loader'

export default ({ mode }: ConfigEnv): UserConfigExport => {
  const viteEnv = loadEnv(mode, process.cwd()) as ImportMetaEnv
  const { VITE_PUBLIC_PATH } = viteEnv
  // eslint-disable-next-line no-console
  console.log(VITE_PUBLIC_PATH)
  return {
    build: {
      /** Static resource directory after packaging */
      assetsDir: 'static',

      /** Issue a warning when the size of a single chunk file exceeds 2048KB */
      chunkSizeWarningLimit: 2048,

      /** Disable gzip compressed size reporting */
      reportCompressedSize: false,
      rollupOptions: {
        output: {
          /**
           * Chunking strategy
           * 1. Note that these package names must exist, otherwise packaging will fail
           * 2. If you don't want to customize the chunk splitting strategy, you can directly remove this configuration
           */
          manualChunks: {
            element: ['element-plus', '@element-plus/icons-vue'],
            vue: ['vue', 'vue-router', 'pinia']
          }
        }
      }
    },

    /** ProGuard */
    esbuild:
      mode === 'development'
        ? undefined
        : {
            /** Remove debugger when bundling */
            drop: ['debugger'],

            /** Remove all comments when bundling */
            legalComments: 'none',

            /** Remove console.log when bundling */
            pure: ['console.log']
          },

    /** Vite plugin */
    plugins: [
      vue(),
      vueJsx(),
      /** Convert SVG static images to Vue components */
      svgLoader({ defaultImport: 'url' }),
      /** SVG */
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/icons/svg')],
        symbolId: 'icon-[dir]-[name]'
      })
    ],

    /** Modify base according to actual situation when packaging */
    // base: VITE_PUBLIC_PATH,
    resolve: {
      alias: {
        /** The @ symbol points to the src directory */
        '@': resolve(__dirname, './src')
      }
    },

    server: {
      /** Cross-domain settings allowed */
      cors: true,

      /** Set host: true to use Network to access the project by IP */
      host: true,

      /** Whether to open the browser automatically */
      open: false,

      // host: "0.0.0.0"
      /** Port number */
      port: 8080,
      /** Whether to exit directly when the port is occupied */
      strictPort: false,
      /** Warm up common files to increase the initial page loading speed */
      warmup: {
        clientFiles: ['./src/layouts/**/*.vue']
      }
    },
    /** Vitest unit test configuration: https://cn.vitest.dev/config */
    test: {
      environment: 'jsdom',
      include: ['tests/**/*.test.ts']
    }
  }
}
