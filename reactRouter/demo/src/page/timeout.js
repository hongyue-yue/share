import React, { Component } from "react"
import "css/404.less"

export default class extends Component {
    constructor() {
        super()
    }

    componentWillMount() {
        U.$setTitle("请求超时")
    }

    componentDidMount() {}

    componentWillUnmount() {}

    render() {
        return (
            <div className={"_no_find"}>
                <img src={require("../image/timeout_h5.png")} alt="404" />
                <div>哎呀！出错了</div>
            </div>
        )
    }
}
