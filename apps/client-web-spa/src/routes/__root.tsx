import { createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import WebLayout from "@/layouts";

export const Route = createRootRoute({
    component: () => (
        <>
            <WebLayout />
            {process.env.NODE_ENV === "development" ? <TanStackRouterDevtools /> : null}
        </>
    ),
    notFoundComponent: () => <div>404 not found</div>,
});
