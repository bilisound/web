import MusicPlayingIcon from "@/components/MusicPlayingIcon";
import { css } from "@styled-system/css";
import IconPause from "@/icons/fa-solid--pause.svg?react";
import { useIsPlaying } from "@/utils/audio/react";

export default function CurrentPlayingIcon() {
    const isPlaying = useIsPlaying();

    if (isPlaying) {
        return <MusicPlayingIcon />;
    } else {
        return <IconPause className={css({ w: 4, h: 4 })} />;
    }
}
