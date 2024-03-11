import {useContext} from "react";
// import axios from "axios"
import TaskContext from "./taskContext";
import TaskItem from "./taskItem";
import TaskEditForm from "./taskEditForm";
// import TaskItem from "./taskItem";
function TaskTable(){
    const {tasks,taskDispatch} = useContext(TaskContext)

    return(
        <div>
            {tasks.taskData.length===0?<h2>no tasks added. add new task</h2>:(
                <div>
                    <h2>Total tasks - {tasks.taskData.length}</h2>
                    <table border={1}>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Due Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        
                            <TaskItem/>
                        
                    </table>
                    {tasks.selectedTask&&
                    <section>
                        <b>Selected Task:</b><br/>
                        {tasks.editTask?
                        <TaskEditForm/>:
                        <p>
                            Title: {tasks.selectedTask.title}<br/>
                            Description:{tasks.selectedTask.description}<br/>
                            Priority:{tasks.selectedTask.priority}<br/>
                            Status:{tasks.selectedTask.status}<br/>
                            <button
                            onClick={()=>{
                                taskDispatch({type:"HIDE_DETAILS"})
                            }}>hide details</button>
                            <button 
                            onClick={()=>{
                                taskDispatch({type: 'EDIT_TASK', payload: tasks.selectedTask});
                            }}>Edit</button>
                        </p>}
                        
                    </section>}
                    
                </div>
            )}
            

            
        </div>
        
    )
}
export default TaskTable;