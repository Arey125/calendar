import { Box } from '@mui/material';
import { useEffect, useState } from 'react';

export const CurrentTime = () => {
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Box color="#ccc">
      {new Date(currentTime)
        .toLocaleDateString('ru', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          weekday: 'long',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
        })
        .replace(' в', ' ')}
    </Box>
  );
};
