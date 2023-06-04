// 公共方法
export function isObject(target){
    return typeof target === 'object' && target!== null;
}

export const extend = Object.assign; // 扩展对象的函数 extend, 可以扩展一个对象到另一个对象上面