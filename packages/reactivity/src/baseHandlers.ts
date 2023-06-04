import { isObject } from "@vue/shared"
import { reactive ,readonly } from "./reactive"
import { TrackOpTypes } from './operations'
import { Track } from './effect'

 
 function createGetter(isReadonly=false,shallow=false){
    return function get (target,key,receiver){
        const res = Reflect.get(target, key, receiver)
        //判断
        if(!isReadonly){//非只读
            // 收集依赖,等待数据变化后更新视图
            // 收集 effect
            Track(target,TrackOpTypes.GET,key)
        }
        if(shallow){
            return res // {name:'zhangsan',list}
        }
        // 如果res是嵌套多层的对象时
        if(isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res) // 递归
        }
        return res
    }
 }

 const get =  /*__PURE__*/ createGetter()
 const shallowGet =  /*__PURE__*/ createGetter(false,true)
 const readonlyGet =  /*__PURE__*/ createGetter(true)
 const shallowReadonlyGet =  /*__PURE__*/ createGetter(true,true)

//  set
const set = /*__PURE__*/ createSetter()
const shallowSet =  /*__PURE__*/ createSetter(true)

function createSetter(shallow = false){
  return function set(target,key,value,receiver){
     const result = Reflect.set(target, key, value, receiver) // 递归的话也可以直接写成target[key] = value 或
      return result
  }
}
 
 export const reactiveHandlers = {
    get: get,
    set
 }
 export const shallowReactiveHandlers = {
    get:shallowGet,
    set:shallowSet,
 }
 export const readonlyHandlers = {
    get:readonlyGet,
    set:(target,key,value) =>{
        console.log(`set on key is faild`)
    }
 }
 export const shallowReadonlyHandlers = {
    get :shallowReadonlyGet,
    set:(target,key,value)=> {
        console.log(`set on key is faild`)
    }
 }
