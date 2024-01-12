import { useEffect, useRef, useState } from "react";

export default function useVirtualList(options: {
    baseItemHeight: number
}) {
    const holderRef = useRef<HTMLDivElement>(null);
    const holderParentRef = useRef<HTMLDivElement>(null);

    const [size, setSize] = useState(0);
    const [begin, setBegin] = useState(0);

    const handleVirtualListScroll = () => {
        const holderEl = holderRef.current;
        const holderParentEl = holderParentRef.current;
        if (!holderEl) {
            return;
        }

        // 单个元素的高度
        const baseItemHeight = options.baseItemHeight;

        // 列表本体盒子位置
        const rect = holderEl.getBoundingClientRect();
        const rectTop = holderParentEl ? rect.top - holderParentEl.getBoundingClientRect().top : rect.top;

        // 列表父元素高度
        const clientHeight = holderParentEl ? holderParentEl.getBoundingClientRect().height : document.documentElement.clientHeight;

        // 可见高度（视情况而变）
        let visibleHeight = clientHeight;

        // 顶部有空白时
        if (rectTop > 0) {
            visibleHeight = clientHeight - rectTop;
        }

        // 溢出时
        visibleHeight = Math.max(0, visibleHeight);

        // 当前滚动 Y 位置
        const scrollY = (holderParentEl ? holderParentEl.scrollTop : window.scrollY);

        // 元素在滚动容器内部的 Y 位置
        const initialTop = scrollY + rectTop;

        // 元素可见区间开始的 Y 位置
        const visibleTop = Math.max(0, scrollY - initialTop);

        setSize(Math.ceil(visibleHeight / baseItemHeight) + 1); // 额外一个是用来填满底部的
        setBegin(Math.floor(visibleTop / baseItemHeight));
    };

    useEffect(() => {
        const holderEl = holderRef.current;
        const holderParentEl = holderParentRef.current;
        if (!holderEl) {
            return () => {};
        }
        const resizeObserver = new ResizeObserver((entries) => {
            handleVirtualListScroll();
        });
        if (holderParentEl) {
            holderParentEl.addEventListener("scroll", handleVirtualListScroll);
            resizeObserver.observe(holderParentEl);
        } else {
            window.addEventListener("scroll", handleVirtualListScroll);
            window.addEventListener("resize", handleVirtualListScroll);
        }
        handleVirtualListScroll();
        return () => {
            if (holderParentEl) {
                holderParentEl.removeEventListener("scroll", handleVirtualListScroll);
                resizeObserver.unobserve(holderParentEl);
            } else {
                window.removeEventListener("scroll", handleVirtualListScroll);
                window.removeEventListener("resize", handleVirtualListScroll);
            }
            resizeObserver.disconnect();
        };
    }, [holderRef.current]);

    return {
        holderRef,
        holderParentRef,
        size,
        begin,
    };
}
