import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "@/theme";
import "animate.css";
import "./root.css";

export const rootContainer = (container: React.ReactNode) => (
    <React.StrictMode>
        <ChakraProvider
            toastOptions={{
                defaultOptions: {
                    isClosable: true,
                    position: "top-right",
                },
            }}
            theme={theme}
        >
            {container}
        </ChakraProvider>
    </React.StrictMode>
);
