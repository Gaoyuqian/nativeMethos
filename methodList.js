/**
 * Created by yuqiangao on 2017/10/12.
 */
//Object

/*
        object.assign(target,..sources);
        *argument
            target => 目标对象 type:obj
            source => 源对象 type:obj
        *return
            target
        *function
            对象浅复制且会跳过那些值为 null 或 undefined的源对象
            若key相同 则会用源对象的值替代目标对象的值
            该方法会修改目标对象
*/

/*
        object.create(proto[,propertiesObject])
        *argument
            proto => 新对象的原型对象 type:obj
            propertiesObject => 可选，新对象key值 必须是null或obj类型
                                可以设置 所对应的value的get／set方法  出发相应事件
                                可以设置相应的writable属性表示是否只读
        *return
            proto{
                     propertiesObject:value;
                 }
        *function
            创建对象  实现对象的继承
*/

/*
        object.defineProperties(obj,props)
        *argument
            obj => 将被修改的目标对象 type:obj
            props => 将被定义的key值其属性 type:obj
        *return
            被修改的目标对象
        *function
            修改目标对象，像目标对象中添加一个或多个key并描述key的属性
            包括 writeable value get set enumerable 等属性
*/

/*
         object.defineProperty(obj,props,des)
         *argument
            obj => 将被修改的目标对象 type:obj
            props => key的name type:string
            des => key的属性描述 type:obj
        *return
            被修改的目标对象
        *function
            修改目标对象，像目标对象中添加一个key并描述key的属性
            包括 writeable value get set enumerable 等属性
 */

/*
        object.entries(obj)
        *argument
            obj => 将被修改的对象 type:obj
        *return
            返回obj的key，value组成的二维数组 type:array
            [[key1,value1],[key2,value2]]
        *function
            返回可枚举的key，value数组
*/

/*
        object.is(a,b)
        *argument
            a => 被比较的对象 type:any
            b => 被比较的对象 type:any
        *return
            返回比较的结果  type:boolean
        *function
            undefined === undefined
            null === null
            true|false === true|false
            string === string
            number === number
            +0|-0 === +0|-0
            object.is(NaN,NaN) return true;
            不会作类型转换
            ==会造成隐式类型转换
*/

/*
         object.keys(obj)
         *argument
            obj => 目标对象 type : obj
         *return
            返回所有可枚举属性的字符串数组，Object.prototype.tostring.call(obj) = [object array]
            则返回 数组下标的数组
         *function
            返回可枚举的属性数组
*/

/*
        obj.hasOwnProperty(prop)
        *argument
            prop => 要检测的属性
        *return
            返回boolean
        *function
            检测obj中是否存在prop属性
            返回true或false
            判断继承属性将返回false

            ！！！遍历属性的时候可以过滤掉继承属性
 */

/*
        object.values(obj)
        *argument
            obj => 目标对象 type:obj
        *return
            返回一个数组，包含obj的所有value
        *function
            返回一个数组，包含obj的所有value

 */