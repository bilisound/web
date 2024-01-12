import React from "react";
import { Box, Flex, Link } from "@chakra-ui/react";
import Wrapper from "@/components/Wrapper";
import { useBilisoundStore } from "@/store/bilisoundStore";
import { shallow } from "zustand/shallow";
import version from "../version.json";

const Footer: React.FC = () => {
    // 内容
    const {
        playingEpisode,
    } = useBilisoundStore((state) => ({
        playingEpisode: state.playingEpisode,
    }), shallow);

    const withoutVideo = playingEpisode <= 0;

    return (
        <Box marginTop="auto" pt={6} pb={withoutVideo ? "env(safe-area-inset-bottom, 0)" : undefined} as="footer">
            <Box
                borderTop="1px solid var(--chakra-colors-chakra-border-color)"
            >
                <Flex
                    as={Wrapper}
                    flexDirection={["column", "column", "row"]}
                    alignItems={["flex-start", "flex-start", "center"]}
                    justifyContent="space-between"
                    opacity={0.6}
                    lineHeight={8}
                    py={2}
                >
                    <Box>
                        {`© 2012-${version.copyrightYear} Bilisound Team`}
                    </Box>
                    <Box>
                        {`v${version.version} (${version.gitHash.slice(0, 8)}@${version.gitBranch})`}
                        {/* <Link as={RouterLink} to="/page/about">关于我们</Link>
                        &emsp;
                        <Link as={RouterLink} to="/page/open-source">开源软件使用声明</Link> */}
                    </Box>
                </Flex>
            </Box>
        </Box>
    );
};

export default Footer;
