## new vue都干了什么？？？

```javascript
const vm = new Vue({
    el:'#app'
})
```

# 在执行new vue的时候，vue的构造类，只干了一件事情，那就是调用vue本身的init方法

```javascript  
    function Vue(options){
        if(process.env.NODE_ENV!=='production'&&!(this instanceof Vue){
            warn('错误信息');
        })
        /*
            process.env.NODE_ENV 读取系统变量
            this instanceof Vue 判断vue是否是new来实例话的
        */
        //vue开始初始化
        this._init(option);
    }
```    
## init干了什么事？？？
```javascript
Vue.prototype._init = function (options?: Object) {
    const vm: Component = this
    // a uid
    vm._uid = uid++

    let startTag, endTag
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      startTag = `vue-perf-init:${vm._uid}`
      endTag = `vue-perf-end:${vm._uid}`
      mark(startTag)
    }

    // a flag to avoid this being observed
    /*一个防止vm实例自身被观察的标志位*/
    vm._isVue = true
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options)
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      initProxy(vm)
    } else {
      vm._renderProxy = vm
    }
    // expose real self
    vm._self = vm
    /*初始化生命周期*/
    initLifecycle(vm)
    /*初始化事件*/
    initEvents(vm)
    /*初始化render*/
    initRender(vm)
    /*调用beforeCreate钩子函数并且触发beforeCreate钩子事件*/
    callHook(vm, 'beforeCreate')
    initInjections(vm) // resolve injections before data/props
    /*初始化props、methods、data、computed与watch*/
    initState(vm)
    initProvide(vm) // resolve provide after data/props
    /*调用created钩子函数并且触发created钩子事件*/
    callHook(vm, 'created')

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      /*格式化组件名*/
      vm._name = formatComponentName(vm, false)
      mark(endTag)
      measure(`${vm._name} init`, startTag, endTag)
    }

    if (vm.$options.el) {
      /*挂载组件*/
      vm.$mount(vm.$options.el)
    }
  }
```
# init主要做了两件事
- 1.初始化生命周期，事件函数，render函数，调用beforecreate钩子，初始化props，methods，data，computed，watch，调用create钩子。
- 2.$mount 挂载组件 

## iniState做了什么事

```javascript
export function initState (vm: Component) {
  vm._watchers = []
  const opts = vm.$options
  /*初始化props*/
  if (opts.props) initProps(vm, opts.props)
  /*初始化方法*/
  if (opts.methods) initMethods(vm, opts.methods)
  /*初始化data*/
  if (opts.data) {
    initData(vm)
  } else {
    /*该组件没有data的时候绑定一个空对象*/
    observe(vm._data = {}, true /* asRootData */)
  }
  /*初始化computed*/
  if (opts.computed) initComputed(vm, opts.computed)
  /*初始化watchers*/
  if (opts.watch) initWatch(vm, opts.watch)
}
```
- initState主要是初始化props，methods，data，computed，watch

## 双向绑定
# 在初始化data的时候 会把所有的data对象里的数据调用initData方法
# initData方法做了什么事？？？
```javascript
function initData (vm: Component) {

  /*得到data数据*/
  let data = vm.$options.data
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {}

  /*判断是否是对象*/
  if (!isPlainObject(data)) {
    data = {}
    process.env.NODE_ENV !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    )
  }

  // proxy data on instance
  /*遍历data对象*/
  const keys = Object.keys(data)
  const props = vm.$options.props
  let i = keys.length

  //遍历data中的数据
  while (i--) {
    /*保证data中的key不与props中的key重复，props优先，如果有冲突会产生warning*/
    if (props && hasOwn(props, keys[i])) {
      process.env.NODE_ENV !== 'production' && warn(
        `The data property "${keys[i]}" is already declared as a prop. ` +
        `Use prop default value instead.`,
        vm
      )
    } else if (!isReserved(keys[i])) {
      /*判断是否是保留字段*/

      /*这里是我们前面讲过的代理，将data上面的属性代理到了vm实例上*/
      proxy(vm, `_data`, keys[i])
    }
  }
  // observe data
  /*从这里开始我们要observe了，开始对数据进行绑定，这里有尤大大的注释asRootData，这步作为根数据，下面会进行递归observe进行对深层对象的绑定。*/
  observe(data, true /* asRootData */)
}
```

