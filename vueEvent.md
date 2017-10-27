### Vue事件API

- Vue提供了四个事件api分别是 $on,$once,$off,$emit.

##初始化事件

- 初始化事件在vm上创建一个_events对象，用来存放时间。
```javascript
{
    eventName:[func1,func2,func3]
}
```
- 存放事件名以及对应的执行方法。
```javascript
//初始化事件
export function initEvents(vm:Component){
    /*在vm上创建一个_events对象，用来存放事件。*/
    vm._events = Object.create(null);
    //创建一个空对象
    vm.hasHookEvent = false
    const listeners = vm.$options._parentListeners
    if(listeners){
        updateComponentListeners(vm,listeners)
    }
}
```

## $on
- $on方法用来监听一个实例上的自定义事件，可以由$emit触发
 ```javascript
Vue.prototype.$on = function(event:string|Array<string>,fn:Function):Component{
    const vm:Component = this
    //如果event是一个数组，则为this绑定所有事件
    if(Array.isArray(event)){
        for(let i = 0,l = event.length;i<l;i++){
            this.$on(event[i],fn)
        }
    }else{
        (vm._eventS[event || (vm._events[event]=[])).push(fn)//绑定fn
        if(hookRE.test(event)){
            vm._hasHookEvent = true
        }
    }
    return vm
}
 ```


 ## $once
 - $once 负责监听一个只能触发一次的事件，在触发以后会自动移除该事件

```javascript
Vue.prototype.$once = function(event:string,fn:Function):Component{
    const vm:Component = this

    function on (){
        vm.$off(event,on);
        fn.apply(vm,arguments)
        //arguments是on的参数列表
        //on.fn = fn  把fn置入on的参数列表
        //on的功能是 把执行一次on方法之后  将$on销毁  再不可能执行$event
    }
    on.fn = fn
    vm.$on($event,on)
    return vm
}
```

## $off 
- $off用来移除自定义事件
```javascript
Vue.prototype.$off = function(event?:string|Array<string>,fn?:Function):Component{
    const vm:Component = this
    //如果不传参数则注销所有事件
    if(!arguments.length){
        vm._event = Object.create(null)
        return vm
    }
    //如果是数组 则递归注销事件
     if (Array.isArray(event)) {
      for (let i = 0, l = event.length; i < l; i++) {
        this.$off(event[i], fn)
      }
      return vm
    }
 // specific event
    const cbs = vm._events[event]
    /*本身不存在该事件则直接返回*/
    if (!cbs) {
      return vm
    }
    /*如果只传了event参数则注销该event方法下的所有方法*/
    if (arguments.length === 1) {
      vm._events[event] = null
      return vm
    }
    // specific handler
    /*遍历寻找对应方法并删除*/
    let cb
    let i = cbs.length
    while (i--) {
      cb = cbs[i]
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1)
        break
      }
    }
    return vm
  }
}
```


## $emit
- $emit用来触发指定的自定义事件

```javascript
Vue.prototype.$emit = function (event: string): Component {
    const vm: Component = this
    if (process.env.NODE_ENV !== 'production') {
      const lowerCaseEvent = event.toLowerCase()
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          `Event "${lowerCaseEvent}" is emitted in component ` +
          `${formatComponentName(vm)} but the handler is registered for "${event}". ` +
          `Note that HTML attributes are case-insensitive and you cannot use ` +
          `v-on to listen to camelCase events when using in-DOM templates. ` +
          `You should probably use "${hyphenate(event)}" instead of "${event}".`
        )
      }
    }
    let cbs = vm._events[event]
    if (cbs) {
      /*将类数组的对象转换成数组*/
      cbs = cbs.length > 1 ? toArray(cbs) : cbs
      const args = toArray(arguments, 1)
      /*遍历执行*/
      for (let i = 0, l = cbs.length; i < l; i++) {
        cbs[i].apply(vm, args)
      }
    }
    return vm
  }
```
