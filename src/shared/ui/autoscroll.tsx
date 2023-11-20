import { Stack } from '@mui/material';
import { useSpring, animated, to } from '@react-spring/web';
import {
  ReactNode,
  useRef,
  useCallback,
  useLayoutEffect,
  useState,
  useEffect,
  WheelEventHandler,
  TouchEventHandler,
} from 'react';

type TProps = {
  children: ReactNode;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const AutoScroll = ({ children }: TProps) => {
  const container = useRef<HTMLDivElement>(null!);
  const targetElement = useRef<HTMLDivElement>(null!);
  const [touchPosition, setTouchPosition] = useState<number | null>(null);

  const [scrollY, setScrollY] = useState(0);
  const containerHeight = useRef(0);

  useLayoutEffect(() => {
    containerHeight.current =
      targetElement.current && container.current
        ? Math.max(targetElement.current.offsetHeight - container.current.offsetHeight + 16, 0)
        : 0;
  });
  const [isStopped, setStopped] = useState(true);
  const [reversed, setReversed] = useState(false);

  const { y } = useSpring({
    from: { y: reversed ? containerHeight.current : scrollY },
    to: { y: reversed ? scrollY : containerHeight.current },
    config: {
      duration:
        (containerHeight.current - scrollY) * 100 < 2000
          ? 2000
          : (containerHeight.current - scrollY) * 100,
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
    if (!isStopped) {
      setScrollY(y.get());
    }
    setStopped(true);
    setReversed(false);
  }, [y, isStopped]);

  const stopAnimation = useCallback(() => {
    const timeout = setTimeout(() => {
      setStopped(false);
      const newScrollY = y.get();
      const currentContainerHeight = containerHeight.current;
      setReversed(newScrollY === currentContainerHeight);
    }, 5000);
    return () => clearTimeout(timeout);
  }, [y]);

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

  const handleWheel = useCallback<WheelEventHandler>(
    (event) => {
      if (event.deltaY !== 0) {
        pauseAnimation();
        setScrollY((cur) => clamp(cur + event.deltaY, 0, containerHeight.current));
      }
    },
    [pauseAnimation],
  );

  const handleTouchStart = useCallback<TouchEventHandler<HTMLDivElement>>(
    (event) => {
      pauseAnimation();
      setTouchPosition(event.touches[0].clientY);
    },
    [pauseAnimation],
  );

  const handleTouchMove = useCallback<TouchEventHandler<HTMLDivElement>>(
    (event) => {
      if (touchPosition) {
        setScrollY((cur) =>
          clamp(cur - (event.touches[0].clientY - touchPosition), 0, containerHeight.current),
        );
        setTouchPosition(event.touches[0].clientY);
      }
    },
    [touchPosition],
  );

  return (
    <Stack width="30vw" height="100%" overflow="clip" ref={container}>
      <animated.div
        ref={targetElement}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onClick={pauseAnimation}
        style={{
          width: '30vw',
          transform: isStopped
            ? `translateY(${-scrollY}px)`
            : to([y], (y_pos) => `translateY(${-y_pos}px)`),
        }}
      >
        {children}
      </animated.div>
    </Stack>
  );
};
