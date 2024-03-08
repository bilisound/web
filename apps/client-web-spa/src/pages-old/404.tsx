import React from "react";
import {
    Box, Button, Flex,
} from "@chakra-ui/react";
import { APP_TITLE_SUFFIX, PRIMARY_COLOR } from "@/constants";
import { Link } from "umi";
import { useTitle } from "react-use";

const NotFound: React.FC = () => {
    useTitle(`404${APP_TITLE_SUFFIX}`);

    return (
        <Box css={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: "100%",
            transform: "translate(-50%, -50%)",
        }}
        >
            <Flex flexDirection="column" justifyContent="center">
                <Box as="h2" textAlign="center" fontSize={["7rem", "8rem", "9rem"]} lineHeight={1} fontWeight="bold">
                    4
                    <Box as="span" color="blue.400">0</Box>
                    4
                </Box>
                <Box as="p" mt={6} mb={6} textAlign="center">当前页面不存在，去康康其他页面吧！</Box>
                <Flex justifyContent="center">
                    <Button as={Link} to="/" colorScheme={PRIMARY_COLOR}>返回首页</Button>
                </Flex>
            </Flex>
        </Box>
    );
};

export default NotFound;
