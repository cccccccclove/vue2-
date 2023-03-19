import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'

export default{
    input:'./src/index.js',
    output:{
        file:'dist/vue.js',
        format:'umd',    //打包方式，umd支持前端也支持后端，  可将vue打包到window上   new vue
        name:'Vue',
        sourcemap:true //支持映射
    },
    plugins:[     //babel把高级语法转为初级语法
        babel({
            exclude:'node_modules/**' //不对node_modules下的文件转换语法
        }),
        serve({ //开启一个服务
            port:3000,
            contentBase:"",     //打开文件的基准。“”表当前字符串
            openPage:'./index.html'
        })
    ]
}