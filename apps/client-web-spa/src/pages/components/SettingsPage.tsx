import React from "react";
import {
    Box, FormControl, FormLabel, Heading, Switch, useColorModeValue, VStack,
} from "@chakra-ui/react";
import { useConfigStore } from "@/store/configStore";
import { shallow } from "zustand/shallow";

const SettingsPage: React.FC = () => {
    const {
        getItem,
        setItem,
        autoPlay,
        instantSave,
        useAv,
    } = useConfigStore((state) => ({
        getItem: state.getItem,
        setItem: state.setItem,
        autoPlay: state.autoPlay,
        instantSave: state.instantSave,
        useAv: state.useAv,
    }), shallow);

    return (
        <div>
            <Heading
                as="h1"
                fontSize="2xl"
                fontWeight="bold"
                letterSpacing="0.125em"
                pb={4}
                mb={6}
                borderBottom="2px dashed"
                borderColor={useColorModeValue("#00000022", "#ffffff33")}
            >
                系统设置
            </Heading>
            <VStack spacing={5}>
                <FormControl display="flex" alignItems="center" justifyContent="space-between" w="100%">
                    <FormLabel htmlFor="autoPlay" mb="0">
                        选择音频后立刻播放
                    </FormLabel>
                    <Switch
                        id="autoPlay"
                        defaultChecked={autoPlay}
                        onChange={(e) => {
                            setItem({
                                autoPlay: e.target.checked,
                            });
                        }}
                    />
                </FormControl>
                <FormControl display="flex" alignItems="center" justifyContent="space-between" w="100%">
                    <FormLabel htmlFor="instantSave" mb="0">
                        下载音频后立刻保存
                    </FormLabel>
                    <Switch
                        id="instantSave"
                        defaultChecked={instantSave}
                        onChange={(e) => {
                            setItem({
                                instantSave: e.target.checked,
                            });
                        }}
                    />
                </FormControl>
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
            </VStack>
        </div>
    );
};

export default SettingsPage;
