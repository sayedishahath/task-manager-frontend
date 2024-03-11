import TaskTable from "./taskTable";
import TaskForm from "./taskForm"
export default function TaskContainer(){
    return(
        <div>
            <TaskForm/>
            <TaskTable/>
        </div>
    )
}