// vite.config.ts
import { loadEnv } from "file:///home/huydv/HuyDV/Work/Eximbank/eximbank-ui/node_modules/.pnpm/vite@5.4.6_@types+node@22.5.5_sass@1.78.0/node_modules/vite/dist/node/index.js";
import path, { resolve } from "path";
import vue from "file:///home/huydv/HuyDV/Work/Eximbank/eximbank-ui/node_modules/.pnpm/@vitejs+plugin-vue@5.1.4_vite@5.4.6_@types+node@22.5.5_sass@1.78.0__vue@3.5.6_typescript@5.6.2_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///home/huydv/HuyDV/Work/Eximbank/eximbank-ui/node_modules/.pnpm/@vitejs+plugin-vue-jsx@4.0.1_vite@5.4.6_@types+node@22.5.5_sass@1.78.0__vue@3.5.6_typescript@5.6.2_/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import { createSvgIconsPlugin } from "file:///home/huydv/HuyDV/Work/Eximbank/eximbank-ui/node_modules/.pnpm/vite-plugin-svg-icons@2.0.1_vite@5.4.6_@types+node@22.5.5_sass@1.78.0_/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import svgLoader from "file:///home/huydv/HuyDV/Work/Eximbank/eximbank-ui/node_modules/.pnpm/vite-svg-loader@5.1.0_vue@3.5.6_typescript@5.6.2_/node_modules/vite-svg-loader/index.js";
var __vite_injected_original_dirname = "/home/huydv/HuyDV/Work/Eximbank/eximbank-ui";
var vite_config_default = ({ mode }) => {
  loadEnv(mode, process.cwd());
  return {
    /** Modify base according to actual situation when packaging */
    resolve: {
      alias: {
        /** The @ symbol points to the src directory */
        "@": resolve(__vite_injected_original_dirname, "./src")
      }
    },
    server: {
      /** Set host: true to use Network to access the project by IP */
      host: true,
      // host: "0.0.0.0"
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
        clientFiles: ["./src/layouts/**/*.vue"]
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
      assetsDir: "static",
      rollupOptions: {
        output: {
          /**
           * Chunking strategy
           * 1. Note that these package names must exist, otherwise packaging will fail
           * 2. If you don't want to customize the chunk splitting strategy, you can directly remove this configuration
           */
          manualChunks: {
            vue: ["vue", "vue-router", "pinia"],
            element: ["element-plus", "@element-plus/icons-vue"]
          }
        }
      }
    },
    /** ProGuard */
    esbuild: mode === "development" ? void 0 : {
      /** Remove console.log when bundling */
      pure: ["console.log"],
      /** Remove debugger when bundling */
      drop: ["debugger"],
      /** Remove all comments when bundling */
      legalComments: "none"
    },
    /** Vite plugin */
    plugins: [
      vue(),
      vueJsx(),
      /** Convert SVG static images to Vue components */
      svgLoader({ defaultImport: "url" }),
      /** SVG */
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), "src/icons/svg")],
        symbolId: "icon-[dir]-[name]"
      })
    ],
    /** Vitest unit test configuration: https://cn.vitest.dev/config */
    test: {
      include: ["tests/**/*.test.ts"],
      environment: "jsdom"
    }
  };
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9odXlkdi9IdXlEVi9Xb3JrL0V4aW1iYW5rL2V4aW1iYW5rLXVpXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9odXlkdi9IdXlEVi9Xb3JrL0V4aW1iYW5rL2V4aW1iYW5rLXVpL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL2h1eWR2L0h1eURWL1dvcmsvRXhpbWJhbmsvZXhpbWJhbmstdWkvdml0ZS5jb25maWcudHNcIjsvLy8gPHJlZmVyZW5jZSB0eXBlcz1cInZpdGVzdFwiIC8+XG5cbmltcG9ydCB7IHR5cGUgQ29uZmlnRW52LCB0eXBlIFVzZXJDb25maWdFeHBvcnQsIGxvYWRFbnYgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHBhdGgsIHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcbmltcG9ydCB2dWVKc3ggZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlLWpzeCdcbmltcG9ydCB7IGNyZWF0ZVN2Z0ljb25zUGx1Z2luIH0gZnJvbSAndml0ZS1wbHVnaW4tc3ZnLWljb25zJ1xuaW1wb3J0IHN2Z0xvYWRlciBmcm9tICd2aXRlLXN2Zy1sb2FkZXInXG5cbmV4cG9ydCBkZWZhdWx0ICh7IG1vZGUgfTogQ29uZmlnRW52KTogVXNlckNvbmZpZ0V4cG9ydCA9PiB7XG4gIGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSkgYXMgSW1wb3J0TWV0YUVudlxuICByZXR1cm4ge1xuICAgIC8qKiBNb2RpZnkgYmFzZSBhY2NvcmRpbmcgdG8gYWN0dWFsIHNpdHVhdGlvbiB3aGVuIHBhY2thZ2luZyAqL1xuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgIC8qKiBUaGUgQCBzeW1ib2wgcG9pbnRzIHRvIHRoZSBzcmMgZGlyZWN0b3J5ICovXG4gICAgICAgICdAJzogcmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpXG4gICAgICB9XG4gICAgfSxcbiAgICBzZXJ2ZXI6IHtcbiAgICAgIC8qKiBTZXQgaG9zdDogdHJ1ZSB0byB1c2UgTmV0d29yayB0byBhY2Nlc3MgdGhlIHByb2plY3QgYnkgSVAgKi9cbiAgICAgIGhvc3Q6IHRydWUsIC8vIGhvc3Q6IFwiMC4wLjAuMFwiXG4gICAgICAvKiogUG9ydCBudW1iZXIgKi9cbiAgICAgIHBvcnQ6IDgwODAsXG4gICAgICAvKiogV2hldGhlciB0byBvcGVuIHRoZSBicm93c2VyIGF1dG9tYXRpY2FsbHkgKi9cbiAgICAgIG9wZW46IGZhbHNlLFxuICAgICAgLyoqIENyb3NzLWRvbWFpbiBzZXR0aW5ncyBhbGxvd2VkICovXG4gICAgICBjb3JzOiB0cnVlLFxuICAgICAgLyoqIFdoZXRoZXIgdG8gZXhpdCBkaXJlY3RseSB3aGVuIHRoZSBwb3J0IGlzIG9jY3VwaWVkICovXG4gICAgICBzdHJpY3RQb3J0OiBmYWxzZSxcbiAgICAgIC8qKiBXYXJtIHVwIGNvbW1vbiBmaWxlcyB0byBpbmNyZWFzZSB0aGUgaW5pdGlhbCBwYWdlIGxvYWRpbmcgc3BlZWQgKi9cbiAgICAgIHdhcm11cDoge1xuICAgICAgICBjbGllbnRGaWxlczogWycuL3NyYy9sYXlvdXRzLyoqLyoudnVlJ11cbiAgICAgIH1cbiAgICAgIC8vIGhtcjoge1xuICAgICAgLy8gICBvdmVybGF5OiBmYWxzZVxuICAgICAgLy8gfVxuICAgIH0sXG4gICAgYnVpbGQ6IHtcbiAgICAgIC8qKiBJc3N1ZSBhIHdhcm5pbmcgd2hlbiB0aGUgc2l6ZSBvZiBhIHNpbmdsZSBjaHVuayBmaWxlIGV4Y2VlZHMgMjA0OEtCICovXG4gICAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDIwNDgsXG4gICAgICAvKiogRGlzYWJsZSBnemlwIGNvbXByZXNzZWQgc2l6ZSByZXBvcnRpbmcgKi9cbiAgICAgIHJlcG9ydENvbXByZXNzZWRTaXplOiBmYWxzZSxcbiAgICAgIC8qKiBTdGF0aWMgcmVzb3VyY2UgZGlyZWN0b3J5IGFmdGVyIHBhY2thZ2luZyAqL1xuICAgICAgYXNzZXRzRGlyOiAnc3RhdGljJyxcbiAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogQ2h1bmtpbmcgc3RyYXRlZ3lcbiAgICAgICAgICAgKiAxLiBOb3RlIHRoYXQgdGhlc2UgcGFja2FnZSBuYW1lcyBtdXN0IGV4aXN0LCBvdGhlcndpc2UgcGFja2FnaW5nIHdpbGwgZmFpbFxuICAgICAgICAgICAqIDIuIElmIHlvdSBkb24ndCB3YW50IHRvIGN1c3RvbWl6ZSB0aGUgY2h1bmsgc3BsaXR0aW5nIHN0cmF0ZWd5LCB5b3UgY2FuIGRpcmVjdGx5IHJlbW92ZSB0aGlzIGNvbmZpZ3VyYXRpb25cbiAgICAgICAgICAgKi9cbiAgICAgICAgICBtYW51YWxDaHVua3M6IHtcbiAgICAgICAgICAgIHZ1ZTogWyd2dWUnLCAndnVlLXJvdXRlcicsICdwaW5pYSddLFxuICAgICAgICAgICAgZWxlbWVudDogWydlbGVtZW50LXBsdXMnLCAnQGVsZW1lbnQtcGx1cy9pY29ucy12dWUnXVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgLyoqIFByb0d1YXJkICovXG4gICAgZXNidWlsZDpcbiAgICAgIG1vZGUgPT09ICdkZXZlbG9wbWVudCdcbiAgICAgICAgPyB1bmRlZmluZWRcbiAgICAgICAgOiB7XG4gICAgICAgICAgICAvKiogUmVtb3ZlIGNvbnNvbGUubG9nIHdoZW4gYnVuZGxpbmcgKi9cbiAgICAgICAgICAgIHB1cmU6IFsnY29uc29sZS5sb2cnXSxcbiAgICAgICAgICAgIC8qKiBSZW1vdmUgZGVidWdnZXIgd2hlbiBidW5kbGluZyAqL1xuICAgICAgICAgICAgZHJvcDogWydkZWJ1Z2dlciddLFxuICAgICAgICAgICAgLyoqIFJlbW92ZSBhbGwgY29tbWVudHMgd2hlbiBidW5kbGluZyAqL1xuICAgICAgICAgICAgbGVnYWxDb21tZW50czogJ25vbmUnXG4gICAgICAgICAgfSxcbiAgICAvKiogVml0ZSBwbHVnaW4gKi9cbiAgICBwbHVnaW5zOiBbXG4gICAgICB2dWUoKSxcbiAgICAgIHZ1ZUpzeCgpLFxuICAgICAgLyoqIENvbnZlcnQgU1ZHIHN0YXRpYyBpbWFnZXMgdG8gVnVlIGNvbXBvbmVudHMgKi9cbiAgICAgIHN2Z0xvYWRlcih7IGRlZmF1bHRJbXBvcnQ6ICd1cmwnIH0pLFxuICAgICAgLyoqIFNWRyAqL1xuICAgICAgY3JlYXRlU3ZnSWNvbnNQbHVnaW4oe1xuICAgICAgICBpY29uRGlyczogW3BhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCAnc3JjL2ljb25zL3N2ZycpXSxcbiAgICAgICAgc3ltYm9sSWQ6ICdpY29uLVtkaXJdLVtuYW1lXSdcbiAgICAgIH0pXG4gICAgXSxcbiAgICAvKiogVml0ZXN0IHVuaXQgdGVzdCBjb25maWd1cmF0aW9uOiBodHRwczovL2NuLnZpdGVzdC5kZXYvY29uZmlnICovXG4gICAgdGVzdDoge1xuICAgICAgaW5jbHVkZTogWyd0ZXN0cy8qKi8qLnRlc3QudHMnXSxcbiAgICAgIGVudmlyb25tZW50OiAnanNkb20nXG4gICAgfVxuICB9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBRUEsU0FBZ0QsZUFBZTtBQUMvRCxPQUFPLFFBQVEsZUFBZTtBQUM5QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxZQUFZO0FBQ25CLFNBQVMsNEJBQTRCO0FBQ3JDLE9BQU8sZUFBZTtBQVB0QixJQUFNLG1DQUFtQztBQVN6QyxJQUFPLHNCQUFRLENBQUMsRUFBRSxLQUFLLE1BQW1DO0FBQ3hELFVBQVEsTUFBTSxRQUFRLElBQUksQ0FBQztBQUMzQixTQUFPO0FBQUE7QUFBQSxJQUVMLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQTtBQUFBLFFBRUwsS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxNQUNqQztBQUFBLElBQ0Y7QUFBQSxJQUNBLFFBQVE7QUFBQTtBQUFBLE1BRU4sTUFBTTtBQUFBO0FBQUE7QUFBQSxNQUVOLE1BQU07QUFBQTtBQUFBLE1BRU4sTUFBTTtBQUFBO0FBQUEsTUFFTixNQUFNO0FBQUE7QUFBQSxNQUVOLFlBQVk7QUFBQTtBQUFBLE1BRVosUUFBUTtBQUFBLFFBQ04sYUFBYSxDQUFDLHdCQUF3QjtBQUFBLE1BQ3hDO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFJRjtBQUFBLElBQ0EsT0FBTztBQUFBO0FBQUEsTUFFTCx1QkFBdUI7QUFBQTtBQUFBLE1BRXZCLHNCQUFzQjtBQUFBO0FBQUEsTUFFdEIsV0FBVztBQUFBLE1BQ1gsZUFBZTtBQUFBLFFBQ2IsUUFBUTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQU1OLGNBQWM7QUFBQSxZQUNaLEtBQUssQ0FBQyxPQUFPLGNBQWMsT0FBTztBQUFBLFlBQ2xDLFNBQVMsQ0FBQyxnQkFBZ0IseUJBQXlCO0FBQUEsVUFDckQ7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQTtBQUFBLElBRUEsU0FDRSxTQUFTLGdCQUNMLFNBQ0E7QUFBQTtBQUFBLE1BRUUsTUFBTSxDQUFDLGFBQWE7QUFBQTtBQUFBLE1BRXBCLE1BQU0sQ0FBQyxVQUFVO0FBQUE7QUFBQSxNQUVqQixlQUFlO0FBQUEsSUFDakI7QUFBQTtBQUFBLElBRU4sU0FBUztBQUFBLE1BQ1AsSUFBSTtBQUFBLE1BQ0osT0FBTztBQUFBO0FBQUEsTUFFUCxVQUFVLEVBQUUsZUFBZSxNQUFNLENBQUM7QUFBQTtBQUFBLE1BRWxDLHFCQUFxQjtBQUFBLFFBQ25CLFVBQVUsQ0FBQyxLQUFLLFFBQVEsUUFBUSxJQUFJLEdBQUcsZUFBZSxDQUFDO0FBQUEsUUFDdkQsVUFBVTtBQUFBLE1BQ1osQ0FBQztBQUFBLElBQ0g7QUFBQTtBQUFBLElBRUEsTUFBTTtBQUFBLE1BQ0osU0FBUyxDQUFDLG9CQUFvQjtBQUFBLE1BQzlCLGFBQWE7QUFBQSxJQUNmO0FBQUEsRUFDRjtBQUNGOyIsCiAgIm5hbWVzIjogW10KfQo=
