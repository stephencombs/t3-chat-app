import { useEffect, useRef, useState, type UIEvent, useMemo } from 'react';

const useScroll = (route: string) => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    const isBottom = useMemo(() => {
        if (scrollRef.current)
            return scrollRef.current.scrollHeight - scrollPosition === scrollRef.current.clientHeight;
        return false;
    }, [scrollPosition]);

    useEffect(() => {
        const previousScrollPosition = parseInt(sessionStorage.getItem(route) ?? '0');
        scrollRef.current?.scrollTo({ top: previousScrollPosition });
    }, [route]);

    const onScroll = (e: UIEvent<HTMLDivElement>) => {
        setScrollPosition(e.currentTarget.scrollTop);
        sessionStorage.setItem(route, scrollPosition.toString());
    };

    return { scrollRef, onScroll, isBottom };
};

export default useScroll;
