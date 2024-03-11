import { useEffect, useReducer } from "react"
import axios from "axios"
import TaskContext from "./taskContext";
import TaskContainer from "./taskContainer";
import TaskStatus from "./taskStatus";

const initialState ={
    taskData: [],
    completedTask:[],
    pendingTask:[],
    overdueTask:[],
    editTask:null,
    selectedTask:null,
}
function taskReducer(state, action){
    switch(action.type){
        case "TASK_INIT":{
            return  {...state, taskData:action.payload}
        }
        case "ADD":{
            return  {...state, taskData:[...state.taskData,action.payload]}
        }
        case  "REMOVE":{
            return{...state, taskData:state.taskData.filter((ele)=>{
                return  ele._id !== action.payload;
            })}
        }
        case "UPDATE_COMPLETED":{
            return {...state,taskData: state.taskData.map((ele)=>{
                if(ele._id === action.payload._id){
                    return action.payload
                }
                else{
                    return ele
                }
            })}
        }
        case "UPDATE_PENDING":{
            return{ ...state, taskData:state.taskData.map((ele)=>{
                if(ele._id === action.payload._id){
                    return action.payload
                }
                else{
                    return ele
                }
            })}
        }
        case "COMPLETED":{
            return {...state, completedTask:state.taskData.filter((ele)=>{
                return ele.status==="completed"
            }),pendingTask:state.taskData.filter((ele)=>{
                return ele.status==='pending'
            }),overdueTask:state.taskData.filter((ele)=>{
                return  new Date(ele.date)<new Date();
            })}
        }
        case "PENDING":{
            return {...state, pendingTask:state.taskData.filter((ele)=>{
                return ele.status==="pending"
            }),completedTask:state.taskData.filter((ele)=>{
                return ele.status==='completed'
            })}
        }
        case "OVERDUE":{
            
            return {...state, overdueTask:state.taskData.filter((ele)=>{
                return new Date(ele.dueDate)<new Date()&&ele.status!=="completed";
            })}

        }
        case "SHOW_DETAILS":{
            return{...state,selectedTask:action.payload}
        }
        case "HIDE_DETAILS":{
            return {...state, selectedTask:null}
        }
        case "EDIT_TASK":{
            return{...state,editTask:action.payload}
        }
        case "CANCEL_EDIT":{
            return{...state,editTask:null}
        }
        // case "EDIT":{
        //     return {...state,taskData:state.taskData.map((ele)=>{
        //         if(ele._id === action.payload._id){
        //             return action.payload
        //         }
        //         else{
        //             return ele
        //         }
        //     })}
        // }
        default:{
            return state
        }
    }
}
function App(){
    const [tasks,taskDispatch] = useReducer(taskReducer,initialState)
   
    useEffect(()=>{
        (async()=>{
            try{
                const response = await axios.get('http://localhost:3002/api/tasks');
                
                // console.log(response.data);
                taskDispatch({type:'TASK_INIT',payload:response.data})
                taskDispatch({type:"COMPLETED"})
                taskDispatch({type:"PENDING"})
                taskDispatch({type:"OVERDUE"})
                
                //console.log(tasks)
            }catch(err){
                alert(err.message)
            }
        })()
    },[]);
    
    // const addTask=(obj)=>{
    //     setTasks([...tasks,obj])
    // }

    // const removeTask = (obj)=>{
    //     const newArr = tasks.filter((ele)=>{
    //         return ele._id !== obj._id;
    //     })
    //     setTasks(newArr)
    // }
    // useEffect(()=>{
      
    // },[tasks])
    
    return(
       <div>

           <h1>Task Manager</h1> 
           <TaskContext.Provider value ={{tasks,taskDispatch}}>
                <TaskStatus/>
                <TaskContainer/>
           </TaskContext.Provider>
       </div>
    )
}

export default App