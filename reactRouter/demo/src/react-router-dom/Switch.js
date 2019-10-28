import React, { Component } from "react"
import { Consumer } from "./context"
import pathToRegexp from "path-to-regexp"

export default class Switch extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Consumer>
                {state => {
                    let pathname = state.location.pathname
                    let children = this.props.children
                    for (var i = 0; i < children.length; i++) {
                        let child = children[i]
                        let path = child.props.path || ""
                        let reg = pathToRegexp(path, [], { end: false })
                        if (reg.test(pathname)) {
                            return child
                        }
                    }
                    return null
                }}
            </Consumer>
        )
    }
}
