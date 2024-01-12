import React from "react";
import type { BoxProps } from "@chakra-ui/react";
import { Box, forwardRef } from "@chakra-ui/react";
import { omit } from "lodash-es";

const Wrapper = forwardRef<BoxProps & {
    containerWidth?: string
    paddingX?: string | number
}, "div">((props, ref) => (
    <Box px={props.paddingX ?? 5}>
        <Box
            css={{
                margin: "0 auto",
                maxWidth: props.containerWidth || "60rem",
            }}
            ref={ref}
            {...omit(props, "containerWidth")}
        >
            {props.children}
        </Box>
    </Box>
));

export default Wrapper;
