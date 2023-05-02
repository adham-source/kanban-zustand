import classNames from "classnames"
import { useStore } from "../store"

export default function Task({ id }) {
  const { task, setDraggedTask, deleteTask } = useStore((store) => ({
    task: store.tasks.find((task) => task.id === id),
    setDraggedTask: store.setDraggedTask,
    deleteTask: store.deleteTask,
  }))
  
  return (
    <div
      className="task my-3 flex flex-col bg-white rounded-md shadow-md p-4"
      draggable
      onDragStart={() => {
        setDraggedTask(task.id)
      }}
    >
      <div className="text-lg font-semibold text-gray-800">{task.title}</div>
      <div className="flex justify-between items-center mt-4">
        <button
          className="px-2 py-1 rounded-md text-gray-800 capitalize bg-gray-300 hover:bg-red-600 hover:text-white text-md"
          onClick={() => deleteTask(task.id)}
        >
          Delete
        </button>
        <div
          className={classNames(
            "status text-xs text-white rounded-md px-2 py-1",
            {
              "bg-blue-500": task.state === "PLANNED",
              "bg-yellow-500": task.state === "ONGOING",
              "bg-green-500": task.state === "DONE",
            },
          )}
        >
          {task.state}
        </div>
      </div>
    </div>
  )
}
