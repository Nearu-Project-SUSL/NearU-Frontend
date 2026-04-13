
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";
  import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

  // createRoot(document.getElementById("root")!).render(<App />);
  
  const queryClient = new QueryClient({
    defaultOptions:{
      queries:{
        staleTime: 5* 60 *1000, //data consider fresh for 5 min no refresh that time

        gcTime: 10 * 60 * 1000, //keep unuse data in cache for 10 min after that delete

        retry: 2,
      },
    },
  }); 

  createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );