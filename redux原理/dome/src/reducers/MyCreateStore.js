function createStore(reducer,rewriteCreateStoreFunc) {
    if(rewriteCreateStoreFunc){
        let newCreateStore=rewriteCreateStoreFunc(createStore)
        return newCreateStore(reducer)
    }
    let state = reducer();
    let listeners = [];
    function subscribe(listener) {
      listeners.push(listener);
      return function (){
          if(listeners.length<=0) return
          const index = listeners.indexOf(listener);
          listeners.splice(index, 1);
      }
    }
  
    function dispatch(newState,type) {
     let promise =Promise.resolve(state=reducer(state, {newState,type}));
      for (let i = 0; i < listeners.length; i++) {
        const listener = listeners[i];
        listener();
      }
      return promise
    }
  
    function getState() {
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
      return function combination(state,action){
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

export{createStore,combineReducers,applyMiddleware}
