import React, { Component } from "react"

export default class UserAdd extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        document.title = "useradd"
    }

    render() {
        return (
            <div className="home">
                <h2>add</h2>
            </div>
        )
    }
}
