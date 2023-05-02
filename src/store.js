import { v4 as uuidv4 } from "uuid"
import { produce } from "immer"
import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

const store = (set) => ({
  tasks: [],
  draggedTask: null,
  addTask: (title, state) =>
    set(
      produce((store) => {
        store.tasks.push({ id: uuidv4(), title, state })
      }),
      // (store) => ({ tasks: [...store.tasks, { title, state }] }),
      false,
      "addTask",
    ),
  deleteTask: (id) =>
    set((store) => ({
      tasks: store.tasks.filter((task) => task.id !== id),
    })),

  setDraggedTask: (id) => set({ draggedTask: id }),
  moveTask: (id, state) =>
    set((store) => ({
      tasks: store.tasks.map((task) =>
        task.id === id ? { ...task, state } : task,
      ),
    })),
})

export const useStore = create(persist(devtools(store), {name: "store"}))