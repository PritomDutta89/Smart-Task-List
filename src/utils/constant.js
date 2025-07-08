import { isBefore } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const getStatus = (task) => {
  const now = new Date();
  const deadline = new Date(task.deadline);
  if (task.isCompleted) return "Success";
  if (isBefore(deadline, now)) return "Failure";
  return "Ongoing";
};

export const showSuccessToast = (message) => {
  toast.success(message, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  });
};

export const showErrorToast = (message) => {
  toast.error(message, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  });
};
