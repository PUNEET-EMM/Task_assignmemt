import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [
    {
      id: 1,
      title: "Complete project report",
      date: "2024-12-04",
      description: "Finalize and submit the project report to the manager.",
      completed: false,
    },
    {
      id: 2,
      title: "Team meeting",
      date: "2024-12-04",
      description: "Discuss project milestones and deadlines.",
      completed: false,
    },
    {
      id: 3,
      title: "Doctor's appointment",
      date: "2024-12-05",
      description: "Routine check-up at 5 PM.",
      completed: false,
    },
    {
      id: 4,
      title: "Grocery shopping",
      date: "2024-12-05",
      description: "Buy vegetables, fruits, and other essentials.",
      completed: false,
    },
    {
      id: 5,
      title: "Code review",
      date: "2024-12-06",
      description: "Review code for the new feature implementation.",
      completed: false,
    },

  ],
};


const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.tasks.push(action.payload);
    },
    editTask: (state, action) => {
      const index = state.tasks.findIndex((task) => task.id === action.payload.id);
      if (index !== -1) state.tasks[index] = action.payload;
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    toggleCompleted: (state, action) => {
      const task = state.tasks.find((task) => task.id === action.payload);
      if (task) task.completed = !task.completed;
    },
    reorderTasks: (state, action) => {
      const { sourceIndex, destinationIndex } = action.payload;
      const [movedTask] = state.tasks.splice(sourceIndex, 1);
      state.tasks.splice(destinationIndex, 0, movedTask); 
    },
  },
});

export const { addTask, editTask, deleteTask, toggleCompleted, reorderTasks } = tasksSlice.actions;
export default tasksSlice.reducer;


