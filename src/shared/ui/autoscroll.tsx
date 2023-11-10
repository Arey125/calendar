import { Stack } from '@mui/material';
import { useSpring } from '@react-spring/web';
import { ReactNode, useRef, UIEventHandler, useCallback, useLayoutEffect, useState } from 'react';

type TProps = {
  children: ReactNode;
};

export const AutoScroll = ({ children }: TProps) => {
  const targetElement = useRef<HTMLDivElement>(null!);
  const scrollY = targetElement.current?.scrollTop ?? 0;
  const containerHeight = targetElement.current
    ? targetElement.current.scrollHeight - targetElement.current.offsetHeight
    : 0;
  const [isStopped, setStopped] = useState(false);
  const isStoppedRef = useRef(false);
  isStoppedRef.current = isStopped;

  const [, api] = useSpring(() => ({
    from: { y: scrollY },
    config: {
      friction: 100,
      tension: 1,
    },
    onChange: ({ value }) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      targetElement.current?.scrollTo({ top: value.y });
    },
  }));

  const handleWheel = useCallback<UIEventHandler>(() => {
    setStopped(true);
  }, []);

  useLayoutEffect(() => {
    if (!isStopped) {
      const timeout = setTimeout(
        () =>
          api.start({
            from: { y: scrollY },
            to: { y: containerHeight },
            loop: { reverse: true },
          }),
        1000,
      );
      return () => clearTimeout(timeout);
    }
    api.stop();
    const timeout = setTimeout(() => setStopped(false), 1000);
    return () => clearTimeout(timeout);
  }, [api, containerHeight, isStopped, scrollY]);

  return (
    <Stack
      paddingTop={8}
      p={2}
      width="30vw"
      height="calc(100vh - 100px)"
      overflow="auto"
      onWheel={handleWheel}
      onTouchStart={handleWheel}
      onClick={handleWheel}
      ref={targetElement}
    >
      {children}
    </Stack>
  );
};
