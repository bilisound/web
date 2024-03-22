import { useAudioPaused } from "@/utils/audio";
import MusicPlayingIcon from "@/components/MusicPlayingIcon";
import { css } from "@/styled-system/css";
import { ReactComponent as IconPause } from "@/icons/fa-solid--pause.svg";

export default function CurrentPlayingIcon() {
    const isPlaying = !useAudioPaused();

    if (isPlaying) {
        return <MusicPlayingIcon />;
    } else {
        return <IconPause className={css({ w: 4, h: 4 })} />;
    }
}
