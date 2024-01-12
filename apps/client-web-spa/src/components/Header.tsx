import React, { useRef } from "react";
import {
    Box,
    DarkMode,
    Flex,
    HStack,
    IconButton,
    useColorMode,
    Modal,
    ModalOverlay,
    ModalContent,
    useDisclosure,
    Input,
    InputGroup,
    InputLeftElement,
    VisuallyHidden,
    Center,
    Button,
    Text,
} from "@chakra-ui/react";
import Wrapper from "@/components/Wrapper";
import { Link, useLocation, useNavigate } from "umi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSun, faMoon, faSliders, faSearch, faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import { APP_BRAND } from "@/constants";
import { useBilisoundStore } from "@/store/bilisoundStore";
import { shallow } from "zustand/shallow";
import { resolveVideo } from "@/utils/format";
import base64url from "base64url";
import { jsxIf, validateUserQuery } from "@bilisound2/utils";

const Header: React.FC = () => {
    const location = useLocation();

    const navigate = useNavigate();

    const { colorMode, toggleColorMode } = useColorMode();

    // ================================================================================
    // 搜索框
    // ================================================================================

    const { isOpen, onOpen, onClose } = useDisclosure();

    const searchInputRef = useRef<HTMLInputElement>(null);

    const handleSearchSubmit = async () => {
        const url = searchInputRef.current?.value.trim() || "";
        onClose();
        if (!url || typeof validateUserQuery(url) === "string") {
            return;
        }
        const resolved = await resolveVideo(url.trim());
        navigate(`/video-query/${base64url.encode(resolved)}`);
    };

    const searchModel = (
        <Modal onClose={onClose} isOpen={isOpen} initialFocusRef={searchInputRef}>
            <ModalOverlay bg="blackAlpha.700" />
            <ModalContent
                mx={5}
                maxW="xl"
            >
                <Box
                    as="form"
                    pos="relative"
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSearchSubmit();
                    }}
                >
                    <VisuallyHidden as="label" htmlFor="floating-search-input">查询关键词</VisuallyHidden>
                    <InputGroup>
                        <InputLeftElement
                            aria-hidden
                            pointerEvents="none"
                            boxSize={16}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            opacity={0.5}
                        >
                            <FontAwesomeIcon icon={faSearch} />
                        </InputLeftElement>
                        <Input
                            id="floating-search-input"
                            ref={searchInputRef}
                            placeholder="粘贴完整 URL、客户端分享短链接或带前缀 ID 至此"
                            variant="unstyled"
                            p={5}
                            style={{
                                paddingInlineStart: "3.5rem",
                                paddingInlineEnd: "4rem",
                            }}
                        />
                    </InputGroup>
                    <Center
                        boxSize={16}
                        pos="absolute"
                        right={0}
                        top={0}
                        zIndex={1}
                    >
                        <IconButton
                            aria-label="提交"
                            type="submit"
                            icon={<FontAwesomeIcon icon={faRightToBracket} />}
                        />
                    </Center>
                </Box>
            </ModalContent>
        </Modal>
    );

    // ================================================================================
    // 元素
    // ================================================================================

    const {
        detail,
    } = useBilisoundStore((state) => ({
        detail: state.detail,
    }), shallow);

    return (
        <>
            {searchModel}
            <DarkMode>
                {jsxIf(
                    false,
                    <Center py={2} bg="blue.700">
                        <HStack spacing={2}>
                            <Text fontSize="sm" color="white">测试一个广告位！！</Text>
                            <Button size="sm" colorScheme="blue">立刻体验</Button>
                        </HStack>
                    </Center>,
                )}
                <Box
                    as="header"
                    mb={6}
                    pt="env(safe-area-inset-top, 0)"
                    position="sticky"
                    top={0}
                    zIndex={1000}
                    backdropFilter="blur(0.5rem)"
                    color="white"
                    _before={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: "100%",
                        height: "100%",
                        zIndex: -1,
                        background: "bilisound.600",
                        opacity: 0.8,
                        content: "\"\"",
                    }}
                >
                    <Flex as={Wrapper} height={16} alignItems="center" justifyContent="space-between">
                        <HStack>
                            <Box as={Link} to="/">
                                <Box as="h1" fontSize="1.25rem" fontWeight="bold" textTransform="uppercase">{APP_BRAND}</Box>
                            </Box>
                        </HStack>
                        <HStack>
                            {jsxIf(
                                detail,
                                <IconButton
                                    color="white"
                                    fontSize={18}
                                    variant="ghost"
                                    colorScheme="bilisound"
                                    onClick={onOpen}
                                    aria-label="查询视频"
                                    icon={<FontAwesomeIcon icon={faSearch} />}
                                />,
                            )}
                            <IconButton
                                color="white"
                                fontSize={18}
                                variant="ghost"
                                colorScheme="bilisound"
                                onClick={toggleColorMode}
                                aria-label={colorMode === "light" ? "切换至暗黑模式" : "切换至明亮模式"}
                                icon={<FontAwesomeIcon icon={colorMode === "light" ? faMoon : faSun} />}
                            />
                            <IconButton
                                as={Link}
                                to="/settings"
                                color="white"
                                fontSize={18}
                                variant="ghost"
                                colorScheme="bilisound"
                                icon={<FontAwesomeIcon icon={faSliders} />}
                                aria-label="设置"
                            />
                        </HStack>
                    </Flex>
                </Box>
            </DarkMode>
        </>
    );
};

export default Header;
