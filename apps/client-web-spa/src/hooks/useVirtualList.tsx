import { useEffect, useRef, useState } from "react";

export default function useVirtualList(options: {
    baseItemHeight: number
}) {
    const holderRef = useRef<HTMLDivElement>(null);

    const [size, setSize] = useState(0);
    const [begin, setBegin] = useState(0);

    const handleVirtualListScroll = () => {
        const el = holderRef.current;
        if (!el) {
            return;
        }
        const baseItemHeight = options.baseItemHeight;
        const rect = el.getBoundingClientRect();
        const { clientHeight } = document.documentElement;

        let visibleHeight = clientHeight;
        // 顶部有空白时
        if (rect.top > 0) {
            visibleHeight = clientHeight - rect.top;
        }
        // 底部有空白时
        if (rect.bottom < clientHeight) {
            visibleHeight = rect.bottom;
        }
        // 溢出时
        visibleHeight = Math.max(0, visibleHeight);

        const initialTop = window.scrollY + rect.top;
        const visibleTop = Math.max(0, window.scrollY - initialTop);

        setSize(Math.ceil(visibleHeight / baseItemHeight) + 1); // 额外一个是用来填满底部的
        setBegin(Math.floor(visibleTop / baseItemHeight));
    };

    useEffect(() => {
        const el = holderRef.current;
        if (!el) {
            return () => {};
        }
        window.addEventListener("scroll", handleVirtualListScroll);
        window.addEventListener("resize", handleVirtualListScroll);
        handleVirtualListScroll();
        return () => {
            window.removeEventListener("scroll", handleVirtualListScroll);
            window.removeEventListener("resize", handleVirtualListScroll);
        };
    }, [holderRef.current]);

    // useEffect(() => {
    //     handleVirtualListScroll();
    // }, []);

    return {
        holderRef,
        size,
        begin,
    };
}
