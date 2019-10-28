import React, { Component } from "react"
import { Provider } from "./context"

export default class HashRouter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            location: {
                pathname: window.location.hash.slice(1) || "/"
            }
        }
    }

    componentDidMount() {
        //默认hash没有时跳转到/
        window.location.hash = window.location.hash || "/"

        //监听hash变化
        window.addEventListener("hashchange", () => {
            this.setState({
                location: {
                    ...this.state.location,
                    pathname: window.location.hash.slice(1) || "/"
                }
            })
        })
    }

    render() {
        let value = {
            location: this.state.location,
            history: {
                push(to) {
                    window.location.hash = to
                }
            }
        }
        return <Provider value={value}>{this.props.children}</Provider>
    }
}
