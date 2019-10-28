import React, { Component } from "react"
import "css/home.less"

export default class Home extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        document.title = "home"
    }

    render() {
        return (
            <div className="home">
                <h2>home</h2>
            </div>
        )
    }
}
