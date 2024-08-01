import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import path from "path"; //使用该path需要安装@types/node

import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

import viteCompression from "vite-plugin-compression";
import { viteMockServe } from "vite-plugin-mock";

const resolve = (dir) => path.resolve(__dirname, dir);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    viteMockServe({
      mockPath: "./mock", // mock文件存放的位置
      localEnabled: true, //在开发环境中启用 mock
    }),
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: "gzip",
      ext: ".gz",
    }),
  ],
  resolve: {
    alias: {
      "@": resolve("src"), // @代替src
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
    preprocessorOptions: {
      //sass引入全局文件入口
      additionalData: "",
    },
  },

  //启动服务配置
  server: {
    host: "0.0.0.0",
    port: 3000,
    open: true, // 自动在浏览器打开
    proxy: {
      // 设置代理选项
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  // 打包配置
  build: {
    //浏览器兼容性  "esnext"|"modules"
    target: "modules",
    //指定输出路径
    outDir: "build",
    //生成静态资源的存放路径
    assetsDir: "assets",
    //启用/禁用 CSS 代码拆分
    cssCodeSplit: true,
    sourcemap: false,
    assetsInlineLimit: 10240,
    // 打包环境移除console.log, debugger
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      input: {
        main: resolve("index.html"),
      },
      output: {
        entryFileNames: `js/[name]-[hash].js`,
        chunkFileNames: `js/[name]-[hash].js`,
        assetFileNames: `[ext]/[name]-[hash].[ext]`,
      },
    },
  },
});
