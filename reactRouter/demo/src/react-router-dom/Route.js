import React, { Component } from "react"
import { Consumer } from "./context"
import pathToRegexp from "path-to-regexp"

export default class Route extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Consumer>
                {state => {
                    let {
                        path,
                        component: Component,
                        exact = false
                    } = this.props

                    let pathname = state.location.pathname

                    let keys = []
                    let reg = pathToRegexp(path, keys, { end: exact })

                    keys = keys.map(item => {
                        return item.name
                    })
                    let result = pathname.match(reg)

                    let [url, ...values] = result || []

                    let props = {
                        location: state.location,
                        history: state.history,
                        match: {
                            params: keys.reduce((obj, current, index) => {
                                obj[current] = values[index]
                                return obj
                            }, {})
                        }
                    }
                    if (result) {
                        // return React.createElement(Component, props)
                        return <Component {...props} />
                    }
                    return null
                }}
            </Consumer>
        )
    }
}
