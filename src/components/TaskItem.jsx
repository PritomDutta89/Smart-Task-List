import { useState } from "react";
import { getStatus } from "../utils/constant";
import { formatDistanceToNow, isBefore } from "date-fns";

const TaskItem = ({ task, onToggle, onDelete, onUpdate }) => {
  const status = getStatus(task);
  const [isEditing, setIsEditing] = useState(false);
  const [editTask, setEditTask] = useState({
    title: task.title,
    description: task.description,
    deadline: task.deadline,
  });

  const handleEditChange = (e) => {
    setEditTask({ ...editTask, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    onUpdate(task.id, { ...task, ...editTask });
    setIsEditing(false);
  };

  return (
    <div className="border rounded p-4 shadow flex flex-col gap-2 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-100">
      {!isEditing ? (
        <>
          <div className="flex flex-col gap-[1rem] items-start ">
            <div>
              <h3 className="text-lg font-semibold">{task.title}</h3>
              {task.description && (
                <p className="text-sm">{task.description}</p>
              )}
              <p className="text-xs text-gray-500">
                {task.isCompleted
                  ? "Completed"
                  : isBefore(new Date(task.deadline), new Date())
                  ? `Overdue by ${formatDistanceToNow(new Date(task.deadline))}`
                  : `Due in ${formatDistanceToNow(new Date(task.deadline))}`}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                className="text-green-600 hover:underline cursor-pointer"
                onClick={() => onToggle(task.id, !task.isCompleted)}
              >
                {task.isCompleted ? "Undo" : "Complete"}
              </button>
              <button
                className="text-yellow-600 hover:underline cursor-pointer"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
              <button
                className="text-red-600 hover:underline cursor-pointer"
                onClick={() => onDelete(task.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-2">
          <input
            name="title"
            value={editTask.title}
            onChange={handleEditChange}
            className="border p-1 rounded"
            placeholder="Title"
          />
          <textarea
            name="description"
            value={editTask.description}
            onChange={handleEditChange}
            className="border p-1 rounded"
            placeholder="Description"
          />
          <input
            name="deadline"
            type="datetime-local"
            value={editTask.deadline}
            onChange={handleEditChange}
            className="border p-1 rounded"
          />
          <div className="flex gap-2">
            <button
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 cursor-pointer"
              onClick={handleUpdate}
            >
              Save
            </button>
            <button
              className="bg-gray-300 px-3 py-1 rounded cursor-pointer"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;
