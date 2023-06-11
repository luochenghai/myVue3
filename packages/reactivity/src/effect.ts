import { isArray, isIntegerKey } from "@vue/shared";
import { TriggerOpTypes } from "./operations";

// 定义 effect 依赖收集 相关属性
export function effect(fn,options:any= {}){
  const effect = createReactEffect(fn,options)
  // 判断一下
  if(!options.lazy) {
    effect()
  }
  return effect

}
let uid = 0;
let activeEffect;
let effectStack = [] // 定义一个栈用来维护 effect
function createReactEffect(fn,options){
    const effect = function reactiveEffect() {
        // 问题 （1） effect 是一个树形结构
        // effect (()=>{ // effect1 [effect1]
            // state.name // 收集 effect1

                // effect(()=>{ // effect2
                    // state.age  // 收集 effect2 
                //})

             // state.a // 收集 effect1

        // })
        if(!effectStack.includes(effect)){ //保证effect 没有加入到栈中
            try {
                // 入栈
                effectStack.push(effect)
                activeEffect = effect
                fn() // 用户传进来的方法
            }finally{
                // 出栈
                effectStack.pop() // 弹出最后一个effect
                activeEffect = effectStack[effectStack.length - 1] // 将最后一个effect设置为当前的effect或者执行
            }
        }
    }
    activeEffect = effect; // 全局变量 activeEffect 保存当前的effect
    // 相关属性
    effect.id = uid++;// 保存一个唯一的整数值来标识一个 effect 实例。 这个整数值在调用者调用完成后自动销毁。
    effect._isEffect = true // 区别effect 是不是响应式的effect 
    effect.raw = fn; // 保存 用户的方法
    effect.options = options; // 保存 options 参数 
  return effect
}

// 3 收集effect 在获取数据时触发 get 收集effect
let targetMap = new WeakMap()
export function Track(target,type,key) {
    // console.log(target,type,key,activeEffect)
    // key 和我们的effect 一 一 对应 map=>key=>target=>属性=> [effect]  set
    if(activeEffect === undefined){ // 没有在effect 中使用
        return 
    }
    // 获取effect { target:dep }
    let depMap = targetMap.get(target)
    if(!depMap) { // 没有
        targetMap.set(target,depMap = new Map()) // 创建一个map 并将其保存到WeakMap中 保存到Weak
    }
    // 有
    let dep = depMap.get(key) // {name:[]} 找到对应dep的effect 如果没有找到，则找到null
    if(!dep) { // 找到了dep 但是没有找到对应name的effect  没有属性
        depMap.set(key,(dep=new Set))
    }
    // 有没有 effect key
    if(!dep.has(activeEffect)){
        dep.add(activeEffect) // 收集effect
    }
    // console.log(targetMap)
}

// 触发更新
export function trigger(target,type,key?,newValue?,oldValue?) {
     console.log(target,type,key,newValue,oldValue)
    // 触发依赖 问题
    console.log(targetMap) // 收集依赖
    const depsMap = targetMap.get(target) // 找到对应dependency的effect 如果没有找到，则找到null 找到一个map
    console.log('depsMap:',depsMap)
    if(!depsMap){
        return 
    }
    // 有
    let effectSet = new Set() //如果有多个 同时修改 一个值并且修改的值 相同，用set 去重
    const add = (effectAdd) =>{
        if(effectAdd){
            effectAdd.forEach(effect => {
                effectSet.add(effect) // 收集依赖 并将收集的依赖保存到effectSet中 保存到WeakSet
            });
        }
    }
    add(depsMap.get(key)) // 获取当前属性的effect
    console.log('当前属性key:',depsMap.get(key))
    // 处理数组 就是 key === length 修改数组的length  特殊处理
    if(key === 'length' && isArray(target)){
        console.log('进入了if')
        depsMap.forEach((dep,key) => {
           console.log(key,newValue)
            console.log(dep)
            //如果更改的长度 小于 收集的索引，那么这个索引需要重新执行 effect
            if(key === 'length' || key > newValue){
                add(dep)
            }
        });
    }else {
        console.log('进入了else')
        console.log(key,newValue)
     
       //可能是对象
       if(key != undefined){ // key 存在时
          add(depsMap.get(key)) // 获取对应的dependency的effect 
       }
        // 数组 修改 索引 （key 不存在时,说命名是新增）
        switch (type) {
            case TriggerOpTypes.ADD:
                if(isArray(target)&&isIntegerKey(key)){ 
                    add (depsMap.get('length'))
                }
        }
    }
     // 执行
     effectSet.forEach((effect:any) => effect())
}