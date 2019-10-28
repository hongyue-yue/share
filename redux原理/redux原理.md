# Redux与react-redux解析

## Redux原理解析(自我实现Redux)
  开始前，必须知道一些事情：
  - redux 和 react 没有关系，redux 可以用在任何框架中。
  - connect 不属于 redux，它其实属于 react-redux。
  - redux 是一个状态管理器

  Redux有3个核心的原则：
  - 单一数据源。整个UI的状态只有一个对象驱动。
  - 状态是只读的。视图和异步回调均不能直接改写状态。状态只有在触发一个action作为 reducer的参数来进行修改。
  - 改动是有纯函数执行的。reducer函数接收前一个状态（也是纯对象），并基于前一个状态和action 创建一个新的状态。你只能返回一个新的对象，永远不要修改当前的状态
#### 实现：
  - Redux的核心是store

    ```
      const store = {
         state: {}, // state是一个状态数据存储器
         listners: [], // 监听器是一个函数数组
         dispatch: () => {}, // dispatch是一个函数
         subscribe: () => {}, // subscribe是一个订阅函数
         getState: () => {}, // getState是一个获取state的函数
      };
    ```
  - 实现一个简单的createStore函数
    ```
      const createStore = (reducer, initialState) => {
           let state = initialState;
           let listeners = [];
           let getState = () => state;
           let subscribe = (listner) => {
               listeners.push(listener);
           };
            let dispatch = (action) => {
             state = reducer(state, action);
             listeners.forEach(listener => listener());
           };
           return {
               getState,
               subscribe,
               dispatch
           };
      };
    ```
    createStore函数接收两个参数，一个是reducer和一个initialState。reducer函数修改state的状态，initialState是state的初始值
    
    ```
    let initialState={a:1}
    let reducer=(state,action)=>{
      switch (action.type){
        case 'change_a':
            return {...state,...action.newState};
        default:
            return state;
      }
    } 
    let store=createStore(reducer,initialState)
    console.log(store.getState())
    store.dispatch({newState:{b:2},type:"change_a"})
    console.log(store.getState())

    ```
    reducer函数接收两个参数，state和action，state是当前的状态数据，action参数里面包含两个属性,type判别对state执行何种修改操作，newState包含新数据

  - 合并reducer

    但是我们在实际项目应用中，reducer数量是n多个，且都分散在项目中的不同目录中，所以我们的createStore函数接收到的reducer将不是一个单一的函数,所以我们在调用createStore之前需要将合并到一个reducer

     ```
      let reducers={
        reducer1,
        reducer2,
        reducer3
        ...
      }
     ```
     ```
     const createStore = (reducers) => {
           let state={}
           let listeners = [];
           let getState = () => state;
           let subscribe = (listner) => {
               listeners.push(listener);
           };
           let init=()=>{
             let keyArr=Object.keys(reducers)
               keyArr.map(key=>{
                 state[key]=reducers[key]()
             })
           }
           let dispatch = (action) => {
               let keyArr=Object.keys(reducers)
               keyArr.map(key=>{
                 state[key]=reducers[key](state[key], action)
               })
               listeners.forEach(listener => listener());
           };
           init()
           return {
               getState,
               subscribe,
               dispatch
           };
      };
      ```

  - combineReducers函数

    我们在使用redux的createStore函数时，向createStore传递了一个combineReducers函数，combineReducers函数包含一个reducers参数


    ```
    function combineReducers(reducers){
      const reducersKey=Object.keys(reducers)
      return function combination(state,action){
        let nextState = {}
        for(let i=0;i<reducersKey.length;i++){
            let key=reducersKey[i]
            nextState[key]=state?reducers[key](state[key],action):reducers[key]()
        }
        return nextState
      }
    }
    ```
    createStore中的dispatch函数

    ```
      let state = reducer();
      ...
      let  dispatch=(action)=>{
          state=reducer(state, action)
          for (let i = 0; i < listeners.length; i++) {
            const listener = listeners[i];
            listener();
          }
      }
    ```
    redux中的combineReducer函数
    ```     
      function combineReducers(reducers){
         const reducersKey=Object.keys(reducers)
         const finalReducers = {}
         for (let i = 0; i < reducerKeys.length; i++) {
           const key = reducerKeys[i]
           if (typeof reducers[key] === 'function') {
             finalReducers[key] = reducers[key]
           }
         }
         const finalReducerKeys = Object.keys(finalReducers)
         return function combination(state = {}, action) {
         let hasChanged = false
         const nextState = {}
         for (let i = 0; i < finalReducerKeys.length; i++) {
           const key = finalReducerKeys[i]
           const reducer = finalReducers[key]
           const previousStateForKey = state[key]
           const nextStateForKey = reducer(previousStateForKey, action)
          nextState[key] = nextStateForKey
          hasChanged = hasChanged || nextStateForKey !==previousStateForKey
        }
        return hasChanged ? nextState : state
       }
      }
    ```
   
  - applyMiddleware函数
    在平常使用redux时, 我们会利用各种中间件来扩展redux功能,它允许你通过自定义的中间件来影响你store的dispatch逻辑,对dispatch函数进行功能增强

    ```
      function applyMiddleware (...middlewares) {
         return function (oldCreateStore) {
            /*生成新的 createStore*/
            return function newCreateStore(...args) {
               /*1. 生成store*/
              const store = oldCreateStore(...args);
              let dispatch=()=>{}
              const midApi = {
                getState: store.getState,
                dispatch: (...args) => dispatch(...args)
              }
              /* const chain = [a, b, c]*/
              const chain = middlewares.map(middleware => middleware(midApi));
              dispatch =chain.reduce((ret,item)=>(...arg)=>ret(item(...arg)))(store.dispatch)
              /* 实现 a(b(c(dispatch))))*/

              /*2. 重写 dispatch*/
              store.dispatch = dispatch;
              return store;
            }
        }
     }

     function createStore(reducer,rewriteCreateStoreFunc){
         if(rewriteCreateStoreFunc){
           let newCreateStore=rewriteCreateStoreFunc(createStore)
           return newCreateStore(reducer)
         }
         ...
     }
    ```

    redux中的applyMiddleware函数
    ```
      function applyMiddleware(...middlewares) {
          return createStore => (...args) => {
          let store = createStore(...args)
          let dispatch=()=>{}
          let middlewareAPI = {
            getState: store.getState,
            dispatch: (...args) => dispatch(...args)
          }
          let chain = middlewares.map(middleware => middleware(middlewareAPI))
          dispatch = compose(...chain)(store.dispatch)

          return {
            ...store,
            dispatch
          }
        }
      }

      function compose(...funcs){
        ...
        return funcs.reduce((a, b) => (...args) => a(b(...args)))
      }

      function createStore(reducer, preloadedState, enhancer) {
        ...
         return enhancer(createStore)(reducer, preloadedState)
        ...
      }
    ```

    中间件redux-thunk源码
    ```
       function createThunkMiddleware(extraArgument) {
          return ({ dispatch, getState }) => next => action => {
             if (typeof action === 'function') {
               return action(dispatch, getState, extraArgument);
             }
            return next(action);
          };
       }
    ```
