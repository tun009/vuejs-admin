/// <reference types="vitest" />

import { type ConfigEnv, type UserConfigExport, loadEnv } from 'vite'
import path, { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import svgLoader from 'vite-svg-loader'

export default ({ mode }: ConfigEnv): UserConfigExport => {
  loadEnv(mode, process.cwd()) as ImportMetaEnv
  return {
    /** Modify base according to actual situation when packaging */
    // base: VITE_PUBLIC_PATH,
    resolve: {
      alias: {
        /** The @ symbol points to the src directory */
        '@': resolve(__dirname, './src')
      }
    },
    server: {
      /** Set host: true to use Network to access the project by IP */
      host: true, // host: "0.0.0.0"
      /** Port number */
      port: 8080,
      /** Whether to open the browser automatically */
      open: false,
      /** Cross-domain settings allowed */
      cors: true,
      /** Whether to exit directly when the port is occupied */
      strictPort: false,
      /** Warm up common files to increase the initial page loading speed */
      warmup: {
        clientFiles: ['./src/layouts/**/*.vue']
      }
      // hmr: {
      //   overlay: false
      // }
    },
    build: {
      /** Issue a warning when the size of a single chunk file exceeds 2048KB */
      chunkSizeWarningLimit: 2048,
      /** Disable gzip compressed size reporting */
      reportCompressedSize: false,
      /** Static resource directory after packaging */
      assetsDir: 'static',
      rollupOptions: {
        output: {
          /**
           * Chunking strategy
           * 1. Note that these package names must exist, otherwise packaging will fail
           * 2. If you don't want to customize the chunk splitting strategy, you can directly remove this configuration
           */
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia'],
            element: ['element-plus', '@element-plus/icons-vue']
          }
        }
      }
    },
    /** ProGuard */
    esbuild:
      mode === 'development'
        ? undefined
        : {
            /** Remove console.log when bundling */
            pure: ['console.log'],
            /** Remove debugger when bundling */
            drop: ['debugger'],
            /** Remove all comments when bundling */
            legalComments: 'none'
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
    /** Vitest unit test configuration: https://cn.vitest.dev/config */
    test: {
      include: ['tests/**/*.test.ts'],
      environment: 'jsdom',
      reporters: ['junit'],
      outputFile: {
        junit: './coverage/junit-report.xml'
      },
      coverage: {
        provider: 'v8',
        reporter: ['cobertura'],

        reportOnFailure: true,
        ignoreEmptyLines: true
      }
    }
  }
}
