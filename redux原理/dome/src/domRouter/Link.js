import React, { Component, createElement } from "react"
import pathToRegexp from "path-to-regexp";
import {Consumer} from "./RouterContext"

import {resolveToLocation,normalizeToLocation} from "./matchPath"


export default class Link extends Component{
    constructor(props) {
        super(props)
    }
    render(){

        return(
        <Consumer>
            {
                context=>{
                    const { history } = context; 
                    let { to,replace }=this.props
                    let location = normalizeToLocation(
                        resolveToLocation(to, context.location),
                        context.location
                    );
                    let href = location ? history.createHref(location) : "";
                    return(
                     <a onClick={event=>{
                            event.preventDefault();
                            let location = resolveToLocation(to, context.location);
                            let method = replace ? history.replace : history.push;
                            method(location);
                      }}
                     >
                      {this.props.children}
                     </a>
                    )
                } 
            }
        </Consumer>
        )
    }
}