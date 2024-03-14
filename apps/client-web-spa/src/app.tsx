import React from "react";
import "./root.css";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const rootContainer = (container: React.ReactNode) => (
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            {container}
            <Toaster />
        </QueryClientProvider>
    </React.StrictMode>
);
