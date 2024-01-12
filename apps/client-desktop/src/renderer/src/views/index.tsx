import React, { useEffect } from "react";
import { shallow } from "zustand/shallow";
import { useBilisoundStore } from "../store/bilisoundStore";

export async function loader() {
    return null;
}

export const Component: React.FC = () => {
    // 内容
    const {
        setDetail,
        setQuery,
    } = useBilisoundStore((state) => ({
        setDetail: state.setDetail,
        setQuery: state.setQuery,
    }), shallow);

    useEffect(() => {
        setDetail(null);
        setQuery("");
    }, []);

    return <div />;
};
