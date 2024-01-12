import React, { useEffect } from "react";
import { shallow } from "zustand/shallow";
import { useBilisoundStore } from "@/store/bilisoundStore";
import { useTitle } from "react-use";
import { APP_TITLE_SUFFIX } from "@/constants";

const ProviderBilibili: React.FC = () => {
    useTitle(`首页${APP_TITLE_SUFFIX}`);

    // 内容
    const {
        setDetail,
        setPlayingEpisode,
        setQuery,
    } = useBilisoundStore((state) => ({
        setDetail: state.setDetail,
        setPlayingEpisode: state.setPlayingEpisode,
        setQuery: state.setQuery,
    }), shallow);

    useEffect(() => {
        setDetail(null);
        setQuery("");
        setPlayingEpisode(0);
    }, []);

    return null;
};

export default ProviderBilibili;
