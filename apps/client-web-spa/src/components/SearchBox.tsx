import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "umi";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useBilisoundStore } from "@/store/bilisoundStore";
import { shallow } from "zustand/shallow";
import base64url from "base64url";
import {
    Box,
    Button, Center, FormControl, FormErrorMessage, FormLabel, Input,
} from "@chakra-ui/react";
import { resolveVideo } from "@/utils/format";
import { PRIMARY_COLOR } from "@/constants";
import Wrapper from "@/components/Wrapper";
import { validateUserQuery } from "@bilisound2/utils";

interface BilibiliForm {
    url: string
}

const SearchBox: React.FC = () => {
    const navigate = useNavigate();

    const location = useLocation();

    // 表单
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm<BilibiliForm>();

    // 内容
    const {
        detail,
        setDetail,
    } = useBilisoundStore((state) => ({
        detail: state.detail,
        setDetail: state.setDetail,
    }), shallow);

    // 按钮锁定
    const [submitLocked, setSubmitLocked] = useState(true);

    useEffect(() => {
        setSubmitLocked(false);
        setDetail(null);
    }, []);

    const handleGetInfo: SubmitHandler<BilibiliForm> = async ({ url }) => {
        const resolved = await resolveVideo(url.trim());
        navigate(`/video-query/${base64url.encode(resolved)}`);
    };

    const inputForm = (
        <form onSubmit={handleSubmit(handleGetInfo)}>
            <FormControl isInvalid={!!errors?.url} mb={3}>
                <FormLabel
                    htmlFor="url"
                    css={{
                        width: "1px",
                        height: "1px",
                        overflow: "hidden",
                        lineHeight: 2,
                        padding: "0",
                        margin: "-1px",
                    }}
                >
                    视频地址
                </FormLabel>
                <Input
                    id="url"
                    type="text"
                    placeholder="粘贴完整 URL、客户端分享短链接或带前缀 ID 至此"
                    defaultValue={process.env.NODE_ENV === "production" ? "" : "BV1KP4y1V7XZ"}
                    min={1}
                    step={1}
                    {...register("url", {
                        validate(v) {
                            return validateUserQuery(v);
                        },
                    })}
                />
                <FormErrorMessage>
                    {errors.url && errors.url.message}
                </FormErrorMessage>
            </FormControl>

            <Center>
                <Button
                    mt={2}
                    colorScheme={PRIMARY_COLOR}
                    isLoading={isSubmitting}
                    type="submit"
                    isDisabled={submitLocked}
                >
                    下载/抽出
                </Button>
            </Center>
        </form>
    );

    if (detail || location.pathname.startsWith("/settings")) {
        return null;
    }

    return (
        <Box
            css={{
                position: "absolute",
                left: 0,
                top: "50%",
                width: "100%",
                transform: "translateY(-50%)",
                "> *": {
                    width: "100%",
                },
            }}
        >
            <Wrapper containerWidth="40rem">
                <main>
                    {inputForm}
                </main>
            </Wrapper>
        </Box>
    );
};

export default SearchBox;
