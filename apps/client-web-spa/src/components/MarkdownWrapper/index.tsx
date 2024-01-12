import React from "react";
import { forwardRef } from "@chakra-ui/react";
import type { ProseProps } from "@nikolovlazar/chakra-ui-prose";
import { Prose } from "@nikolovlazar/chakra-ui-prose";

const MarkdownWrapper = forwardRef<ProseProps, "article">((props, ref) => (
    <Prose
        my={8}
        css={{
            h2: {
                marginTop: "2rem",
            },
            li: {
                marginTop: "0.25rem",
                marginBottom: "0.25rem",
            },
            a: {
                color: "var(--chakra-colors-blue-500)",
            },
        }}
        {...props}
    >
        {props.children}
    </Prose>
));

export default MarkdownWrapper;
