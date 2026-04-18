import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import IDE from "@/pages/IDE";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <IDE />
    </QueryClientProvider>
  );
}

export default App;
