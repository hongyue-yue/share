import React from "react"
import ReactDOM from "react-dom"
//import { Provider } from "react-redux"
import {Provider,connect} from "reducers/myReact-redux"

import store from "reducers"
import Router from "router"
window.store=store
const Main = () => (
        <Provider store={store}>
            <Router/>
        </Provider>
)
ReactDOM.render(<Main />, document.getElementById("root"))
