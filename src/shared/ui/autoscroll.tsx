import { Stack } from '@mui/material';
import { useSpring } from '@react-spring/web';
import {
  ReactNode,
  useRef,
  WheelEventHandler,
  useCallback,
  useLayoutEffect,
  useState,
} from 'react';

type TProps = {
  children: ReactNode;
};

export const AutoScroll = ({ children }: TProps) => {
  const targetElement = useRef<HTMLDivElement>(null!);
  const [scrollY, setScrollY] = useState(targetElement.current?.scrollTop ?? 0);
  const containerHeight = targetElement.current
    ? targetElement.current.scrollHeight - targetElement.current.offsetHeight
    : 0;
  const [isStopped, setStopped] = useState(false);
  const [reversed, setReversed] = useState(false);

  useSpring({
    from: { y: reversed ? containerHeight : scrollY },
    to: { y: reversed ? scrollY : containerHeight },
    config: {
      duration: (containerHeight - scrollY) * 20,
    },
    reset: !isStopped,
    pause: isStopped,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    onChange: ({ value }) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      targetElement.current?.scrollTo({ top: value.y });
    },
    onRest: () => {
      setScrollY(0);
      setReversed(!reversed);
    },
  });

  const handleWheel = useCallback<WheelEventHandler<HTMLDivElement>>(() => {
    setStopped(true);
    setReversed(false);
  }, []);

  useLayoutEffect(() => {
    if (!isStopped) {
      return () => {
        // no-op
      };
    }
    const timeout = setTimeout(() => {
      setStopped(false);
      const newScrollY = targetElement.current?.scrollTop ?? 0;
      setScrollY(newScrollY === containerHeight ? 0 : newScrollY);
      setReversed(newScrollY === containerHeight);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [containerHeight, isStopped]);

  return (
    <Stack
      paddingTop={8}
      p={2}
      width="30vw"
      height="calc(100vh - 100px)"
      overflow="auto"
      onWheel={handleWheel}
      ref={targetElement}
    >
      {children}
    </Stack>
  );
};
