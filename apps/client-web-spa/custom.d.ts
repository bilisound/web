// https://stackoverflow.com/questions/73455263/fetch-priority-attribute-in-img-tag-react-js

import { AriaAttributes, DOMAttributes } from "react";

declare module "react" {
    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
        fetchpriority?: "high" | "low" | "auto";
    }
}
