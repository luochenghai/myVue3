
// 定义收集依赖时的操作类型
export const enum TrackOpTypes {
  GET = 'get',
  HAS = 'has',
  ITERATE = 'iterate', 	
}

export const enum TriggerOpTypes {
    GET = 'set',
    HAS = 'add',
    DETELE='detele',
    CLEAR = 'clear', 	
  }