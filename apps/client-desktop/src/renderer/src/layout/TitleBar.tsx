import React, { useEffect, useState } from "react";
import {
    Box, HStack, IconButton, IconButtonProps, useColorMode,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSun, faMoon, faXmark, faMinus, faChevronLeft, faChevronRight, faAngleLeft, faAngleRight,
} from "@fortawesome/free-solid-svg-icons";
import { APP_BRAND, TITLE_BAR_HEIGHT } from "@/constants";
import { jsxIf } from "@bilisound2/utils/dist/jsx";
import { useLocation } from "react-router-dom";

const rightIconCommonProps: Readonly<Partial<IconButtonProps>> = {
    boxSize: TITLE_BAR_HEIGHT,
    borderRadius: 0,
    variant: "ghost",
    colorScheme: "bilisound",
};

const { ipcRenderer } = window.electron;

const TitleBar: React.FC = () => {
    const { colorMode, toggleColorMode } = useColorMode();

    const [canGoBack, setCanGoBack] = useState(false);

    const [canGoForward, setCanGoForward] = useState(false);

    const location = useLocation();

    useEffect(() => {
        setCanGoBack(ipcRenderer.sendSync("browser.canGoBack"));
        setCanGoForward(ipcRenderer.sendSync("browser.canGoForward"));
    }, [location]);

    const historyButtons = (
        <>
            <IconButton
                {...rightIconCommonProps}
                isDisabled={!canGoBack}
                fontSize={18}
                onClick={() => {
                    ipcRenderer.send("browser.goBack");
                }}
                aria-label="后退"
                icon={<FontAwesomeIcon icon={faAngleLeft} />}
            />
            <IconButton
                {...rightIconCommonProps}
                isDisabled={!canGoForward}
                fontSize={18}
                onClick={() => {
                    ipcRenderer.send("browser.goForward");
                }}
                aria-label="前进"
                icon={<FontAwesomeIcon icon={faAngleRight} />}
            />
        </>
    );

    return (
        <Box
            as="header"
            pt="env(safe-area-inset-top, 0)"
            position="sticky"
            top={0}
            zIndex={1000}
            backdropFilter="blur(0.5rem)"
            css={{
                WebkitAppRegion: "drag",
            }}
        >
            <Box height={TITLE_BAR_HEIGHT} pos="relative">
                {jsxIf(
                    window.electron.process.platform !== "darwin",
                    <HStack
                        css={{
                            WebkitAppRegion: "no-drag",
                        }}
                        spacing={0}
                        left="0"
                        top="0"
                        pos="absolute"
                    >
                        {historyButtons}
                    </HStack>,
                )}
                <Box
                    as="h1"
                    fontSize="0.875rem"
                    fontWeight="bold"
                    textTransform="uppercase"
                    textAlign="center"
                    left="50%"
                    top="50%"
                    pos="absolute"
                    transform="translate(-50%, -50%)"
                >
                    {`${location.pathname.startsWith("/settings") ? "设置 - " : ""}${APP_BRAND}`}
                </Box>
                <HStack
                    css={{
                        WebkitAppRegion: "no-drag",
                    }}
                    spacing={0}
                    right="0"
                    top="0"
                    pos="absolute"
                >
                    {jsxIf(
                        window.electron.process.platform === "darwin",
                        historyButtons,
                    )}
                    <IconButton
                        {...rightIconCommonProps}
                        onClick={toggleColorMode}
                        aria-label={colorMode === "light" ? "切换至暗黑模式" : "切换至明亮模式"}
                        icon={<FontAwesomeIcon icon={colorMode === "light" ? faMoon : faSun} />}
                    />
                    {jsxIf(
                        window.electron.process.platform !== "darwin",
                        <>
                            <IconButton
                                {...rightIconCommonProps}
                                fontSize={20}
                                onClick={() => {
                                    ipcRenderer.send("browser.minimize");
                                }}
                                aria-label="最小化"
                                icon={<FontAwesomeIcon icon={faMinus} />}
                            />
                            <IconButton
                                {...rightIconCommonProps}
                                fontSize={20}
                                onClick={() => {
                                    ipcRenderer.send("browser.quit");
                                }}
                                aria-label="关闭"
                                icon={<FontAwesomeIcon icon={faXmark} />}
                            />
                        </>,
                    )}
                </HStack>
            </Box>
        </Box>
    );
};

export default TitleBar;
