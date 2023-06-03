
// 响应式的入口文件
export {
    reactive,
    shallowReactive, 	// shallow copy of variable, with no side-effects (returns same reference)
    readonly,		// prevent modification of variable (returns a new reference)
    shallowReadonly,	// same, but with side-effects (returns a new reference)
} from './reactive'