import { useContext } from "react"
import TaskContext from "./taskContext"
export default function TaskStatus(){
    const{tasks} = useContext(TaskContext)
    return(
        <div>
            <h2>Task Status</h2>
            <h3>completed:{tasks.completedTask.length}</h3>
            <h3>pending:{tasks.pendingTask.length}</h3>
            <h3>overdue:{tasks.overdueTask.length}</h3>
        </div>
    )
}