/*const createStore = (reducer, initialState) => {
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
console.log(store.getState())*/

/*const createStore = (reducers) => {
    let state={}
    let listeners = [];
    let getState = () => state;
    let subscribe = (listner) => {
        listeners.push(listener);
    };
    let init=()=>{
      let keyArr=Object.keys(reducers)
      keyArr.forEach(key=>{
          state[key]=reducers[key]()
      })
    }
    let dispatch = (action) => {
        let keyArr=Object.keys(reducers)
        keyArr.forEach(key=>{
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
};*/

function createStore(reducer,applyMiddleware) {
    if(applyMiddleware){
     let newCreateStore=applyMiddleware(createStore)
     return newCreateStore(reducer)
    }
    let state = reducer();
    let listeners = [];
    let  subscribe=(listener)=> {
      listeners.push(listener);
    }
  
    let  dispatch=(action)=>{
     state=reducer(state, action)
      for (let i = 0; i < listeners.length; i++) {
        const listener = listeners[i];
        listener();
      }
     
    }
  
    let getState=()=> {
      return state;
    }
    return {
      subscribe,
      dispatch,
      getState
    }
}
function combineReducers(reducers){
    const reducersKey=Object.keys(reducers)
    return (state,action)=>{
      let nextState = {}
      for(let i=0;i<reducersKey.length;i++){
          let key=reducersKey[i]
          nextState[key]=state?reducers[key](state[key],action):reducers[key]()
      }
      return nextState
    }
}
function applyMiddleware (...middlewares) {
  return function (oldCreateStore) {
     return function newCreateStore(...args) {
       const store = oldCreateStore(...args);
       let dispatch=()=>{}
       let middlewareAPI = {
        getState: store.getState,
        dispatch: (...args) =>dispatch(...args)
       }
       const chain = middlewares.map(middleware => middleware(middlewareAPI));
       dispatch =chain.reduce((ret,item)=>(...arg)=>ret(item(...arg)))(store.dispatch)
       store.dispatch = dispatch;
       return store;
     }
 }
}

const logMiddleware = (store) => (next) => (action) => {
  console.log('this state', store.getState());
  console.log('action', action);
  next(action);
  console.log('next state', store.getState());
} 


let reducer1=(state={a:1},action)=>{
      switch (action&&action.type){
        case 'change_reducer1':
            return {...state,...action.newState};
        default:
            return state;
      }
}

let reducer2=(state={b:1},action)=>{
    switch (action&&action.type){
      case 'change_reducer2':
          return {...state,...action.newState};
      default:
          return state;
    }
}
let reducers={
    reducer1,
    reducer2
}
//let store=createStore(reducers)
let store=createStore(combineReducers(reducers),applyMiddleware(logMiddleware))
console.log(store.getState())
store.dispatch({newState:{b:2},type:"change_reducer2"})
console.log(store.getState())

