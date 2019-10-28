import { combineReducers, createStore, applyMiddleware } from "./MyCreateStore"
import ReduxThunk from "redux-thunk"

import MyRedux from "./MyRedux"
function importAll(r) {
    let modules = {}
    r.keys().forEach(key => (modules[key] = r(key)))
    return modules
}
const modules = importAll(require.context("./", true, /\.r\.js$/))
const reducers = Object.assign.apply(null, Object.values(modules))


//let store =new MyRedux(reducers)
let store = createStore(combineReducers(reducers))

export default store
