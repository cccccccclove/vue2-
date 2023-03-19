import { observer } from "./observe/index"
export function initState(vm){
    let opt = vm.$options
    //初始化
    if(opt.props){
        initProps()
    }
    if(opt.data){
        initData(vm)
    }
    if(opt.watch){
        initWatch()
    }
    if(opt.computed){
        initComputes()
    }
    if(opt.methods){
        initMethods()
    }
}

//vue2对data进行初始化判断data为对象还是函数      实例中data可以为对象或者函数，组件中只能为函数
function initData(vm){
    let data = vm.$options.data
    //浅拷贝
    data = vm.data = typeof data == "function" ? data.call(vm) : data  //data()中的this指向window，需修改this使其指向实例把数据加到实例上   实例中的函数为箭头函数则this指向window，否者指向实例
    //数据劫持
    //将data上的所有属性代理到实例上的vm
    // for(let key in data){
    //     proxy(vm,"_data",key) //使vm.msg = vm._data.msg
    // }
    observer(data)
} 

function proxy(vm,source,key){
    Object.defineProperty(vm,key,{
        get(){
            return vm[source][key]
        },
        set(newValue){
            vm[source][key] = newValue
        }
    })
}

function initComputes(){}
function initMethods(){}
function initProps(){}
function initWatch(){}