import { createContext, useContext, useState } from "react";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [taskFilter, setTaskFilter] = useState("All");

  return (
    <TaskContext.Provider value={{ taskFilter, setTaskFilter }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => useContext(TaskContext);
