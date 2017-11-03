/**
 * Created by yuqiangao on 2017/10/12.
 */

//继承继承！！！！！！


//  js继承


function Animal(name) {
    this.name = name;
    this.sleep = function () {
        console.log(this.name + '在睡觉');
    }
}

Animal.prototype.eat = function () {
    console.log(this.name + '在吃吃吃');
}


// 通过原型链继承
function Cat(name) {
    this.name = name;
}
Cat.prototype = Animal.prototype;
var CatA = new Cat('tom');


//运算符 instanceof
// 用于检查 一个对象是否存在一个被期望的构造函数  或检查该对象是否是一个被期望类的实例


// CatA instanceof Animal  true
// CatA instanceof Cat true
// 证明  【Animal】 和 【Cat】 存在于 【CatA】 的原型链上


// 通过call调用构造函数继承
function Cat1(name) {
    Animal.call(this);
    // 当new Cat1时 会执行Cat1中的代码段
    this.name = name;
}
var CatB = new Cat1('tom');
// CatB instanceof Animal  false
// CatB instanceof Cat true
//此时由于call只是单纯的访问功能，不涉及原型链， 所以 【Animal】 并不存在于原型链上


//解决方案为 Cat1.prototype = new Animal();


// 如果先 Cat1.prototype = new Animal(); 再 new cat1('tom');
// 则可以访问父类的原型属性 先new再赋值则不可以




// 柯里化

function plus(a){
    function next(b){
        return plus(a+b);
    }
    next.toString=()=>a;
    return next;
}