## react-Redux
   react-Redux是连接react和redux的中间桥梁，提供了两个react组件Provider和connect。

 Provider功能：将store注入到react的context中
   
   ```
   class Provider extends Component {
    static contextType = storeContext;
     render() {
        return (
            <storeContext.Provider value={{store:this.props.store}}>
               {this.props.children}
            </storeContext.Provider>
        )
     }
   }
   ```

 connect功能:

  - 渲染时机优化：自动实现了shouldComponentUpdate，并且只会在订阅的信息更新时才会触发re-render
  - 隔绝了数据订阅者和store直接的不必要联系，组件不需要关心store的细节，只需知道自己订阅的数据格式即可
  - connect会将订阅的数据和需要派发的函数，以props的形式注入到组件中

  ```
    const connect=(mapReducer=s=>{})=>Com=>{
    class Wrap extends Component{
        static contextType = storeContext;
        constructor(props, context) {
            super();
            this.store = context.store
            this.state = {...mapReducer(this.store.getState()) }
        }
        componentWillMount() {
            this.unsubscribe = this.store.subscribe(() => {
                this.setState({...mapReducer(this.store.getState()) });
            });
        }

        componentWillUnmount() {
            this.unsubscribe()
        }
        equal(obj1,obj2){
            if(obj1===obj2) return true
            let obj1Name=Object.getOwnPropertyNames(obj1)
            let obj2Name=Object.getOwnPropertyNames(obj2)
            if(obj1Name.length!=obj2Name.length) return false
            for(let i=0;i<obj1Name.length;i++){
                var propName = obj1Name[i];
                if (obj1[propName] !== obj2[propName]) {
                  return false;
                }
            }
        }
        shouldComponentUpdate(nextProps, nextState){
            return !this.obj2(nextState,this.state)||!this.obj2(nextProps,this.props)
        }
        render(){
             return(<Com {...this.state}{...this.props} dispatch={this.store.dispatch} />) 
        }
    }
    return Wrap
  }
  
  function createStore(reducer,applyMiddleware){
    ...
    let subscribe=(listener)=> {
      listeners.push(listener);
      return function (){
          if(listeners.length<=0) return
          const index = listeners.indexOf(listener);
          listeners.splice(index, 1);
      }
    }
    ...
  }
  ```


   





  




       




   