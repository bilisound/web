import React from "react";
import Wrapper from "@/components/Wrapper";
import { APP_TITLE_SUFFIX } from "@/constants";
import { useTitle } from "react-use";
import SettingsPage from "./components/SettingsPage";

const Component: React.FC = () => {
    useTitle(`设置${APP_TITLE_SUFFIX}`);

    return (
        <Wrapper containerWidth="50rem">
            <SettingsPage />
        </Wrapper>
    );
};

export default Component;
