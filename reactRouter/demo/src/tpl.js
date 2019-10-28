import React, { Component } from "react"
import ReactDOM from "react-dom"
import {
    HashRouter as Router,
    Route,
    Link,
    Redirect,
    Switch
} from "./react-router-dom"
// import { HashRouter as Router, Route } from "react-router-dom"
import Home from "./page/Home"
import User from "./page/user/index"
import Pro from "./page/pro/index"
import UserAdd from "./page/user/add"
import Lists from "./page/user/lists"
import Detail from "./page/user/detail"

export default class App extends Component {
    constructor() {
        super()
    }

    render() {
        return (
            <div>
                <div>
                    <Router>
                        <Link to="/home">首页</Link>
                        <Link to="/user">用户</Link>
                        <Link to="/pro">产品</Link>
                    </Router>
                </div>
                <Router>
                    <Switch>
                        <Route path="/home" component={Home} exact={true} />
                        <Route path="/user" component={User} />
                        <Route path="/pro" component={Pro} />
                        <Route path="/detail/:id" component={Detail} />
                        <Redirect to="/home" />
                    </Switch>
                </Router>
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById("root"))
if (module.hot) {
    module.hot.accept()
}
