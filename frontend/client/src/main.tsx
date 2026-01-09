import { trpc } from "@/lib/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Don't retry on auth errors
      retry: (failureCount, error) => {
        if (error instanceof TRPCClientError) {
          // Don't retry auth errors
          if (error.data?.code === 'UNAUTHORIZED' || error.data?.code === 'FORBIDDEN') {
            return false;
          }
        }
        return failureCount < 3;
      },
      // Don't refetch on window focus to avoid logout issues
      refetchOnWindowFocus: false,
    },
  },
});

// Log errors but don't redirect - we handle auth via localStorage now
queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    console.error("[API Query Error]", error);
  }
});

queryClient.getMutationCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.mutation.state.error;
    console.error("[API Mutation Error]", error);
  }
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      fetch(input, init) {
        // Get the JWT token from localStorage and include it in requests
        const token = localStorage.getItem('frontendToken');
        const headers: Record<string, string> = {
          ...(init?.headers as Record<string, string> || {}),
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        return globalThis.fetch(input, {
          ...(init ?? {}),
          headers,
          credentials: "include",
        });
      },
    }),
  ],
});

createRoot(document.getElementById("root")!).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </trpc.Provider>
);
