# React-router

## 作用

react-router 可以创建单页应用，可以将组件映射到路由上，将对应的组件渲染到想要渲染的位置

## react 路由实现的俩种方式

HashRouter：利用 hash 实现路由切换
BrowserRouter: 利用 H5 api 实现路由的切换
核心就是利用路由的变化重新渲染组件

## react-router

react-router4+版本:采用单代码仓库模型架构（monorepo），这意味者这个仓库里面有若干相互独立的包，分别是：
react-router React Router 核心
react-router-dom 用于 DOM 绑定的 React Router
react-router-native 用于 React Native 的 React Router
react-router-config 静态路由配置的小助手

## react-router-dom

[react-router](https://github.com/ReactTraining/react-router/tree/master)

三种:HashRouter/BrowserRouter/MemoryRouter

-   Router
-   Route
-   Link
-   Switch
-   Redirect
-   NavLink
-   StaticRouter
-   ...

## createContext(16.3)

### createContext 通过组件树提供了一个传递数据的方法，从而避免了在每一个层级手动的传递 props 属性

### createContext 设计目的是为共享那些被认为对于一个组件树而言是“全局”的数据，例如当前认证的用户、主题或首选语言

```
let { Provider, Consumer } = React.createContext()
```

### Provider

React 组件允许 Consumers 订阅 context 的改变。
接收一个 value 属性传递给 Provider 的后代 Consumers。一个 Provider 可以联系到多个 Consumers。Providers 可以被嵌套以覆盖组件树内更深层次的值。

### Consumer

一个可以订阅 context 变化的 React 组件。当 context 值发生改变时,consumer 值也会改变
接收一个 函数作为[子节点,这里. 函数接收当前 context 的值并返回一个 React 节点。传递给函数的 value 将等于组件树中上层 context 的最近的 Provider 的 value 属性。如果 context 没有 Provider ，那么 value 参数将等于被传递给 createContext() 的 defaultValue 。
每当 Provider 的值发生改变时, 作为 Provider 后代的所有 Consumers 都会重新渲染。 从 Provider 到其后代的 Consumers 传播不受 shouldComponentUpdate 方法的约束，因此即使祖先组件退出更新时，后代 Consumer 也会被更新。

通过使用与 Object.is 相同的算法比较新值和旧值来确定变化。

## createContext 作用

-   改变主题
-   父子耦合
-   作用于多个上下文
-   在生命周期方法中访问 Context
-   高阶组件中的 Context
-   转发 Refs

## 基本逻辑

### 路由改变、将对应的组件渲染到对应的位置

### 路由如何改变、window.location.hash

### 路由与组件如何匹配、正则表达式
