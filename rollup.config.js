//通过rollup 进行打包
// （1） 引入相关依赖
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import ts from 'rollup-plugin-typescript2'; //typescript语言的包装器，可以将源代码中的类型声明转换
import json from '@rollup/plugin-json'; //json数据包装器，可以将一些不同数据类型的输入转换为相关的json数据
import chalk from 'chalk'; //控制台打印和输出的包装器
import {nodeResolve} from '@rollup/plugin-node-resolve'; //导入模块相关的包管理器和解析器，
import path from 'node:path'

// (2) 获取文件路径
// 
// ReferenceError: __dirname is not defined in ES module scope，用 const __dirname = path.resolve(); 来解决
const require = createRequire(import.meta.url)
const __dirname = fileURLToPath(new URL('.', import.meta.url))
let packagesDir = path.resolve(__dirname, 'packages'); //根目录的绝对路径 或者是文件系统

// 2.1 获取需要打包的包
let packageDir = path.resolve(packagesDir,process.env.TARGET)

// 2.2 获取每个包的项目配置信息
const resolve = p => path.resolve(packageDir, p) //path.resolve() 函数用于将一个路径参数转换为相对于当前工作目录的,打包的基准目录
const pkg = require(resolve('package.json')); //package.json文件的配置信息，包括名称、描述等信
const packageOptions = pkg.buildOptions || {} //package.json中buildOptions配置的配置选项或选项值，如果没有配置选项或选项
const name = packageOptions.filename || path.basename(packageDir); //package.json中的名称 或者 文件系统中的名称 或者 项目名称
console.log('name555555555555555:',name)
console.log('pkg6666666666666666666666:',pkg)//打印目标包的绝对路径 或将该目录列表显示

// 2.3 创建一个表
const outputConfigs = {
    "esm-bundler": {
        file: resolve(`dist/${name}.esm-bundler.js`),
        format: 'es', // format: 'cjs' 或 'es' 选项会将模块转换为 CommonJS 模块。 
    },
    'esm-browser': {
        file: resolve(`dist/${name}.esm-browser.js`),
        format: `es`
    },
    "cjs": {
        file: resolve(`dist/${name}.cjs.js`),
        format: 'cjs', // format: 'cjs' 或 'es' 选项会将模块转换为 CommonJS 模块
    },
    "global": {
        file: resolve(`dist/${name}.global.js`),
        format: 'iife', 
    }
}
// 2.4 获取package中的buildOptions， 按需打包
const options = pkg.buildOptions
console.log('options:',options)
function createConfig(format,output){
    if(!output){
        console.log(chalk.yellow(`invalid format:"${format}"`))
        process.exit(1)
    }
    // 进行打包
    output.name = options.name; // name is a required field of package.json. 描述该项目的名称。 在这个任务中，名称应
    output.sourcemap = true; // 这个选项应该是false或true。 默认情况下，sourcemap是可选的。 如果您自己进行打包，则可以将其设置为false。 如果您自己编码，则可以将其设置为true。 创建一个打包压缩的文件列表，列表不includes任何文件或目录。 如果您自己编码，请将其设置为false。 创建一个表格，包括格式和文件名称。 将格式
    // 生成rollup 配置
    return {
        input: resolve('src/index.ts'),// 导入
        output,
        plugins:[
            json({namedExports: false}),
            ts({ // 解析ts
                tsconfig: path.resolve(__dirname,'tsconfig.json'), // tsconfig.json是一个tsconfig的路径，可以是文件路径
            }), 
            nodeResolve() // 这是一个 resolve-module-deps 插件，对 ts-node 进行了一些额外的处理, 这些插件可以在任何时候打开文件夹或目录，并将依赖项列出到输出中
        ]
    }

}

//  导出生成的rollup配置
export default  options.formats.map(format=> createConfig(format,outputConfigs[format]))
