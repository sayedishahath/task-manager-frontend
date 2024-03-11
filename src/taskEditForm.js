import { useState,useContext } from "react"
import axios from "axios";
import _ from 'lodash'
import TaskContext from "./taskContext";
const errorStyle={
    color:"red"
}
export default function TaskEditForm(){
    const {tasks,taskDispatch} = useContext(TaskContext)
    const [taskTitle, setTaskTitle] = useState(tasks.selectedTask.title);
    const [taskDescription,setTaskDescription] =useState(tasks.selectedTask.description)
    const [taskStatus,setTaskStatus]=useState(tasks.selectedTask.status)
    const [taskPriority,setTaskPriority]=useState(tasks.selectedTask.priority)
    const [taskDueDate,setTaskDueDate] = useState('')
    const [formError,setFormError] = useState({})
    const [serverError,setServerError] = useState({
        title:'',
        description:'',
        status:'',
        priority:'',
        dueDate:''
    })
    const errors ={}
    const validateErrors = ()=>{
        if(taskTitle.trim().length===0){
            errors.taskTitle = 'Title is required'
        }
        if(taskDescription.trim().length===0){
            errors.taskDescription = 'Description is required'
        }
        if(taskStatus.trim().length===0){
            errors.taskStatus = 'Status is required'
        }
        if(taskPriority.trim().length===0){
            errors.taskPriority = 'Priority is required'
        }
        if(taskDueDate.trim().length===0){
            errors.taskDueDate = 'Due date is required'
        }
    }
    const emptyFormError = ()=>{
        if(taskTitle.trim().length>0){
            formError.taskTitle = null
        }
        if(taskDescription.trim().length>0){
            formError.taskDescription = null
        }
        if(taskStatus.trim().length>0){
            formError.taskStatus = null
        }
        if(taskPriority.trim().length>0){
            formError.taskPriority = null
        }
        if(taskDueDate.trim().length>0){
            formError.taskDueDate = null
        }
    }

    const handleEdit =async (e)=>{
        e.preventDefault()
        const formData={
            title: taskTitle,
            description: taskDescription,
            status: taskStatus,
            priority: taskPriority,
            dueDate: taskDueDate
        }
        validateErrors()
        if(_.isEmpty(errors)){
            try{
                const response = await axios.put(`http://localhost:3002/api/tasks/${tasks.selectedTask._id}`,formData)
                const result = response.data
                console.log(result)
                taskDispatch({type:"UPDATE_COMPLETED",payload:result}) 
                taskDispatch({type:"PENDING"})
                taskDispatch({type:"OVERDUE"})
                taskDispatch({type:"HIDE_DETAILS"})
                alert('saved changes')
                setTaskTitle('')
                setTaskDescription('')
                setTaskPriority('')
                setTaskStatus('')
                setTaskDueDate('')
                setFormError({})
                setServerError({
                    title:'',
                    description:'',
                    status:'',
                    priority:'',
                    dueDate:''
                })
            }catch(err){
                // alert(err.message)
                const errors = err.response.data.errors
                console.log(errors)
                const serverErrors= {}
                serverErrors.title=errors.find((e)=>{
                    return e.path ==='title'
                })
                serverErrors.description=errors.find((e)=>{
                    return e.path==='description'
                })
                serverErrors.status=errors.find((e)=>{
                    return e.path==='status'
                })
                serverErrors.priority=errors.find((e)=>{
                    return e.path==='priority'
                })
                serverErrors.dueDate=errors.find((e)=>{
                    return e.path==='dueDate'
                })
                console.log(serverError)
                setServerError(serverErrors)
                setFormError({})
            }
        }
        else{
            setFormError(errors)
            setServerError({
                title:'',
                description:'',
                status:'',
                priority:'',
                dueDate:''
            })
        }
    }
    return(
        <div>
            <form onSubmit={handleEdit}>
            <label htmlFor="etitle">Title:</label>
                <input 
                    id="etitle"
                    type="text" 
                    value={taskTitle}
                    onChange={(e)=>{
                        setTaskTitle(e.target.value)
                        emptyFormError()
                    }}/>
                    {formError.taskTitle&&<span style={errorStyle}>{formError.taskTitle}</span>}
                    {(serverError.title&&<span>{serverError.title.msg}</span>)}<br/>

                <label htmlFor="edescription">Description:</label>
                <input 
                    id="edescription"
                    type="text" 
                    value={taskDescription}
                    onChange={(e)=>{
                        setTaskDescription(e.target.value)
                        emptyFormError()
                    }}/>
                    {formError.taskDescription&&<span style={errorStyle}>{formError.taskDescription}</span>}
                    {(serverError.description&&<span>{serverError.description.msg}</span>)}<br/>

                <label htmlFor="estatus">Status:</label>
                <select 
                    id="estatus"
                    value={taskStatus}
                    onChange={(e)=>{
                        setTaskStatus(e.target.value)
                        emptyFormError()
                        }}>
                    <option value="">set status</option>
                    <option value ="pending">pending</option>
                    <option value ="completed">completed</option>
                </select>
                {formError.taskStatus&&<span style={errorStyle}>{formError.taskStatus}</span>}
                {(serverError.status&&<span>{serverError.status.msg}</span>)}<br/>
                <label htmlFor="epriority">Priority: </label>
                <select
                    id="epriority"
                    value={taskPriority}
                    onChange={(e)=>{
                        setTaskPriority(e.target.value)
                        emptyFormError()
                    }}>
                    <option value ="">set priority</option>
                    <option value='low' readOnly>low</option>
                    <option value='medium' readOnly>medium</option>
                    <option value='high' readOnly>high</option>
                </select>
                {formError.taskPriority&&<span style={errorStyle}>{formError.taskPriority}</span>}
                {(serverError.priority&&<span>{serverError.priority.msg}</span>)}<br/>
                <label htmlFor="edueDate">Due date:</label>
                <input
                id="edueDate"
                type="date"
                value={taskDueDate}
                onChange={(e)=>{
                    setTaskDueDate(e.target.value)
                    emptyFormError()
                }}
                
                />
                {formError.taskDueDate&&<span style={errorStyle}>{formError.taskDueDate}</span>}
                {(serverError.dueDate&&<span>{serverError.dueDate.msg}</span>)}<br/>
                <button onClick={()=>{
                    taskDispatch({type:"CANCEL_EDIT"})
                }}>discard</button>
                <input type="submit" value="save changes"/>
            </form>
        </div>
    )
}