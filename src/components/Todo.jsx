import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import TaskForm from "./TaskForm";
import TaskItem from "./TaskItem";
import { getStatus, showErrorToast, showSuccessToast } from "../utils/constant";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";
import { useTaskContext } from "../context/TaskContext";

const API = "/api/tasks";

const Todo = () => {
  const { taskFilter, setTaskFilter } = useTaskContext();
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await axios.get(API);
      return res.data ?? [];
    },
    refetchInterval: 60000,
  });

  const createTaskMutation = useMutation({
    mutationFn: (task) => axios.post(API, task),
    onSuccess: (res) => {
      queryClient.invalidateQueries(["tasks"]);
      showSuccessToast("Task created successfully!");
    },
    onError: () => showErrorToast("Something went wrong. Please try again!"),
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, updatedTask }) => axios.put(`${API}/${id}`, updatedTask),
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      showSuccessToast("Task updated successfully!");
    },
    onError: () => showErrorToast("Something went wrong. Please try again!"),
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (id) => axios.delete(`${API}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      showSuccessToast("Task deleted successfully!");
    },
    onError: () => showErrorToast("Something went wrong. Please try again!"),
  });

  const toggleComplete = (id, isCompleted) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    updateTaskMutation.mutate({ id, updatedTask: { ...task, isCompleted } });
  };

  const bucketed = {
    Ongoing: [],
    Success: [],
    Failure: [],
  };

  tasks.forEach((task) => {
    const status = getStatus(task);
    if (taskFilter === "All" || taskFilter === status)
      bucketed[status].push(task);
  });

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Smart Todo List</h1>
      <div className="mb-4 flex justify-end">
        <select
          className="border px-2 py-1 rounded"
          value={taskFilter}
          onChange={(e) => setTaskFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Success">Success</option>
          <option value="Failure">Failure</option>
        </select>
      </div>
      <TaskForm onSave={(task) => createTaskMutation.mutate(task)} />
      {isLoading ? (
        <div className="flex justify-center items-center mt-[1rem]">
          <ClipLoader
            color="#04265e"
            size={35}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
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
                    onDelete={(id) => deleteTaskMutation.mutate(id)}
                    onUpdate={(id, updatedTask) =>
                      updateTaskMutation.mutate({ id, updatedTask })
                    }
                  />
                ))}
                {tasks.length === 0 && (
                  <p className="text-sm text-gray-400">No tasks</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Todo;
