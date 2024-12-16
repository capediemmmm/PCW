import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import pxtovw from 'postcss-px-to-viewport'
//
// const usePxtovw = pxtovw({
//
//   viewportWidth: 375, // 设计稿的视口宽度
//   viewportUnit: "vw", // 希望使用的视口单位
//   unitPrecision: 5, // 单位转换后保留的精度
//   propList: ["*"], // 能转化为vw的属性列表
//   fontViewportUnit: "vw", // 字体使用的视口单位
//   selectorBlackList: [], // 需要忽略的CSS选择器，不会转为视口单位，使用原有的px等单位。
//   minPixelValue: 1, // 设置最小的转换数值，如果为1的话，只有大于1的值会被转换
//   mediaQuery: false, // 媒体查询里的单位是否需要转换单位
//   replace: true, //  是否直接更换属性值，而不添加备用属性
//   exclude: undefined, // 忽略某些文件夹下的文件或特定文件
//   include: undefined, // 如果设置了include，那将只有匹配到的文件才会被转换
//   landscape: false, // 是否添加根据 landscapeWidth 生成的媒体查询条件
//   landscapeUnit: "vw", // 横屏时使用的单位
//   landscapeWidth: 568, // 横屏时使用的视口宽度
// })

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // css: {
  //   postcss: {
  //     plugins: [usePxtovw]
  //   },
  // },
  server: {
    host: '0.0.0.0'
  },
  build: {
    outDir: '../../backend/backend/src/main/resources/static',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString()
          }
        }
      }
    }
  }
})
