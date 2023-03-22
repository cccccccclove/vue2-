import {mergeOptions} from '../utils/index'

export function initGlobApi(Vue){
    //把所有的属性都放到options里面 {created:[],watch:[],data:[]...}
    Vue.options = {}
    Vue.Mixin = function(mixin){
        //对象合并
        Vue.options = mergeOptions(this.options,mixin)
    }
}