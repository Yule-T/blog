import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({


    optimizeDeps: {
      include: ['@kangc/v-md-editor/lib/theme/vuepress.js'],
    },


  plugins: [vue()],
  server:{
    hmr: true,
    port:3001,
    proxy:{
      '/api':{
        target:"http://localhost:8081/",//loadEnv(mode,process.cwd()).VITE_APP_PROXY_TARGET, //目标代理接口
        secure:false,
        changeOrigin:true,  //开启代理，在本地创建一个虚拟服务器
        pathRewrite:{
          '^/api':'/api',
        },
      },
    },
  },
  resolve:{
    //配置路径别名
    alias:{
      '@':path.resolve(__dirname,'./src'),
    },
  },
})
