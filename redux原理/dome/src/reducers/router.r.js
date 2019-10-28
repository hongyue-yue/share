//import { handleActions,createAction } from "redux-actions"
import {handleActions} from "reducers/MyRedux.js"
let defaultState={ currentPath: ""}


/*export const historyResult = handleActions(
    {
        "change router":(state, action) => {
            debugger
            return {...state,...action.payload}
        }
    },
    defaultState
)*/

export  const historyResultOne =handleActions(
        {
            "change router one":(state,newState)=>{
                return {...state,...newState}
            }
        },
        { currentPath: ""}
)
export  const historyResultTwo =handleActions(
    {
        "change router two":(state,newState)=>{
            return {...state,...newState}
        }
    },
    { currentPath: ""}
)

