
class MyRedux{
    constructor(reducer){
      
      this.state={}
      this.reducer=reducer
      this.listenerArr=[]
      this._init()
    }
    _init(){
       Object.keys(this.reducer).map(v=>{
          this.state[v]=this.reducer[v]()
       })
    }
    subscribe = (listener) => {
        this.listenerArr.push(listener);
        return () => {
            if (this.listenerArr.length <= 0) {
                return
            }
            const index = this.listenerArr.indexOf(listener);
            this.listenerArr.splice(index, 1);
        }
    }
    dispatch=(newState,type)=>{
      Object.keys(this.reducer).forEach(v=>{
        this.state[v]=this.reducer[v](this.state[v],{newState,type})
      })
      if (this.listenerArr.length > 0) {
        this.listenerArr.reverse().forEach(v => { v() })
      }
    }
    getState = () => {
        return this.state;
    }
}



const handleActions=(reducer,initialState)=>(state=initialState,action)=>{
    return action&&typeof action.type == "string" && reducer[action.type]?reducer[action.type](state,action.newState):state
}


export default MyRedux
export {handleActions }