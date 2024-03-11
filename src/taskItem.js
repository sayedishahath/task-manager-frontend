import { useContext} from "react"
import axios from "axios"
import TaskContext from "./taskContext"
// import TaskList from "./taskList"

function TaskItem(){
    
    const {tasks,taskDispatch} = useContext(TaskContext)  //accesing the dispatch
    const showDetails =async(obj)=>{
        try{
            const response =await axios.get(`http://localhost:3002/api/tasks/${obj._id}`) 
            console.log(response.data)
            const result = response.data
            taskDispatch({type:"SHOW_DETAILS",payload:result}) 
        }catch(err){
            alert(err.message)
        }
    }
    const handleStatus = async(id,e)=>{
        try{
            if(e.target.checked){
                const response = await axios.put(`http://localhost:3002/api/tasks/completed/${id}`)
                const result = response.data
                taskDispatch({type:"UPDATE_COMPLETED",payload:result})
                taskDispatch({type:"COMPLETED"})
                taskDispatch({type:"OVERDUE"})
                console.log(result)
            }
            else{
                const response = await axios.put(`http://localhost:3002/api/tasks/pending/${id}`)
                const result = response.data
                taskDispatch({type:"UPDATE_PENDING",payload:result})
                taskDispatch({type:"PENDING"})
                taskDispatch({type:"OVERDUE"});
                console.log(result)
            }
        }catch(err){
            alert(err.message)
        }
       

    }
    const handleRemove =async (obj)=>{
        const confirmation = window.confirm(`are you sure you want to remove ${obj.title} ?`)
        if(confirmation){
            try{
                const response = await axios.delete(`http://localhost:3002/api/tasks/${obj._id}`)
                const result = response.data
                console.log(result)
                taskDispatch({type: 'REMOVE', payload: obj._id}) 
                taskDispatch({type:"PENDING"})
                taskDispatch({type:"OVERDUE"})
            }catch(err){
                alert(err)
            }
        }
    }
    return(
            
            <tbody>
            {tasks.taskData.map((task)=>{
                return (
                <tr key ={task._id}>
                    <td>{task.title}</td>
                    <td>{task.description}</td>
                    <td>
                        <input
                        type="checkbox"
                        checked={task.status==='completed'} 
                        onChange={(e)=>{
                            handleStatus(task._id,e)
                        }}
                        />
                    </td>
                    <td>{task.dueDate}</td>
                    <td>
                        <button onClick={()=>showDetails(task)} >Show Details</button>
                        <button onClick={()=>handleRemove(task)}>Delete</button>
                    </td>
                </tr>
                )
             })}
            </tbody>
            
            
        
    )
}

export default TaskItem