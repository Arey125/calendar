import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import { Box, CssBaseline, Stack } from '@mui/material';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';

import { HOLYDAYS, NAMES } from 'shared/config';
import { Events } from './events';
import { Names } from './names';

export const App = () => {
  const ref = useRef<FullCalendar>(null);

  const [currentDate, setCurrentDate] = useState<string | null>('');

  const setDate = (dateStr: string) => {
    const formattedDate = new Date(dateStr).toLocaleString('ru').split(',')[0];
    setCurrentDate(formattedDate);
  };

  useLayoutEffect(() => {
    const calendarApi = ref.current?.getApi();
    if (calendarApi) {
      calendarApi.gotoDate('2024-01-01');
      setDate('2024-01-01');
    }
  }, []);

  const currentHolydays = useMemo(
    () => HOLYDAYS.filter((item) => item.date === currentDate),
    [currentDate],
  );

  const currentNames = useMemo(() => {
    const item = NAMES.find((item) => item.date === currentDate);
    if (!item) {
      return [];
    }
    return item.names.split(', ');
  }, [currentDate]);

  return (
    <div>
      <CssBaseline />
      <Stack direction="row" justifyContent="center">
        <Box width="60vw">
          <FullCalendar
            ref={ref}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale="ru"
            dateClick={(info) => setDate(info.dateStr)}
          />
        </Box>
        <Stack paddingTop={8} p={2} width="30vw" height="80vh" overflow="auto">
          <Events items={currentHolydays} />
          <Names items={currentNames} />
        </Box>
      </Stack>
    </div>
  );
};
