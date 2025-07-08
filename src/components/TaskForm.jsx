import React, { useState } from "react";
import { ClipLoader } from "react-spinners";

const TaskForm = ({ onSave }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    onSave({ title, description, deadline });
    setTitle("");
    setDescription("");
    setDeadline("");
    setLoading(false);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-white shadow rounded mb-4 flex flex-col gap-2"
      >
        <input
          required
          type="text"
          placeholder="Title"
          className="border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          className="border p-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <input
          required
          type="datetime-local"
          className="border p-2 rounded"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        {loading ? (
          <div className="flex justify-center items-center mt-[1rem]">
            <ClipLoader
              color="#04265e"
              size={35}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        ) : (
          <button
            type="submit"
            className="bg-[#053d97] text-white rounded px-4 py-2 hover:bg-blue-800 cursor-pointer"
          >
            Add Task
          </button>
        )}
      </form>
    </>
  );
};

export default TaskForm;
