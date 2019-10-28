import React, { Component } from "react"
import "css/404.less"

export default class extends Component {
    constructor() {
        super()
    }

    componentWillMount() {
        U.$setTitle("404")
    }

    componentDidMount() {}

    componentWillUnmount() {}

    render() {
        return (
            <div className={"_no_find"}>
                <img src={require("../image/404H5.png")} alt="404" />
                <div>哎呀！出错了</div>
            </div>
        )
    }
}
