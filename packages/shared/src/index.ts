// 公共方法
export function isObject(target){
    return typeof target === 'object' && target!== null;
}

export const extend = Object.assign; // 扩展对象的函数 extend, 可以扩展一个对象到另一个对象上面

export const isArray = Array.isArray; // 检查参数是否为数组类型
export const isFunction = (o: any): o is Function => typeof o === 'function'; // 检查参数是否为函数类型或
export const isString = (o: any): o is string => typeof o ==='string'; // 检查参数是否为字符
export const isNumber = (o: any): o is number => typeof o === 'number'; // 检查参数是否为数字
export const isBoolean = (o: any): o is boolean => typeof o === 'boolean'; // 检查参数是否为
export const isIntegerKey =(key) =>parseInt(key) + '' === key; // 检查参数是否为整数键名称或整数值 key 对应的键值对
export const isIntegerValue =(value) =>parseInt(value) + '' === value; // 检查参数是否为整数值
// 对象中是否有这个属性
const hasOwnProperty = Object.prototype.hasOwnProperty; // 通过反射机制获取对象的属性值，然后检查是
export const hasOwn = (target,key) => hasOwnProperty.call(target,key); // 扩展函数，检查对象是否有这个属性名称或值\
export const haseChange = (value,oldValue) => value!== oldValue; // 扩展函数，检查两个值是否不同或不为空






