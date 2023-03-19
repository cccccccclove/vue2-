//重写数组
// 1、获取原来的数组方法
let oldArrayProtoMethods = Array.prototype

//2、继承
export let ArrayMethods = Object.create(oldArrayProtoMethods)

//3、劫持
let methods = ["push", "pop", "unshift", "shift", "splice"]
methods.forEach(item => {
    ArrayMethods[item] = function (...args) {
        let res = oldArrayProtoMethods[item].apply(this, args)

        let insert
        switch (item) {
            case "push":
            case "unshift":
                insert = args
                break;
            case "splice": insert = args.splice(2)
        }
        let ob = this.__ob__
        if(insert){
            ob.observeArray(insert) //对添加的对象进行劫持
        }
        
        return res
    }
})