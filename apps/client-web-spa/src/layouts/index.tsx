import { Outlet } from 'umi';
import {Box} from "@chakra-ui/react";
import React from "react";
import {shallow} from "zustand/shallow";
import YuruChara from "@/components/YuruChara";
import DownloadManager from "@/components/DownloadManager";
import AudioPlayer from "@/components/AudioPlayer";
import Footer from "@/components/Footer";
import SearchBox from "@/components/SearchBox";
import Header from "@/components/Header";
import {useBilisoundStore} from "@/store/bilisoundStore";
import {BOTTOM_HEIGHT} from "@/constants";

const App = () => {
    // 内容
    const {
        playingEpisode,
    } = useBilisoundStore((state) => ({
        playingEpisode: state.playingEpisode,
    }), shallow);

    const withoutVideo = playingEpisode <= 0;

    return (
        <>
            <Box display="flex" flexDirection="column" minH={withoutVideo ? "100dvh" : `calc(100dvh - ${BOTTOM_HEIGHT})`}>
                <Header />
                <Box
                    flexGrow={1}
                    position="relative"
                >
                    <SearchBox />
                    <Outlet />
                </Box>
                <Footer />
            </Box>
            {withoutVideo ? "" : <AudioPlayer />}
            <DownloadManager />
            <YuruChara />
        </>
    );
};

export default App;
