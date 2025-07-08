import Todo from "./components/Todo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Todo />
    </QueryClientProvider>
  );
};

export default App;
