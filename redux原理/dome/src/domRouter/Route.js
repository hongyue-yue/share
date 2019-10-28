import React, { Component, createElement } from "react"

import {Consumer} from "./RouterContext"
import {matchPath} from "./matchPath"


export default class Route extends Component{
    constructor(props) {
        super(props)
    }
    render(){
        return(
            <Consumer>
                {context=>{
                    let {path,
                         component: Component,
                         exact = false
                    }=this.props
                    let location =context.location;

                    let keys = [];
                    const match=this.props.path? matchPath(location.pathname, this.props): context.match;
                    const props = { ...context, location, match };
                    
                    return(
                        match?createElement(Component, props):null
                    )
                }}
            </Consumer>
        )
    }

}