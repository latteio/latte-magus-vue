# 基于Vu3+ElementPlus+TSX组件封装
目标: 精致, 精炼, 贴近原生; 封装不变, 扩展易变的, 尽量不改变用户习惯.
使用纯tsx模式封装组件.
尽量不用或少用第三方插件, 而只使用vue3+ElementPlus的特性完成组件编制.

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
### 组件打包命令(npm pack将组件打包成tgz格式)
```sh
npm run build
npm pack
```

### 组件打包配置

package.json中配置：
```json
"files": [
   "dist/*"
],
"main": "./dist/latte-vue.umd.js",
"module": "./dist/latte-vue.es.js",
"exports": {
   ".": {
      "import": "./dist/latte-vue.es.js",
      "reguire": "./dist/latte-vue.umd.js"
   }
}
```

vite.config.ts中配置:
```javascript
build: {
   lib: {
      entry: path.resolve(__dirname, 'src/latte-magus-vue.ts'),
      name: 'latte-vue',
      formats: ['es', 'umd'],
      fileName: (format) => `latte-vue.${format}.js`
   },
   rollupOptions: {
      external: ['vue'],
      output: {
         globals: {
            vue: 'Vue'
         }
      }
   }
}
```
