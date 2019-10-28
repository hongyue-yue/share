import React, { Component, createElement } from "react"
import  Router  from "./Router";
import { createHashHistory as createHistory } from "history";

export default class HashRouter extends Component{
    history = createHistory(this.props);
    render() {
        return <Router history={this.history} children={this.props.children} />;
      }
} 