import React, { Component, createElement } from "react"
//import { connect } from "react-redux"
import {connect} from "reducers/myReact-redux.js"





@connect(({ historyResultOne,historyResultTwo }) => ({ historyResultOne,historyResultTwo }))
export default class Welcome extends Component {
    constructor(props) {
        super(props)
    }
    componentDidMount(){
       this.props.dispatch({currentPath:"gdfgtrhgjghd"},"change router two").then(data=>{
           console.log("fdsafd",data)
       })
    }

    render() {
        console.log(this.props)
        return <div>hello world</div>
    }
}

//export default connect(({ historyResult }) => ({ historyResult }))(Welcome)

