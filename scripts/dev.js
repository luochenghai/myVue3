// 进行打包 moneerrepo 方式
// （1）获取 打包 目录
/**
 * 解释：使用export default 时，对应的import 语句不需要使用大括号；
 * 不使用export default 时，对应的import 语句需要使用大括号；
 * export default 命令用于指定模块的默认导出。一个模块只能有一个默认的导出，因此 export default命令只能使用一次。
 * **/ 
import fs  from 'fs' 
import { execa } from 'execa' 


// 2.进行打包 并行打包 build 函数的作用是 拿到 packages 中的各个包，然后用rollup 进行打包
async function build(target){
    console.log(target,'333333333dev')
   // 注意 execa -c 执行rollup 配置，环境变量 -env   -w 自动检测文件变化
   //  execa 开启子进程，一次性打包多个包 ，返回的是 promise 
   await execa('rollup',[ '-cw', '--environment', `TARGET:${target}`],{stdio: 'inherit'});// 子进程的输出在父进程中看的到
}

build('reactivity')