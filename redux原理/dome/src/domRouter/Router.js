import React, { Component, createElement } from "react"
import  { Provider } from "./RouterContext"

export default class Router extends Component{
    constructor(props) {
        super(props);
    
        this.state = {
          location: props.history.location
        };
       
       
    }
    componentDidMount() {
        this.unlisten = this.props.history.listen(location => {
           
              this.setState({ location });
            
         });
    }
    componentWillUnmount() {
        if (this.unlisten) this.unlisten();
    }
    render(){
        return(
            <Provider
                value={{
                    history: this.props.history,
                    location: this.state.location,
                }}
            >
             {this.props.children}
            </Provider>
        )
    }
}
