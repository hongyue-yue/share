# babel 工作流程

## babel 工作流

ES6 代码 => 生成 AST 语法树 (`@babel/parser parser`) =>配置好的 plugins/presets 遍历 AST 语法树，生成新 AST 语法树 (`transformer[s]`) => 新 AST 树=>把转换后的 AST 生成新的代码 (`@babel/generator`)

## babel 工具类

- @babel/parser 将源代码解析成 AST
- @babel/generator 将 AST 解码生 js 代码。
- @babel/core 包括了整个 babel 工作流，也就是说在@babel/core 里面我们会使用到@babel/parser、transformer[s]、以及@babel/generator。
- @babel/code-frame 用于生成错误信息并且打印出错误原因和错误行数。（其实就是个 console 工具类）
- @babel/helpers 也是工具类，提供了一些内置的函数实现，主要用于 babel 插件的开发。
- @babel/runtime 也是工具类，但是是为了 babel 编译时提供一些基础工具库。作用于 transformer[s]阶段，当然这是一个工具库，如果要使用这个工具库，还需要引入@babel/plugin-transform-runtime，它才是 transformer[s]阶段里面的主角。
- @babel/template 也是工具类，主要用途是为 parser 提供模板引擎，更加快速的转化成 AST
- @babel/traverse 也是工具类，主要用途是来便利 AST 树，也就是在@babel/generator 过程中生效。
- @babel/types 也是工具类，主要用途是在创建 AST 的过程中判断各种语法的类型。

## babel 工作流程

### 解析代码，生成 AST 语法树

这里主要用到了[`babel-parser`](https://github.com/babel/babel/tree/master/packages/babel-parser)，是 babel 的解析器，解析步骤接收代码并输出 AST,这其中又包含两个阶段词法分析和语法分析。词法分析阶段把字符串形式的代码转换为 令牌（tokens） 流。语法分析阶段会把一个令牌流转换成 AST 的形式，将 javascript 解析成 AST 语法树， 默认只支持 `javascript` 的部分语法， 通过在 `presets` 设置：

- @babel/preset-env :解析高级的 JavaScript 语法
- @babel/preset-flow ：解析 flow 语法
- @babel/preset-react ：解析 react
- @babel/preset-typescript ：解析 typescript

#### AST 示例

```
{
  "type": "Program",
  "start": 0,
  "end": 190,
  "body": [
    {
      "type": "VariableDeclaration",
      "start": 179,
      "end": 189,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 183,
          "end": 188,
          "id": {
            "type": "Identifier",
            "start": 183,
            "end": 184,
            "name": "a"
          },
          "init": {
            "type": "Literal",
            "start": 186,
            "end": 188,
            "value": 12,
            "raw": "12"
          }
        }
      ],
      "kind": "var"
    }
  ],
  "sourceType": "module"
}
```

### 遍历 AST 语法树，生成新 AST 语法树

#### plugin

每一个 Plugin 处理自己的一种 AST Type 语法，官方的许多 plugin 其实和 preset 有类似的功能，preset 将所有可能用到高级语法都注入，而像 `@babel/plugin-transform-arrow-functions` 这个 plugin 主要是针对箭头函数的，可以做到较少的引入，但是自定义的工作量就比较高。

多个 plugin 的执行顺序：从数组最后往前依次执行

重点讲一下@babel/plugin-transform-runtime
用来解析@babel/runtime 工具类内的函数
core-js

```
{
  "plugins": [
    ["@babel/plugin-transform-runtime", {
      "corejs": false, //是否启用corejs https://babeljs.io/docs/en/babel-plugin-transform-runtime#corejs
      "helpers": true, // 各种辅助函数
      "regenerator": true, // 启用generator 支持async await
      "useESModules": false
    }]
  ]
}
```

#### Presets

而 Presets 可能理解起来更为简单，翻译过来是预设的意思，他几乎就是一个 Plugins 数组和配置的集合

@babel/preset-env 重点讲一下，他是以前 es2015、es2016 和 es2017 的集合。需要注意的是@babel/preset-env 不支持所有在 stage-x 的 plugin。browserslist browserslist 会和 caniuse 数据结合来判断当前语法是否需要转换。target 属性完全按照 browserslist 规则实现。

```
{
  "presets": [
    [
      "env",
      {
        "targets": { // 目标环境
          "browsers": [ // 浏览器
            "last 2 versions",
            "ie >= 10"
          ],
          "node": "current" // node
        },
        "modules": true,  // 是否转译module syntax，默认是 commonjs
        "debug": true, // 是否输出启用的plugins列表
        "spec": false, // 是否允许more spec compliant，但可能转译出的代码更慢https://babeljs.io/docs/en/babel-preset-env#spec
        "loose": false, // 是否允许生成更简单es5的代码，但可能不那么完全符合ES6语义
        "useBuiltIns": false, // 怎么运用 polyfill"usage" | "entry" | false 测试了一下 usage的包最小
        "include": [], // 总是启用的 plugins
        "exclude": [],  // 强制不启用的 plugins
        "forceAllTransforms": false, // 强制使用所有的plugins，用于只能支持ES5的uglify可以正确压缩代码
        "configPath": string //browserslist的路径
        "ignoreBrowserslistConfig": boolean //是否忽略browserslist的配置
      }
    ]
  ],
}
```

@babel/polyfill 和 runtime 的差别

runtime 提供的其实是一个工具类合集，例如 \_extend，是为了减少编译时产生的冗余代码，它不包括所有新的 es API 比如 Set Map Promise 等。

而 polyfill 则是用来提供上述的新的 ES API，其中也包括了 Array.form Object.assign 等新增的原型方法。

Babel 只是转换 syntax 层语法,所有需要 @babel/polyfill 来处理 API 兼容,又因为 polyfill 体积太大，所以通过 preset 的 useBuiltIns 来实现按需加载,再接着为了满足 npm 组件开发的需要 出现了 @babel/runtime 来做隔离

[polyfill 和 runtime 差别(必看)](https://zhuanlan.zhihu.com/p/58624930)

### 输出 ES5 (`generate`)

最后将转译后 AST 语法树，通过[`@babel/generator`](https://github.com/babel/babel/tree/master/packages/babel-generator)输出为 ES5 的语法
