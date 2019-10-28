import React, { Component } from "react"
import "css/404.less"

export default class extends Component {
    constructor() {
        super()
    }

    componentWillMount() {
        U.$setTitle("登录超时")
    }

    componentDidMount() {}

    componentWillUnmount() {}

    render() {
        return (
            <div className={"_no_find"}>
                <img src={require("../image/error_h5.png")} alt="error" />
                <div>登录超时，请重新登录</div>
            </div>
        )
    }
}
