// vite.config.ts
import { loadEnv } from "file:///D:/GPM/172540/eximbank-ui/node_modules/vite/dist/node/index.js";
import path, { resolve } from "path";
import vue from "file:///D:/GPM/172540/eximbank-ui/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///D:/GPM/172540/eximbank-ui/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import { createSvgIconsPlugin } from "file:///D:/GPM/172540/eximbank-ui/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import svgLoader from "file:///D:/GPM/172540/eximbank-ui/node_modules/vite-svg-loader/index.js";
var __vite_injected_original_dirname = "D:\\GPM\\172540\\eximbank-ui";
var vite_config_default = ({ mode }) => {
  const viteEnv = loadEnv(mode, process.cwd());
  const { VITE_PUBLIC_PATH } = viteEnv;
  console.log(viteEnv);
  return {
    /** Modify base according to actual situation when packaging */
    base: VITE_PUBLIC_PATH,
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
      environment: "jsdom",
      reporters: ["junit"],
      outputFile: {
        junit: "./junit-report.xml"
      },
      coverage: {
        provider: "v8",
        reporter: ["cobertura", "lcov", "text", "html"],
        reportOnFailure: true,
        ignoreEmptyLines: true
      }
    }
  };
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxHUE1cXFxcMTcyNTQwXFxcXGV4aW1iYW5rLXVpXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxHUE1cXFxcMTcyNTQwXFxcXGV4aW1iYW5rLXVpXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9HUE0vMTcyNTQwL2V4aW1iYW5rLXVpL3ZpdGUuY29uZmlnLnRzXCI7LyogZXNsaW50LWRpc2FibGUgcHJldHRpZXIvcHJldHRpZXIgKi9cclxuLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJ2aXRlc3RcIiAvPlxyXG5cclxuaW1wb3J0IHsgdHlwZSBDb25maWdFbnYsIHR5cGUgVXNlckNvbmZpZ0V4cG9ydCwgbG9hZEVudiB9IGZyb20gJ3ZpdGUnXHJcbmltcG9ydCBwYXRoLCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJ1xyXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcclxuaW1wb3J0IHZ1ZUpzeCBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUtanN4J1xyXG5pbXBvcnQgeyBjcmVhdGVTdmdJY29uc1BsdWdpbiB9IGZyb20gJ3ZpdGUtcGx1Z2luLXN2Zy1pY29ucydcclxuaW1wb3J0IHN2Z0xvYWRlciBmcm9tICd2aXRlLXN2Zy1sb2FkZXInXHJcblxyXG5leHBvcnQgZGVmYXVsdCAoeyBtb2RlIH06IENvbmZpZ0Vudik6IFVzZXJDb25maWdFeHBvcnQgPT4ge1xyXG4gIGNvbnN0IHZpdGVFbnYgPSBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCkpIGFzIEltcG9ydE1ldGFFbnZcclxuICBjb25zdCB7IFZJVEVfUFVCTElDX1BBVEggfSA9IHZpdGVFbnZcclxuICBjb25zb2xlLmxvZyh2aXRlRW52KVxyXG4gIHJldHVybiB7XHJcbiAgICAvKiogTW9kaWZ5IGJhc2UgYWNjb3JkaW5nIHRvIGFjdHVhbCBzaXR1YXRpb24gd2hlbiBwYWNrYWdpbmcgKi9cclxuICAgIGJhc2U6IFZJVEVfUFVCTElDX1BBVEgsXHJcbiAgICByZXNvbHZlOiB7XHJcbiAgICAgIGFsaWFzOiB7XHJcbiAgICAgICAgLyoqIFRoZSBAIHN5bWJvbCBwb2ludHMgdG8gdGhlIHNyYyBkaXJlY3RvcnkgKi9cclxuICAgICAgICAnQCc6IHJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgc2VydmVyOiB7XHJcbiAgICAgIC8qKiBTZXQgaG9zdDogdHJ1ZSB0byB1c2UgTmV0d29yayB0byBhY2Nlc3MgdGhlIHByb2plY3QgYnkgSVAgKi9cclxuICAgICAgaG9zdDogdHJ1ZSwgLy8gaG9zdDogXCIwLjAuMC4wXCJcclxuICAgICAgLyoqIFBvcnQgbnVtYmVyICovXHJcbiAgICAgIHBvcnQ6IDgwODAsXHJcbiAgICAgIC8qKiBXaGV0aGVyIHRvIG9wZW4gdGhlIGJyb3dzZXIgYXV0b21hdGljYWxseSAqL1xyXG4gICAgICBvcGVuOiBmYWxzZSxcclxuICAgICAgLyoqIENyb3NzLWRvbWFpbiBzZXR0aW5ncyBhbGxvd2VkICovXHJcbiAgICAgIGNvcnM6IHRydWUsXHJcbiAgICAgIC8qKiBXaGV0aGVyIHRvIGV4aXQgZGlyZWN0bHkgd2hlbiB0aGUgcG9ydCBpcyBvY2N1cGllZCAqL1xyXG4gICAgICBzdHJpY3RQb3J0OiBmYWxzZSxcclxuICAgICAgLyoqIFdhcm0gdXAgY29tbW9uIGZpbGVzIHRvIGluY3JlYXNlIHRoZSBpbml0aWFsIHBhZ2UgbG9hZGluZyBzcGVlZCAqL1xyXG4gICAgICB3YXJtdXA6IHtcclxuICAgICAgICBjbGllbnRGaWxlczogWycuL3NyYy9sYXlvdXRzLyoqLyoudnVlJ11cclxuICAgICAgfVxyXG4gICAgICAvLyBobXI6IHtcclxuICAgICAgLy8gICBvdmVybGF5OiBmYWxzZVxyXG4gICAgICAvLyB9XHJcbiAgICB9LFxyXG4gICAgYnVpbGQ6IHtcclxuICAgICAgLyoqIElzc3VlIGEgd2FybmluZyB3aGVuIHRoZSBzaXplIG9mIGEgc2luZ2xlIGNodW5rIGZpbGUgZXhjZWVkcyAyMDQ4S0IgKi9cclxuICAgICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAyMDQ4LFxyXG4gICAgICAvKiogRGlzYWJsZSBnemlwIGNvbXByZXNzZWQgc2l6ZSByZXBvcnRpbmcgKi9cclxuICAgICAgcmVwb3J0Q29tcHJlc3NlZFNpemU6IGZhbHNlLFxyXG4gICAgICAvKiogU3RhdGljIHJlc291cmNlIGRpcmVjdG9yeSBhZnRlciBwYWNrYWdpbmcgKi9cclxuICAgICAgYXNzZXRzRGlyOiAnc3RhdGljJyxcclxuICAgICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICAgIG91dHB1dDoge1xyXG4gICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgKiBDaHVua2luZyBzdHJhdGVneVxyXG4gICAgICAgICAgICogMS4gTm90ZSB0aGF0IHRoZXNlIHBhY2thZ2UgbmFtZXMgbXVzdCBleGlzdCwgb3RoZXJ3aXNlIHBhY2thZ2luZyB3aWxsIGZhaWxcclxuICAgICAgICAgICAqIDIuIElmIHlvdSBkb24ndCB3YW50IHRvIGN1c3RvbWl6ZSB0aGUgY2h1bmsgc3BsaXR0aW5nIHN0cmF0ZWd5LCB5b3UgY2FuIGRpcmVjdGx5IHJlbW92ZSB0aGlzIGNvbmZpZ3VyYXRpb25cclxuICAgICAgICAgICAqL1xyXG4gICAgICAgICAgbWFudWFsQ2h1bmtzOiB7XHJcbiAgICAgICAgICAgIHZ1ZTogWyd2dWUnLCAndnVlLXJvdXRlcicsICdwaW5pYSddLFxyXG4gICAgICAgICAgICBlbGVtZW50OiBbJ2VsZW1lbnQtcGx1cycsICdAZWxlbWVudC1wbHVzL2ljb25zLXZ1ZSddXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgLyoqIFByb0d1YXJkICovXHJcbiAgICBlc2J1aWxkOlxyXG4gICAgICBtb2RlID09PSAnZGV2ZWxvcG1lbnQnXHJcbiAgICAgICAgPyB1bmRlZmluZWRcclxuICAgICAgICA6IHtcclxuICAgICAgICAgICAgLyoqIFJlbW92ZSBjb25zb2xlLmxvZyB3aGVuIGJ1bmRsaW5nICovXHJcbiAgICAgICAgICAgIHB1cmU6IFsnY29uc29sZS5sb2cnXSxcclxuICAgICAgICAgICAgLyoqIFJlbW92ZSBkZWJ1Z2dlciB3aGVuIGJ1bmRsaW5nICovXHJcbiAgICAgICAgICAgIGRyb3A6IFsnZGVidWdnZXInXSxcclxuICAgICAgICAgICAgLyoqIFJlbW92ZSBhbGwgY29tbWVudHMgd2hlbiBidW5kbGluZyAqL1xyXG4gICAgICAgICAgICBsZWdhbENvbW1lbnRzOiAnbm9uZSdcclxuICAgICAgICAgIH0sXHJcbiAgICAvKiogVml0ZSBwbHVnaW4gKi9cclxuICAgIHBsdWdpbnM6IFtcclxuICAgICAgdnVlKCksXHJcbiAgICAgIHZ1ZUpzeCgpLFxyXG4gICAgICAvKiogQ29udmVydCBTVkcgc3RhdGljIGltYWdlcyB0byBWdWUgY29tcG9uZW50cyAqL1xyXG4gICAgICBzdmdMb2FkZXIoeyBkZWZhdWx0SW1wb3J0OiAndXJsJyB9KSxcclxuICAgICAgLyoqIFNWRyAqL1xyXG4gICAgICBjcmVhdGVTdmdJY29uc1BsdWdpbih7XHJcbiAgICAgICAgaWNvbkRpcnM6IFtwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwgJ3NyYy9pY29ucy9zdmcnKV0sXHJcbiAgICAgICAgc3ltYm9sSWQ6ICdpY29uLVtkaXJdLVtuYW1lXSdcclxuICAgICAgfSlcclxuICAgIF0sXHJcbiAgICAvKiogVml0ZXN0IHVuaXQgdGVzdCBjb25maWd1cmF0aW9uOiBodHRwczovL2NuLnZpdGVzdC5kZXYvY29uZmlnICovXHJcbiAgICB0ZXN0OiB7XHJcbiAgICAgIGluY2x1ZGU6IFsndGVzdHMvKiovKi50ZXN0LnRzJ10sXHJcbiAgICAgIGVudmlyb25tZW50OiAnanNkb20nLFxyXG4gICAgICByZXBvcnRlcnM6IFsnanVuaXQnXSxcclxuICAgICAgb3V0cHV0RmlsZToge1xyXG4gICAgICAgIGp1bml0OiAnLi9qdW5pdC1yZXBvcnQueG1sJ1xyXG4gICAgICB9LFxyXG4gICAgICBjb3ZlcmFnZToge1xyXG4gICAgICAgIHByb3ZpZGVyOiAndjgnLFxyXG4gICAgICAgIHJlcG9ydGVyOiBbJ2NvYmVydHVyYScsICdsY292JywgJ3RleHQnLCAnaHRtbCddLFxyXG4gICAgICAgIHJlcG9ydE9uRmFpbHVyZTogdHJ1ZSxcclxuICAgICAgICBpZ25vcmVFbXB0eUxpbmVzOiB0cnVlXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUdBLFNBQWdELGVBQWU7QUFDL0QsT0FBTyxRQUFRLGVBQWU7QUFDOUIsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sWUFBWTtBQUNuQixTQUFTLDRCQUE0QjtBQUNyQyxPQUFPLGVBQWU7QUFSdEIsSUFBTSxtQ0FBbUM7QUFVekMsSUFBTyxzQkFBUSxDQUFDLEVBQUUsS0FBSyxNQUFtQztBQUN4RCxRQUFNLFVBQVUsUUFBUSxNQUFNLFFBQVEsSUFBSSxDQUFDO0FBQzNDLFFBQU0sRUFBRSxpQkFBaUIsSUFBSTtBQUM3QixVQUFRLElBQUksT0FBTztBQUNuQixTQUFPO0FBQUE7QUFBQSxJQUVMLE1BQU07QUFBQSxJQUNOLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQTtBQUFBLFFBRUwsS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxNQUNqQztBQUFBLElBQ0Y7QUFBQSxJQUNBLFFBQVE7QUFBQTtBQUFBLE1BRU4sTUFBTTtBQUFBO0FBQUE7QUFBQSxNQUVOLE1BQU07QUFBQTtBQUFBLE1BRU4sTUFBTTtBQUFBO0FBQUEsTUFFTixNQUFNO0FBQUE7QUFBQSxNQUVOLFlBQVk7QUFBQTtBQUFBLE1BRVosUUFBUTtBQUFBLFFBQ04sYUFBYSxDQUFDLHdCQUF3QjtBQUFBLE1BQ3hDO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFJRjtBQUFBLElBQ0EsT0FBTztBQUFBO0FBQUEsTUFFTCx1QkFBdUI7QUFBQTtBQUFBLE1BRXZCLHNCQUFzQjtBQUFBO0FBQUEsTUFFdEIsV0FBVztBQUFBLE1BQ1gsZUFBZTtBQUFBLFFBQ2IsUUFBUTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQU1OLGNBQWM7QUFBQSxZQUNaLEtBQUssQ0FBQyxPQUFPLGNBQWMsT0FBTztBQUFBLFlBQ2xDLFNBQVMsQ0FBQyxnQkFBZ0IseUJBQXlCO0FBQUEsVUFDckQ7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQTtBQUFBLElBRUEsU0FDRSxTQUFTLGdCQUNMLFNBQ0E7QUFBQTtBQUFBLE1BRUUsTUFBTSxDQUFDLGFBQWE7QUFBQTtBQUFBLE1BRXBCLE1BQU0sQ0FBQyxVQUFVO0FBQUE7QUFBQSxNQUVqQixlQUFlO0FBQUEsSUFDakI7QUFBQTtBQUFBLElBRU4sU0FBUztBQUFBLE1BQ1AsSUFBSTtBQUFBLE1BQ0osT0FBTztBQUFBO0FBQUEsTUFFUCxVQUFVLEVBQUUsZUFBZSxNQUFNLENBQUM7QUFBQTtBQUFBLE1BRWxDLHFCQUFxQjtBQUFBLFFBQ25CLFVBQVUsQ0FBQyxLQUFLLFFBQVEsUUFBUSxJQUFJLEdBQUcsZUFBZSxDQUFDO0FBQUEsUUFDdkQsVUFBVTtBQUFBLE1BQ1osQ0FBQztBQUFBLElBQ0g7QUFBQTtBQUFBLElBRUEsTUFBTTtBQUFBLE1BQ0osU0FBUyxDQUFDLG9CQUFvQjtBQUFBLE1BQzlCLGFBQWE7QUFBQSxNQUNiLFdBQVcsQ0FBQyxPQUFPO0FBQUEsTUFDbkIsWUFBWTtBQUFBLFFBQ1YsT0FBTztBQUFBLE1BQ1Q7QUFBQSxNQUNBLFVBQVU7QUFBQSxRQUNSLFVBQVU7QUFBQSxRQUNWLFVBQVUsQ0FBQyxhQUFhLFFBQVEsUUFBUSxNQUFNO0FBQUEsUUFDOUMsaUJBQWlCO0FBQUEsUUFDakIsa0JBQWtCO0FBQUEsTUFDcEI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGOyIsCiAgIm5hbWVzIjogW10KfQo=
