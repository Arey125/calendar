import { Stack } from '@mui/material';
import { useSpring, animated, to } from '@react-spring/web';
import { ReactNode, useRef, useCallback, useLayoutEffect, useState, useEffect } from 'react';

type TProps = {
  children: ReactNode;
};

export const AutoScroll = ({ children }: TProps) => {
  const container = useRef<HTMLDivElement>(null!);
  const targetElement = useRef<HTMLDivElement>(null!);

  const [scrollY, setScrollY] = useState(0);
  const containerHeight =
    targetElement.current && container.current
      ? Math.max(targetElement.current.offsetHeight - container.current.offsetHeight + 16, 0)
      : 0;
  const [isStopped, setStopped] = useState(false);
  const [reversed, setReversed] = useState(true);

  const { y } = useSpring({
    from: { y: reversed ? containerHeight : scrollY },
    to: { y: reversed ? scrollY : containerHeight },
    config: {
      duration: (containerHeight - scrollY) * 80 < 2000 ? 2000 : (containerHeight - scrollY) * 80,
    },
    reset: !isStopped,
    pause: isStopped,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    onRest: () => {
      setScrollY(0);
      setReversed(!reversed);
    },
  });

  const pauseAnimation = useCallback(() => {
    setStopped(true);
    setReversed(false);
  }, []);

  const stopAnimation = useCallback(() => {
    const timeout = setTimeout(() => {
      setStopped(false);
      const newScrollY = targetElement.current?.scrollTop ?? 0;
      const currentContainerHeight = targetElement.current
        ? targetElement.current.scrollHeight - targetElement.current.offsetHeight
        : 0;
      setScrollY(newScrollY === currentContainerHeight ? 0 : newScrollY);
      setReversed(newScrollY === currentContainerHeight);
    }, 5000);
    return () => clearTimeout(timeout);
  }, []);

  useLayoutEffect(() => {
    if (!isStopped) {
      return () => {
        // no-op
      };
    }
    return stopAnimation();
  }, [isStopped, stopAnimation]);

  useEffect(() => {
    const handleTouchStart = () => {
      pauseAnimation();
    };
    document.addEventListener('touchstart', handleTouchStart);
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
    };
  }, [pauseAnimation]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => stopAnimation(), []);

  return (
    <Stack width="30vw" height="100%" overflow="clip" ref={container}>
      <animated.div
        ref={targetElement}
        onWheel={pauseAnimation}
        onTouchStart={pauseAnimation}
        onTouchMove={pauseAnimation}
        onClick={pauseAnimation}
        style={{
          width: '30vw',
          transform: to([y], (y_pos) => `translateY(${y_pos - containerHeight}px)`),
        }}
      >
        {children}
      </animated.div>
    </Stack>
  );
};
