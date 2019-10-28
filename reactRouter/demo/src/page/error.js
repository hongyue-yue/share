import React, { Component } from "react"
import "css/404.less"

export default class extends Component {
    constructor() {
        super()
    }

    componentWillMount() {
        U.$setTitle("出错了")
    }

    componentDidMount() {}

    componentWillUnmount() {}

    render() {
        const msg =
            U.routeParam().biz_msg || "哎呀，服务器开了一个小差，请稍后重试"
        return (
            <div className={"_no_find"}>
                <img src={require("../image/error_h5.png")} alt="error" />
                <div>{msg}</div>
            </div>
        )
    }
}
