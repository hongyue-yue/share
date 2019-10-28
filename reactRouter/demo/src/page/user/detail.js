import React, { Component } from "react"

export default class Detail extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        document.title = "detail"
    }

    render() {
        console.log(this.props)
        return (
            <div className="home">
                <h2>detail {this.props.match.params.id}</h2>
            </div>
        )
    }
}
