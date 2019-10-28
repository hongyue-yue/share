import React, { Component, createElement, Children } from "react"

export default class extends Component {
    constructor(props) {
        super()
    }
    render() {
        return Children.only(this.props.children)
    }
}
