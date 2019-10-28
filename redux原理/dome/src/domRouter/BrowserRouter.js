import React, { Component, createElement } from "react"
import Router from "./Router";
import { createBrowserHistory as createHistory } from "history";

export default class BrowserRouter extends Component{
    history = createHistory(this.props);
    render() {
        return <Router history={this.history} children={this.props.children} />;
      }
} 