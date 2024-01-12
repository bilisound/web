import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { useRouteError } from "react-router-dom";

const Component: React.FC = () => {
    const error = useRouteError();

    console.log(error);

    return (
        <Box>
            <Text>{`error toString: ${error}`}</Text>
            <Text>{`error: ${JSON.stringify(error)}`}</Text>
        </Box>
    );
};

export default Component;
