import React, { useEffect, useRef, useState } from "react";
import {
    Box,
    Center,
    CircularProgress,
    DarkMode,
    Flex,
    Grid,
    HStack,
    IconButton,
    Portal,
    Progress,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
    useToast,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBackwardStep,
    faDownload,
    faFloppyDisk,
    faForwardStep,
    faPause,
    faPlay,
    faVolumeHigh,
    faVolumeXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useBilisoundStore } from "@/store/bilisoundStore";
import { shallow } from "zustand/shallow";
import { useAudio } from "react-use";
import Wrapper from "@/components/Wrapper";
// import { secondToTimestamp } from "@/utils/misc";
import { getBilisoundResourceMetadata } from "@/api/online";
import { downloadUrl } from "@/utils/file";
import { useConfigStore } from "@/store/configStore";
import { BOTTOM_HEIGHT } from "@/constants";
import { secondToTimestamp } from "@bilisound2/utils";

const AudioPlayer: React.FC = () => {
    const toast = useToast();

    // 内容
    const { detail, setDownloadRequest, downloadList, playingEpisode, setPlayingEpisode, setPlayingState } =
        useBilisoundStore(
            state => ({
                detail: state.detail,
                downloadList: state.downloadList,
                setDownloadRequest: state.setDownloadRequest,
                playingEpisode: state.playingEpisode,
                setPlayingEpisode: state.setPlayingEpisode,
                setPlayingState: state.setPlayingState,
            }),
            shallow,
        );

    // 暂停状态
    // const [value, setValue] = useLocalStorage(LOCAL_STORAGE_MUTED, true);
    const { muted, autoPlay, setItem, getItem } = useConfigStore(
        state => ({
            muted: state.muted,
            autoPlay: state.autoPlay,
            setItem: state.setItem,
            getItem: state.getItem,
        }),
        shallow,
    );

    // 播放器
    const [audio, state, controls, ref] = useAudio(<audio muted={muted} crossOrigin="anonymous" />);

    // 播放进度
    const [progress, setProgress] = useState(0);

    // 拖动状态
    const dragging = useRef(false);

    // 缓冲状态
    const [buffering, setBuffering] = useState(false);

    // 当前播放 key
    const currentPlayKey = useRef("");

    // 替换地址
    const replaceUrl = useRef("");

    // 强制播放
    const focusPlayFlag = useRef(false);

    // 上一首和下一首的 ID
    const skipEpisodeFlag = useRef([-1, -1]);

    // 「请耐心等待」提示
    const bePatientTimer = useRef<any>();
    const bePatientRef = useRef<any>();

    // 进度更新
    const handleProgress = () => {
        const player = ref.current;
        if (!player) {
            return;
        }
        if (!dragging.current) {
            setProgress(player.currentTime);
        }
        requestAnimationFrame(handleProgress);
    };

    const handlePlay = (e: Event) => {
        const el = e.target as HTMLAudioElement;

        // 如果有待替换 URL
        if (replaceUrl.current) {
            const oldCurrentTime = el.currentTime;
            el.src = replaceUrl.current;
            el.currentTime = oldCurrentTime;
            replaceUrl.current = "";
            el.play().then(() => {
                setPlayingState(true);
            });
            return;
        }
        setPlayingState(true);
    };

    const handlePause = () => {
        setPlayingState(false);
    };

    const handlePrev = () => {
        if (state.playing && state.time > 5) {
            controls.seek(0);
            return;
        }
        setPlayingEpisode(skipEpisodeFlag.current[0]);
    };

    const handleNext = () => {
        setPlayingEpisode(skipEpisodeFlag.current[1]);
    };

    const handleSave = () => {
        const episode = downloadList[playingEpisode];
        const detailTarget = detail?.pages.find(e => e.page === playingEpisode);
        if (!episode) {
            return;
        }
        downloadUrl(
            `[${getItem("useAv") ? `av${detail?.aid}` : detail?.bvid}] [P${playingEpisode}] ${detailTarget?.part}.m4a`,
            episode.url,
        );
    };

    // 进度管理
    useEffect(() => {
        const player = ref.current;
        if (!player) {
            return () => {};
        }
        handleProgress();

        const next = () => {
            if (dragging.current) {
                return;
            }
            focusPlayFlag.current = true;
            setPlayingEpisode(skipEpisodeFlag.current[1]);
        };
        player.addEventListener("play", handlePlay);
        player.addEventListener("pause", handlePause);
        player.addEventListener("ended", next);
        if (navigator.mediaSession) {
            navigator.mediaSession.setActionHandler("previoustrack", handlePrev);
            navigator.mediaSession.setActionHandler("nexttrack", handleNext);
        }
        return () => {
            player.removeEventListener("play", handlePlay);
            player.removeEventListener("pause", handlePause);
            player.removeEventListener("ended", next);
            if (navigator.mediaSession) {
                navigator.mediaSession.setActionHandler("previoustrack", null);
                navigator.mediaSession.setActionHandler("nexttrack", null);
                navigator.mediaSession.metadata = null;
            }
        };
    }, [ref.current]);

    // 播放接收
    useEffect(() => {
        const player = ref.current;
        if (!player || !detail) {
            return;
        }
        if (playingEpisode <= 0) {
            player.pause();
            return;
        }
        const downloadListTarget = Object.entries(downloadList).find(([k]) => k === String(playingEpisode));
        const detailTargetIndex = detail.pages.findIndex(e => e.page === playingEpisode);
        const detailTarget = detail.pages[detailTargetIndex];

        const prev = detail.pages[detailTargetIndex <= 0 ? detail.pages.length - 1 : detailTargetIndex - 1];
        const next = detail.pages[detailTargetIndex >= detail.pages.length - 1 ? 0 : detailTargetIndex + 1];
        skipEpisodeFlag.current = [prev.page, next.page];

        // 只有新的 key 和代表当前播放内容的 key 不一致，才会触发对 src 的修改
        // 这样，在菜单点击当前播放歌曲的播放/暂停按钮时，不会从重新加载歌曲
        const newPlayKey = `${detail.bvid}_${playingEpisode}`;
        const previousPlaying = state.playing;
        if (currentPlayKey.current !== newPlayKey) {
            if (downloadListTarget && downloadListTarget[1].progress === 1) {
                player.src = downloadListTarget[1].url;
            } else {
                player.src = `https://bilisound.tuu.run/api/internal/resource?id=${detail.bvid}&episode=${playingEpisode}`;
            }
            currentPlayKey.current = newPlayKey;
        }
        // 显示当前播放的音频元数据
        if ("mediaSession" in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: detailTarget?.part,
                artist: detail.owner.name,
                artwork: [{ src: detail.pic ?? "" }],
            });
        }

        // 开始缓冲和播放
        // 触发优先级（从高到低）：强制播放 flag、用户开启自动播放、之前正在播放
        if (focusPlayFlag.current || autoPlay || previousPlaying) {
            focusPlayFlag.current = false;
            player.play();
        }
        if (!navigator.userAgent.includes("iPhone")) {
            setBuffering(true);
            if (bePatientRef.current) {
                toast.close(bePatientRef.current);
            }
            bePatientTimer.current = setTimeout(() => {
                bePatientRef.current = toast({
                    title: "文件还在加载呢！",
                    description: "您所请求的音频文件太大了，系统需要更多时间来加载，请不要关闭窗口/标签页。",
                    status: "info",
                    duration: 3600 * 1000,
                });
            }, 15000);
        }
        replaceUrl.current = "";

        // 静默加载元数据（记录缓存）
        getBilisoundResourceMetadata({
            id: detail.bvid,
            episode: playingEpisode,
        })
            .then(() => {})
            .catch(e => console.error);
    }, [playingEpisode]);

    // 缓冲结束
    useEffect(() => {
        // console.log("state.buffered", state.buffered);
        if (buffering && state.buffered.length > 0) {
            setBuffering(false);
            clearTimeout(bePatientTimer.current);
            if (bePatientRef.current) {
                toast.close(bePatientRef.current);
            }
        }
    }, [state.buffered]);

    /* useEffect(() => {
        const player = ref.current;
        if (!player) {
            return () => {};
        }
        const handler = () => {
            console.log("handler event");
            setBuffering(false);
            clearTimeout(bePatientTimer.current);
            if (bePatientRef.current) {
                toast.close(bePatientRef.current);
            }
        };
        player.addEventListener("canplaythrough", handler);
        return () => {
            player.removeEventListener("canplaythrough", handler);
        };
    }, []); */

    // 下载结束以后，替换播放链接为本地 blob 地址
    useEffect(() => {
        const player = ref.current;
        const meta = downloadList[playingEpisode];
        if (!(player && meta && meta.url)) {
            return;
        }

        // 暂停了 => 马上替换
        // 正在播放 => 在下次暂停后恢复前替换
        if (state.paused) {
            const oldTime = state.time;
            player.src = meta.url;
            controls.seek(oldTime);
        } else {
            replaceUrl.current = meta.url;
        }
    }, [downloadList, playingEpisode]);

    const farthestDuration = state.buffered.reduce((previousValue, currentValue, currentIndex, array) => {
        if (currentValue.end > previousValue) {
            return currentValue.end;
        }
        return previousValue;
    }, 0);

    return (
        <>
            {audio}
            <Portal>
                <Box h={`calc(${BOTTOM_HEIGHT} + env(safe-area-inset-bottom, 0))`}>
                    <Box
                        className="animate__animated animate__fadeInUp"
                        position="fixed"
                        w="100%"
                        h={`calc(${BOTTOM_HEIGHT} + env(safe-area-inset-bottom, 0))`}
                        bottom={0}
                        pt={4}
                        pb={2}
                        backdropFilter="blur(0.5rem)"
                        color="white"
                        css={{
                            animationDuration: "0.3s",
                            animationDelay: "0",
                        }}
                        zIndex={2}
                        _before={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            width: "100%",
                            height: "100%",
                            zIndex: -1,
                            background: "bilisound.600",
                            opacity: 0.8,
                            content: '""',
                        }}
                    >
                        <Wrapper>
                            <DarkMode>
                                {buffering ? (
                                    <Box py="5px">
                                        <Progress
                                            colorScheme="bilisound"
                                            size="xs"
                                            isIndeterminate
                                            borderRadius="2px"
                                        />
                                    </Box>
                                ) : (
                                    <Slider
                                        aria-label="slider-ex-1"
                                        value={progress}
                                        min={0}
                                        max={state.duration}
                                        step={0.001}
                                        onChangeStart={() => {
                                            dragging.current = true;
                                        }}
                                        onChange={e => {
                                            setProgress(e);
                                        }}
                                        onChangeEnd={e => {
                                            dragging.current = false;
                                            controls.seek(e);
                                        }}
                                        display="block"
                                        colorScheme="bilisound"
                                        focusThumbOnChange={false}
                                    >
                                        <SliderTrack
                                            style={
                                                {
                                                    "--buffer-progress": farthestDuration / state.duration,
                                                } as React.CSSProperties
                                            }
                                            _before={{
                                                content: '""',
                                                position: "absolute",
                                                left: 0,
                                                top: 0,
                                                width: "100%",
                                                height: 1,
                                                background: "whiteAlpha.400",
                                                transform: "scaleX(var(--buffer-progress))",
                                                transformOrigin: "left",
                                            }}
                                        >
                                            <SliderFilledTrack />
                                        </SliderTrack>
                                        <SliderThumb />
                                    </Slider>
                                )}

                                <Grid mt={2} gap={3} gridTemplateColumns="auto 1fr auto">
                                    <HStack spacing={0}>
                                        <IconButton
                                            aria-label="上一首"
                                            variant="ghost"
                                            icon={<FontAwesomeIcon icon={faBackwardStep} />}
                                            onClick={handlePrev}
                                            fontSize="1.2rem"
                                        />
                                        {state.playing ? (
                                            <IconButton
                                                aria-label="暂停"
                                                variant="ghost"
                                                icon={<FontAwesomeIcon icon={faPause} />}
                                                onClick={() => controls.pause()}
                                                fontSize="1.2rem"
                                            />
                                        ) : (
                                            <IconButton
                                                aria-label="播放"
                                                variant="ghost"
                                                icon={<FontAwesomeIcon icon={faPlay} />}
                                                onClick={() => controls.play()}
                                                fontSize="1.2rem"
                                            />
                                        )}
                                        <IconButton
                                            aria-label="下一首"
                                            variant="ghost"
                                            icon={<FontAwesomeIcon icon={faForwardStep} />}
                                            onClick={handleNext}
                                            fontSize="1.2rem"
                                        />
                                        <IconButton
                                            aria-label="切换静音"
                                            variant="ghost"
                                            icon={<FontAwesomeIcon icon={state.muted ? faVolumeXmark : faVolumeHigh} />}
                                            onClick={() => {
                                                if (state.muted) {
                                                    controls.unmute();
                                                    setItem({
                                                        muted: false,
                                                    });
                                                } else {
                                                    controls.mute();
                                                    setItem({
                                                        muted: true,
                                                    });
                                                }
                                            }}
                                            fontSize="1.2rem"
                                        />
                                    </HStack>
                                    <Flex alignItems="center" fontWeight="500" fontFamily="'Roboto', sans-serif">
                                        {buffering
                                            ? "--:--"
                                            : secondToTimestamp(state.time, { showMillisecond: false })}
                                    </Flex>
                                    {(() => {
                                        switch (true) {
                                            case downloadList[playingEpisode] && !!downloadList[playingEpisode].url: {
                                                return (
                                                    <IconButton
                                                        aria-label="保存"
                                                        variant="ghost"
                                                        icon={<FontAwesomeIcon icon={faFloppyDisk} />}
                                                        fontSize="1.2rem"
                                                        onClick={handleSave}
                                                    />
                                                );
                                            }
                                            case !!downloadList[playingEpisode]: {
                                                return (
                                                    <Center boxSize={10}>
                                                        <CircularProgress
                                                            isIndeterminate={downloadList[playingEpisode].progress <= 0}
                                                            value={downloadList[playingEpisode].progress * 100}
                                                            color="bilisound.500"
                                                            size="1.5rem"
                                                            thickness="1rem"
                                                        />
                                                    </Center>
                                                );
                                            }
                                            default: {
                                                return (
                                                    <IconButton
                                                        aria-label="下载"
                                                        variant="ghost"
                                                        icon={<FontAwesomeIcon icon={faDownload} />}
                                                        fontSize="1.2rem"
                                                        onClick={() => {
                                                            setDownloadRequest(playingEpisode);
                                                        }}
                                                        isDisabled={buffering}
                                                    />
                                                );
                                            }
                                        }
                                    })()}
                                </Grid>
                            </DarkMode>
                        </Wrapper>
                    </Box>
                </Box>
            </Portal>
        </>
    );
};

export default AudioPlayer;
