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
    activeEffect = effect; // 全局变量 activeEffect 保存当前的effect
    // 相关属性
    effect.id = uid++;// 保存一个唯一的整数值来标识一个 effect 实例。 这个整数值在调用者调用完成后自动销毁。
    effect._isEffect = true // 区别effect 是不是响应式的effect 
    effect.raw = fn; // 保存 用户的方法
    effect.options = options; // 保存 options 参数 
  return effect
}

// 3 收集effect 在获取数据时触发 get 收集effect
export function Track(target,type,key) {
    console.log(target,type,key,activeEffect)

}