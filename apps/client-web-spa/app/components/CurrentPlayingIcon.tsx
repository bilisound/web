import { useAudioPaused } from "@/utils/audio.client";
import MusicPlayingIcon from "@/components/MusicPlayingIcon";
import { css } from "@styled-system/css";
import IconPause from "@/icons/fa-solid--pause.svg?react";

export default function CurrentPlayingIcon() {
    const isPlaying = !useAudioPaused();

    if (isPlaying) {
        return <MusicPlayingIcon />;
    } else {
        return <IconPause className={css({ w: 4, h: 4 })} />;
    }
}