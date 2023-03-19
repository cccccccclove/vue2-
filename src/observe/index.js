/**
对象劫持:使用的是Object.defineProperty,由于该方法只能对对象中的某一个属性进行劫持，故需要遍历对象中的每一个属性对其进行劫持。
同时需要使用递归防止多重对象或设置的新值还是对象所以没有监听到的问题

数组劫持：使用函数劫持的方法重写数组方法
**/
import { ArrayMethods } from "./arr"

export function observer(data){
    //对象数据
    if(typeof data != 'object' || data == null) return data
    return new Observer(data)
}

class Observer{
    //Object.defineProperty只可以对对象中的某一个属性进行劫持
    constructor(value){
        Object.defineProperty(value,"__ob__",{  //给value一个属性，存储this的值
            enumerable:false,
            value:this
        })
        if(Array.isArray(value)){
            value.__proto__ = ArrayMethods
            this.observerArray(value) //处理数组对象劫持
        }else{
            this.walk(value) //遍历劫持
        }
    }
    walk(data){
        let keys = Object.keys(data)
        for(let i=0;i < keys.length; i++){
            let key = keys[i]
            let value = data[key]
            defineReactive(data,key,value)
        }
    }
    observerArray(value){
        for(let i = 0; i < value.length; i++){
            observer(value[i])
        }
    }
}

function  defineReactive(data,key,value) {
    observer(value) //深度递归
    Object.defineProperty(data,key,{
        get(){
            return value  //这里直接return value就好，不能return data[key]，因为data[key]会再次访问数据造成无限循环
        },
        set(newValue){
            if(newValue == value) return
            observer(newValue) //防止设置的值为一个新的对象导致没有监听到
            value = newValue
        }
    })
}

