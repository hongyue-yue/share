import React, { Component, createElement } from "react"
import {Consumer} from "./RouterContext"
import {matchPath} from "./matchPath"

export default class Switch extends Component{
    render(){
        return(
            <Consumer>
                {
                    context=>{
                        const location = this.props.location || context.location;
                        let element, match;
                        React.Children.forEach(this.props.children, child => {
                        if (match == null && React.isValidElement(child)) {
                          element = child;

                          const path = child.props.path || child.props.from;

                          match = path
                            ? matchPath(location.pathname, { ...child.props, path })
                            : context.match;
                        }
                      });

                     return match? React.cloneElement(element, { location, computedMatch: match }): null;
                    }
                }
            </Consumer>
        )
       
    }
}