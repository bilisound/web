import React, { useEffect, useRef } from "react";
import {
    Box,
    Button,
    Center,
    Divider,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Input,
    InputGroup,
    InputRightElement,
    Link,
    Switch,
    Text,
    useColorModeValue,
    VStack,
    Select,
} from "@chakra-ui/react";
import { useConfigStore } from "@/store/configStore";
import { shallow } from "zustand/shallow";
import base64url from "base64url";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaste } from "@fortawesome/free-solid-svg-icons";
import * as themes from "@bilisound2/theme";
import { faFolderOpen } from "@fortawesome/free-regular-svg-icons";
import { VIEWPORT_HEIGHT_WITH_PLAYER } from "../constants";
import { version } from "../../../../package.json";

const themeList = Object.entries(themes).sort((a, b) => {
    if (a[1].order > b[1].order) {
        return 1;
    }
    if (a[1].order < b[1].order) {
        return -1;
    }
    return 0;
});

const { ipcRenderer } = window.electron;

export async function loader() {
    return null;
}

export const Component: React.FC = () => {
    const {
        getItem,
        setItem,
        useAv,
    } = useConfigStore((state) => ({
        getItem: state.getItem,
        setItem: state.setItem,
        useAv: state.useAv,
    }), shallow);

    const downloadPathInputRef = useRef<HTMLInputElement>(null);

    function handleChangeDownloadPathCallback(_: any, path: string) {
        setItem({ downloadPath: path });
        downloadPathInputRef.current!.value = path;
    }

    useEffect(() => {
        ipcRenderer.on("config.changeDownloadPathCallback", handleChangeDownloadPathCallback);
        return () => {
            ipcRenderer.removeAllListeners("config.changeDownloadPathCallback");
        };
    }, []);

    return (
        <Flex
            flexDirection="column"
            alignItems="center"
            h={VIEWPORT_HEIGHT_WITH_PLAYER}
            overflowY="scroll"
            py={8}
            px={4}
        >
            <Box w="100%" maxW="40rem">
                <VStack spacing={5}>
                    <FormControl display="flex" alignItems="center" justifyContent="space-between" w="100%">
                        <FormLabel htmlFor="useAv" mb="0">
                            保存文件名前缀使用 av 号
                        </FormLabel>
                        <Switch
                            id="useAv"
                            defaultChecked={useAv}
                            onChange={(e) => {
                                setItem({
                                    useAv: e.target.checked,
                                });
                            }}
                        />
                    </FormControl>
                    <FormControl w="100%">
                        <FormLabel htmlFor="theme">
                            界面主题
                        </FormLabel>
                        <Select
                            id="theme"
                            placeholder="离韶绿"
                            defaultValue={getItem("theme")}
                            onChange={(e) => setItem({ theme: e.target.value })}
                        >
                            {themeList.slice(1).map(([k, v]) => <option value={k} key={k}>{v.themeName}</option>)}
                        </Select>
                    </FormControl>
                    <FormControl w="100%">
                        <FormLabel htmlFor="downloadPath">
                            文件保存路径
                        </FormLabel>
                        <InputGroup>
                            <Input
                                id="downloadPath"
                                defaultValue={getItem("downloadPath")}
                                placeholder="请输入文件保存路径"
                                ref={downloadPathInputRef}
                                onBlur={(event) => {
                                    handleChangeDownloadPathCallback(null, event.target.value);
                                }}
                            />
                            <InputRightElement w="6.75rem">
                                <Button
                                    w="6rem"
                                    h="1.75rem"
                                    size="sm"
                                    onClick={() => {
                                        ipcRenderer.send("config.changeDownloadPath");
                                    }}
                                    leftIcon={<FontAwesomeIcon icon={faFolderOpen} />}
                                >
                                    选择路径
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>
                </VStack>
                <Divider mt={6} mb={4} />
                <HStack
                    justifyContent="center"
                    fontSize={14}
                    opacity={0.6}
                    w="100%"
                    textAlign="center"
                    spacing={4}
                >
                    <Box flexShrink={0}>{`Version ${version}`}</Box>
                    <Link as="a" href="https://bilisound.moe" target="_blank">访问首页</Link>
                </HStack>
            </Box>
        </Flex>
    );
};
