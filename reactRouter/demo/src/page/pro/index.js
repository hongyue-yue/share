import React, { Component } from "react"
import { Link } from "./../../react-router-dom"

export default class Pro extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        document.title = "pro"
    }

    render() {
        return (
            <div className="home">
                <p>
                    <Link to="/detail/1">列表1</Link>
                </p>
                <p>
                    <Link to="/detail/2">列表2</Link>
                </p>
            </div>
        )
    }
}