# 当使用set添加data的时候， 会调用difineProperty中的setter方法，会有一个特定的对象（Dep对象）同志watcher对象更新view 完成双向绑定
# vue重写了一部分Array方法 通过递归来对数组成员进行双向绑定

## Observer类

```javascript
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that has this object as root $data

  constructor (value: any) {
    //.......

    if (Array.isArray(value)) {
      /*
          如果是数组，将修改后可以截获响应的数组方法替换掉该数组的原型中的原生方法，达到监听数组数据变化响应的效果。
          这里如果当前浏览器支持__proto__属性，则直接覆盖当前数组对象原型上的原生数组方法，如果不支持该属性，则直接覆盖数组对象的原型。
      */
      const augment = hasProto
        ? protoAugment  /*直接覆盖原型的方法来修改目标对象*/
        : copyAugment   /*定义（覆盖）目标对象或数组的某一个方法*/
      augment(value, arrayMethods, arrayKeys)

      /*如果是数组则需要遍历数组的每一个成员进行observe*/
      this.observeArray(value)
    } else {
      /*如果是对象则直接walk进行绑定*/
      this.walk(value)
    }
  }
}

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
 /*直接覆盖原型的方法来修改目标对象或数组*/
function protoAugment (target, src: Object) {
  /* eslint-disable no-proto */
  target.__proto__ = src
  /* eslint-enable no-proto */
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
/*定义（覆盖）目标对象或数组的某一个方法*/
function copyAugment (target: Object, src: Object, keys: Array<string>) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i]
    def(target, key, src[key])
  }
}
```
 # Observer主要是用于对对象进行绑定 如果为数组，则使用 observeArray 进行绑定，如果是对象，则使用walk进行绑定

 ## 此处放置  observeArray 和 walk方法代码
 ## 结束

 ```javascript
 /*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

import { def } from '../util/index'

/*取得原生数组的原型*/
const arrayProto = Array.prototype
/*创建一个新的数组对象，修改该对象上的数组的七个方法，防止污染原生数组方法*/
export const arrayMethods = Object.create(arrayProto)

/**
 * Intercept mutating methods and emit events
 */
 /*这里重写了数组的这些方法，在保证不污染原生数组原型的情况下重写数组的这些方法，截获数组的成员发生的变化，执行原生数组操作的同时dep通知关联的所有观察者进行响应式处理*/
;[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
.forEach(function (method) {
  // cache original method
  /*将数组的原生方法缓存起来，后面要调用*/
  const original = arrayProto[method]
  def(arrayMethods, method, function mutator () {
    // avoid leaking arguments:
    // http://jsperf.com/closure-with-arguments
    let i = arguments.length
    const args = new Array(i)
    while (i--) {
      args[i] = arguments[i]
    }
    /*调用原生的数组方法*/
    const result = original.apply(this, args)

    /*数组新插入的元素需要重新进行observe才能响应式*/
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
        inserted = args
        break
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observeArray(inserted)
      
    // notify change
    /*dep通知所有注册的观察者进行响应式处理*/
    ob.dep.notify()
    return result
  })
})
 ```

 # 重写了array的几个方法，

 ##template编译 （template是如何被编译成render function的）
 ```javascript
function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  /*parse解析得到ast树*/
  const ast = parse(template.trim(), options)
  /*
    将AST树进行优化
    优化的目标：生成模板AST树，检测不需要进行DOM改变的静态子树。
    一旦检测到这些静态树，我们就能做以下这些事情：
    1.把它们变成常数，这样我们就再也不需要每次重新渲染时创建新的节点了。
    2.在patch的过程中直接跳过。
 */
  optimize(ast, options)
  /*根据ast树生成所需的code（内部包含render与staticRenderFns）*/
  const code = generate(ast, options)
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
}
 ```
```javascript
updateComponent = () => {
    vm._update(vm._render(), hydrating)
}
```
# watcher对象会通过updateComponent方法来更新世图，vue会默认将watcher存在一个队列里，在下一个tick时，异步的更新视图，优化了性能。

