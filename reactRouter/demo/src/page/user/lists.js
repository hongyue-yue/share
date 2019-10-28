import React, { Component } from "react"

export default class UserLists extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        document.title = "userLists"
    }

    render() {
        return (
            <div className="home">
                <h2>userLists</h2>
            </div>
        )
    }
}
