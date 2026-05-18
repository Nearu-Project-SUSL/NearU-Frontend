  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";
  import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
  import { GoogleOAuthProvider } from "@react-oauth/google";

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

  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

  createRoot(document.getElementById("root")!).render(
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );