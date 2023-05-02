import { Suspense, lazy, useState } from "react"
import { useStore } from "../store"
import "./Column.css"
import classNames from "classnames"

const Task = lazy(() => import("./Task"))

export default function Column({ state }) {
  const [text, setText] = useState("")
  const [open, setOpen] = useState(false)
  const [drop, setDrop] = useState(false)
  const { tasks, addTask, setDraggedTask, draggedTask, moveTask } = useStore(
    (store) => ({
      tasks: store.tasks.filter((task) => task.state === state),
      addTask: store.addTask,
      setDraggedTask: store.setDraggedTask,
      draggedTask: store.draggedTask,
      moveTask: store.moveTask,
    }),
  )

  const handleCloseModal = () => {
    setOpen(false)
    setText("")
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (text.trim() === "") {
      alert("This feild is required.")
      return
    }

    if (text.trim().length < 3) {
      alert("Enter least 3 chars.")
      return
    }
    addTask(text, state)
    setText("")
    setOpen(false)
  }

  return (
    <div
      className={classNames("column", { drop: drop })}
      onDragOver={(event) => {
        setDrop(true)
        event.preventDefault()
      }}
      onDragLeave={(event) => {
        setDrop(false)
        event.preventDefault()
      }}
      onDrop={() => {
        setDrop(false)
        moveTask(draggedTask, state)
        setDraggedTask(null)
      }}
    >
      <div className="titleWrapper">
        <p>{state}</p>
        <button
          onClick={() => setOpen(true)}
          className="px-3 py-2 rounded-md text-gray-800 uppercase bg-gray-300 hover:bg-blue-400 hover:text-white text-md"
        >
          Add
        </button>
      </div>

      {tasks.length > 0 &&
        tasks.map((task) => (
          <Suspense
            key={task.id}
            fallback={
              <div className="text-center my-2">
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            }
          >
            <Task id={task.id} />
          </Suspense>
        ))}
      {open && (
        <div
          className="absolute w-full h-full top-0 left-0"
          style={{
            background: "rgba(0, 0, 0, 0.6)",
          }}
        >
          <div
            className="rounded p-2 bg-white z-1 absolute"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              transition: "all .3s linear",
            }}
          >
            <button
              type="button"
              className="py-3 px-2 rounded-full absolute  text-md bg-yellow-300 text-gray-900"
              onClick={handleCloseModal}
              style={{
                top: "-50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              Close
            </button>
            <form
              onSubmit={handleSubmit}
              className="flex gap-2 justify-center min-w-full"
            >
              <input
                onChange={(event) => setText(event.target.value)}
                value={text}
                className="py-3 px-2 rounded bg-slate-600 border-none text-md  border"
                autoFocus
                placeholder="Add New Task..."
              />
              <button
                type="submit"
                className="py-3 px-2 rounded text-md bg-blue-400 hover:bg-blue-600"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
