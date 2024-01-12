import React, { useState } from "react";
import {
    Box,
    Button,
    Center,
    FormControl,
    FormLabel,
    HStack,
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    Portal,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFileArrowDown, faGear, faLink, faMagnifyingGlass, faPaste,
} from "@fortawesome/free-solid-svg-icons";
import { SubmitHandler, useForm } from "react-hook-form";
import { shallow } from "zustand/shallow";
import base64url from "base64url";
import { useNavigate, Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { validateUserQuery } from "@bilisound2/utils";
import { PRIMARY_COLOR, TOP_BAR_HEIGHT, VIEWPORT_HEIGHT } from "../constants";
import { useBilisoundStore } from "../store/bilisoundStore";

interface BilibiliForm {
    url: string
}

const TopBar: React.FC = () => {
    const navigate = useNavigate();

    const location = useLocation();

    // 表单
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
        setValue,
        // watch,
    } = useForm<BilibiliForm>();

    // 内容
    const {
        setDownloadManagerOpen,
        detail,
    } = useBilisoundStore((state) => ({
        setDownloadManagerOpen: state.setDownloadManagerOpen,
        detail: state.detail,
    }), shallow);

    const [isDisabled, setIsDisabled] = useState(false);

    const handleGetInfo: SubmitHandler<BilibiliForm> = async ({ url }) => {
        navigate(`/video/${base64url.encode(url)}`);
    };

    const gatheringForm = (
        <FormControl flexGrow={1}>
            <FormLabel
                htmlFor="url"
                css={{
                    width: "1px",
                    height: "2px",
                    overflow: "hidden",
                    lineHeight: 2,
                    padding: "0",
                    margin: "-1px",
                }}
            >
                视频地址
            </FormLabel>
            <InputGroup>
                <InputLeftElement pointerEvents="none">
                    <FontAwesomeIcon icon={faLink} opacity={0.3} />
                </InputLeftElement>
                <Input
                    id="url"
                    type="text"
                    placeholder="粘贴完整 URL、客户端分享短链接或带前缀 ID 至此"
                    min={1}
                    step={1}
                    style={{
                        paddingInlineEnd: "5.125rem",
                    }}
                    onInput={(e) => {
                        setIsDisabled(typeof validateUserQuery((e.target as HTMLInputElement).value) === "string");
                    }}
                    {...register("url", {
                        validate: validateUserQuery,
                    })}
                />
                <InputRightElement w="5.125rem">
                    <Button
                        w="4.375rem"
                        h="1.75rem"
                        size="sm"
                        onClick={() => {
                            const content: string = window.electron.ipcRenderer.sendSync("readTextFromClipboard");
                            setValue("url", content);
                            if (typeof validateUserQuery(content) !== "string") {
                                navigate(`/video/${base64url.encode(content)}`);
                            }
                        }}
                        leftIcon={<FontAwesomeIcon icon={faPaste} />}
                    >
                        粘贴
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>
    );

    return (
        <>
            <HStack
                pos="relative"
                zIndex={1}
                flexShrink={0}
                p={4}
                spacing={3}
                as="form"
                onSubmit={handleSubmit(handleGetInfo)}
            >
                {(detail || location.pathname.startsWith("/settings")) ? gatheringForm : <Box aria-hidden flexGrow={1} />}
                {(detail || location.pathname.startsWith("/settings")) ? (
                    <IconButton
                        type="submit"
                        flexShrink={0}
                        colorScheme={PRIMARY_COLOR}
                        size="md"
                        icon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
                        aria-label="下载/抽出"
                        isDisabled={isDisabled}
                    />
                ) : ""}
                <IconButton
                    flexShrink={0}
                    colorScheme="green"
                    size="md"
                    icon={<FontAwesomeIcon icon={faFileArrowDown} />}
                    aria-label="下载管理"
                    onClick={() => setDownloadManagerOpen(true)}
                />
                <IconButton
                    as={Link}
                    to="/settings"
                    flexShrink={0}
                    colorScheme="blue"
                    size="md"
                    icon={<FontAwesomeIcon icon={faGear} />}
                    aria-label="设置"
                />
            </HStack>
            <Portal>
                {(detail || location.pathname.startsWith("/settings")) ? "" : (
                    <Box
                        css={{
                            position: "relative",
                            height: VIEWPORT_HEIGHT,
                            marginTop: `calc(0px - ${TOP_BAR_HEIGHT})`,
                        }}
                    >
                        <Box
                            css={{
                                position: "absolute",
                                left: "50%",
                                top: "50%",
                                width: "32rem",
                                transform: "translate(-50%, -50%)",
                            }}
                        >
                            <form onSubmit={handleSubmit(handleGetInfo)}>
                                {gatheringForm}
                                <Center>
                                    <Button
                                        mt={4}
                                        colorScheme={PRIMARY_COLOR}
                                        isLoading={isSubmitting}
                                        type="submit"
                                        isDisabled={isDisabled}
                                    >
                                        下载/抽出
                                    </Button>
                                </Center>
                            </form>
                        </Box>
                    </Box>
                )}
            </Portal>
        </>
    );
};

export default TopBar;
