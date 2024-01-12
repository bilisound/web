import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import { shallow } from "zustand/shallow";
import AudioPlayer from "../components/AudioPlayer";
import DownloadManager from "../components/DownloadManager";
import { useBilisoundStore } from "../store/bilisoundStore";
import TopBar from "./TopBar";
import TitleBar from "./TitleBar";

const Root: React.FC = () => {
    const {
        detail,
    } = useBilisoundStore((state) => ({
        detail: state.detail,
    }), shallow);

    const withoutVideo = !detail;

    return (
        <Box>
            <TitleBar />
            <TopBar />
            <Outlet />
            {withoutVideo ? "" : <AudioPlayer />}
            <DownloadManager />
        </Box>
    );
};

export default Root;
