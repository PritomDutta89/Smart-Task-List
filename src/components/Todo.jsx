import { useEffect, useState } from "react";
import axios from "axios";
import TaskForm from "./TaskForm";
import TaskItem from "./TaskItem";
import { getStatus, showErrorToast, showSuccessToast } from "../utils/constant";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API = "/api/tasks";

const Todo = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    const res = await axios.get(API);
    setTasks(res.data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 60000);
    return () => clearInterval(interval);
  }, []);

  const createTask = async (task) => {
    try {
      const res = await axios.post(API, { ...task });
      setTasks((prev) => [...prev, res.data]);
      showSuccessToast("Task created successfully!");
    } catch (error) {
      console.log(error);
      showErrorToast("Something went wrong. Please try again!");
    }
  };

  const toggleComplete = async (id, isCompleted) => {
    const task = tasks.find((t) => t.id === id);
    const res = await axios.put(`${API}/${id}`, { ...task, isCompleted });
    setTasks((prev) => prev.map((t) => (t.id === id ? res.data : t)));
  };

  const updateTask = async (id, updatedTask) => {
    try {
      const res = await axios.put(`${API}/${id}`, updatedTask);
      setTasks((prev) => prev.map((t) => (t.id === id ? res.data : t)));
      showSuccessToast("Task updated successfully!");
    } catch (error) {
      console.log(error);
      showErrorToast("Something went wrong. Please try again!");
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      showSuccessToast("Task deleted successfully!");
    } catch (error) {
      console.log(error);
      showErrorToast("Something went wrong. Please try again!");
    }
  };

  const bucketed = {
    Ongoing: [],
    Success: [],
    Failure: [],
  };

  if (Array.isArray(tasks)) {
    tasks.forEach((task) => {
      bucketed[getStatus(task)].push(task);
    });
  }

  if (loading) return <p className="text-center mt-10">Loading tasks...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Smart Todo List</h1>
      <TaskForm onSave={createTask} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(bucketed).map(([status, tasks]) => (
          <div key={status}>
            <h2 className="text-xl font-semibold mb-2">{status}</h2>
            <div className="flex flex-col gap-2">
              {tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleComplete}
                  onDelete={deleteTask}
                  onUpdate={updateTask}
                />
              ))}
              {tasks.length === 0 && (
                <p className="text-sm text-gray-400">No tasks</p>
              )}
            </div>
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Todo;
