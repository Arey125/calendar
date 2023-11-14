import { Stack } from '@mui/material';
import { useSpring } from '@react-spring/web';
import { throttle } from 'lodash';
import { ReactNode, useRef, useCallback, useLayoutEffect, useState } from 'react';

type TProps = {
  children: ReactNode;
};

export const AutoScroll = ({ children }: TProps) => {
  const targetElement = useRef<HTMLDivElement>(null!);
  const [scrollY, setScrollY] = useState(0);
  const containerHeight = targetElement.current
    ? targetElement.current.scrollHeight - targetElement.current.offsetHeight
    : 0;
  const [isStopped, setStopped] = useState(false);
  const [reversed, setReversed] = useState(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const animate = useCallback(
    throttle((value: number) => {
      targetElement.current?.scrollTo({ top: value, behavior: 'smooth' });
    }, 40),
    [],
  );

  useSpring({
    from: { y: reversed ? containerHeight : scrollY },
    to: { y: reversed ? scrollY : containerHeight },
    config: {
      duration: (containerHeight - scrollY) * 80 < 2000 ? 2000 : (containerHeight - scrollY) * 80,
    },
    reset: !isStopped,
    pause: isStopped,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    onChange: ({ value }) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
      animate(value.y);
    },
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => stopAnimation(), []);

  return (
    <Stack
      paddingTop={8}
      p={2}
      width="30vw"
      height="100%"
      overflow="auto"
      onWheel={pauseAnimation}
      onTouchStart={pauseAnimation}
      onClick={pauseAnimation}
      ref={targetElement}
    >
      {children}
    </Stack>
  );
};
