import { isObject, isArray, isIntegerKey, hasOwn, haseChange} from "@vue/shared"
import { reactive ,readonly } from "./reactive"
import { TrackOpTypes, TriggerOpTypes } from './operations'
import { Track, trigger} from './effect'

 
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
     // 注意 （1）是数组还是对象 （2）添加值 还是修改值
     // （1）获取老值
     const oldValue = target[key]  
     // (2) 判断
     let haskey = isArray(oldValue) && isIntegerKey(key)?Number(key) < target.length : hasOwn(target,key)
     // 获取到最新的值
     const result = Reflect.set(target, key, value, receiver) 
     if(!haskey) {
        // 新增
        trigger(target,TriggerOpTypes.ADD,key,value)
     } else { // 修改的时候 新值和老值一样
        if(haseChange(value,oldValue)){
            trigger(target, TriggerOpTypes.SET, key,value,oldValue) 
        }
       
     }
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
