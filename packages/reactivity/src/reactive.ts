// 该文件实现响应式逻辑
// 这四个方法 （1）是不是只读 （2）是不是深 {list:{}}
// 注意 核心 proxy 源码 柯里化：根据不同的参数
import { isObject } from "@vue/shared"

const reactiveHandlers = {}
const shallowReactiveHandlers = {}
const readonlyHandlers = {}
const shallowReadonlyHandlers = {}

export function reactive(target) {
   return createReactObject(target,false,reactiveHandlers) // 1. 创建一个proxy或者代理对象 2. 将代理对象作为属性发送到内部
}

export function shallowReactive(target) {
    return createReactObject(target,false,shallowReactiveHandlers) // 1. 创建一个proxy或者代理对象 2. 将代理对象作为属性发送到内部
}

export function readonly(target) {
    return createReactObject(target,true,readonlyHandlers) // 1. 创建一个proxy或者代理对象 2. 将代理对象作为属性发送到内部
}

export function shallowReadonly(target) {
    return createReactObject(target,true,shallowReadonlyHandlers) // 1. 创建一个proxy或者代理对象 2. 将代理对象作为属性发送到内部
}

// 核心代理实现
// 数据结构
const reactiveMap = new Map() //key 必须是对象 自动垃圾回收
const shallowReactiveMap = new Map() //key 必须是对象 自动垃圾回收, 不管怎么回收

function createReactObject(target,isReadonly,baseHandlers){
   if(!isObject(target)){ //2. 检查参数是否为对象类型，如果不是，则转换为
     return target //3. 返回参数的真正实际实例 （如果不是实例，则抛出异常） 4. 不做任何处理。 如果是实例，则继续。 如果不是对象，则返回实际实例。 如果是数组或数组元素，则转换为实际数组。 如果没有可变对象属性，则返回实际数组。 如果没有可变对象属性，则抛出异常。
   }
   //  核心 proxy 优化 
   const proxymap = isReadonly? shallowReactiveMap :reactiveMap 
   const proxyEs = proxymap.get(target)
   if(proxyEs) {
      return proxyEs
   }
   const proxy = new Proxy(target,baseHandlers) //1. 创建一个代理对象，代理对象应该继承自
     proxymap.set(target,proxy) // 目标对象target 作为key,代理后的对象proxy 作为值存到map中
   return proxy
}