import React, { Component } from "react"
import UserAdd from "./add"
import UserLists from "./lists"
import Detail from "./detail"
import { Route, Link } from "./../../react-router-dom"
import "../../css/user.less"
export default class User extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        document.title = "user"
    }

    render() {
        return (
            <div className="user">
                <div className="home">
                    <div>
                        <Link to="/user/add">userAdd</Link>
                    </div>
                    <div>
                        <Link to="/user/lists">userLists</Link>
                    </div>
                    <div>
                        <Link to="/user/detail/100">userDetail</Link>
                    </div>
                </div>
                <div className="content">
                    <Route path="/user/add" component={UserAdd} />
                    <Route path="/user/lists" component={UserLists} />
                    <Route path="/user/detail/:id" component={Detail} />
                </div>
            </div>
        )
    }
}
