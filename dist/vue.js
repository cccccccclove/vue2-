(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }

  //重写数组
  // 1、获取原来的数组方法
  var oldArrayProtoMethods = Array.prototype;

  //2、继承
  var ArrayMethods = Object.create(oldArrayProtoMethods);

  //3、劫持
  var methods = ["push", "pop", "unshift", "shift", "splice"];
  methods.forEach(function (item) {
    ArrayMethods[item] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      var res = oldArrayProtoMethods[item].apply(this, args);
      var insert;
      switch (item) {
        case "push":
        case "unshift":
          insert = args;
          break;
        case "splice":
          insert = args.splice(2);
      }
      var ob = this.__ob__;
      if (insert) {
        ob.observeArray(insert); //对添加的对象进行劫持
      }

      return res;
    };
  });

  function observer(data) {
    //对象数据
    if (_typeof(data) != 'object' || data == null) return data;
    return new Observer(data);
  }
  var Observer = /*#__PURE__*/function () {
    //Object.defineProperty只可以对对象中的某一个属性进行劫持
    function Observer(value) {
      _classCallCheck(this, Observer);
      Object.defineProperty(value, "__ob__", {
        //给value一个属性，存储this的值
        enumerable: false,
        value: this
      });
      if (Array.isArray(value)) {
        value.__proto__ = ArrayMethods;
        this.observerArray(value); //处理数组对象劫持
      } else {
        this.walk(value); //遍历劫持
      }
    }
    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        var keys = Object.keys(data);
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          var value = data[key];
          defineReactive(data, key, value);
        }
      }
    }, {
      key: "observerArray",
      value: function observerArray(value) {
        for (var i = 0; i < value.length; i++) {
          observer(value[i]);
        }
      }
    }]);
    return Observer;
  }();
  function defineReactive(data, key, value) {
    observer(value); //深度递归
    Object.defineProperty(data, key, {
      get: function get() {
        return value; //这里直接return value就好，不能return data[key]，因为data[key]会再次访问数据造成无限循环
      },
      set: function set(newValue) {
        if (newValue == value) return;
        observer(newValue); //防止设置的值为一个新的对象导致没有监听到
        value = newValue;
      }
    });
  }

  function initState(vm) {
    var opt = vm.$options;
    //初始化
    if (opt.props) ;
    if (opt.data) {
      initData(vm);
    }
    if (opt.watch) ;
    if (opt.computed) ;
    if (opt.methods) ;
  }

  //vue2对data进行初始化判断data为对象还是函数      实例中data可以为对象或者函数，组件中只能为函数
  function initData(vm) {
    var data = vm.$options.data;
    //浅拷贝
    data = vm.data = typeof data == "function" ? data.call(vm) : data; //data()中的this指向window，需修改this使其指向实例把数据加到实例上   实例中的函数为箭头函数则this指向window，否者指向实例
    //数据劫持
    //将data上的所有属性代理到实例上的vm
    // for(let key in data){
    //     proxy(vm,"_data",key) //使vm.msg = vm._data.msg
    // }
    observer(data);
  }

  //生成ast语法树：可以操作所有东西包括js，css     虚拟dom（vnode）只可以操作节点
  /**
   * 把<div id="app">hello</div>变成
   * {
   *  tag:'div',
   *  attrs:[{id:'app'}],
   *  children:[{tag:null,text:'hello'}]
   * }
   **/
  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; //标签名称
  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); //作用域标签<span:xxx>
  var startTagOpen = new RegExp("^<".concat(qnameCapture)); //标签开头的正则，捕获的内容是标签名
  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); //匹配标签结尾
  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
  var startTagClose = /^\s*(\/?)>/; //匹配标签结束的>

  //创建一个ast对象
  function createAstElement(tag, attrs) {
    return {
      tag: tag,
      attrs: attrs,
      children: [],
      type: 1,
      parent: null
    };
  }
  var root; //保存根元素
  var createParent; //保存父节点
  var stack = []; //栈

  //遍历
  function start(tag, attrs) {
    //开始标签
    var element = createAstElement(tag, attrs);
    if (!root) {
      root = element;
    }
    createParent = element;
    stack.push(element);
  }
  function charts(text) {
    //文本标签
    createParent.children.push({
      type: 3,
      text: text
    });
  }
  function end(tag) {
    //结束标签
    var element = stack.pop();
    createParent = stack.pop[stack.length - 1];
    if (createParent) {
      element.parent = createParent.tag;
      createParent.children.push(element);
    }
  }
  function parseHTML(html) {
    while (html) {
      //由开始标签 文本 结束标签组成
      var textEnd = html.indexOf('<');
      if (textEnd == 0) {
        //标签
        //结束标签
        var endTagMatch = html.match(endTag);
        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[1]);
          continue;
        }

        //开始标签
        var startTagMatch = parseStartTag();
        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        }
      }
      var text = void 0;
      if (textEnd > 0) {
        //文本
        text = html.substring(0, textEnd);
      }
      if (text) {
        advance(text.length);
        charts(text);
      }
    }
    function parseStartTag() {
      var start = html.match(startTagOpen); //1、结果(标签名) 2、false
      var match = {
        tagName: start[1],
        attrs: []
      };
      var attr;
      var end;
      advance(start[0].length); //删除匹配了的字符串
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5]
        });
        advance(attr[0].length);
      }
      if (end) {
        advance(end[0].length);
        return match;
      }
    }
    function advance(n) {
      html = html.substring(n);
      // console.log(html)
    }

    console.log(root);
    return root;
  }
  function compileToFunction(el) {
    parseHTML(el);
  }

  function initMixin(Vue) {
    //把vue传过来以便使用vue.propertype
    Vue.prototype._init = function (options) {
      var vm = this;
      // console.log(this)      //=>Vue实例
      vm.$options = options;
      //初始化状态
      initState(vm);
      //模板编译  ->  查看vue官网的生命周期
      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };
    //创建$mount
    Vue.prototype.$mount = function (el) {
      var vm = this;
      el = document.querySelector(el);
      var options = vm.$options;
      if (!options.render) {
        var template = options.template;
        if (!template && el) {
          el = el.outerHTML;
          //变成ast语法树
          compileToFunction(el);
        }
      }
    };
  }

  function Vue(options) {
    // console.log(options)
    // 初始化
    this._init(options);
  }
  initMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
