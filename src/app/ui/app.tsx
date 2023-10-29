import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import {
  AppBar,
  Box,
  CssBaseline,
  Stack,
  styled,
  ThemeProvider,
  Toolbar,
  Typography,
} from '@mui/material';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';

import { HOLYDAYS, NAMES, theme as appTheme } from 'shared/config';
import { Events } from './events';
import { Names } from './names';

const FullCalendarBox = styled(Box)(({ theme }) => ({
  '& button': {
    backgroundColor: `${theme.palette.primary.main} !important`,
    borderColor: `${theme.palette.primary.dark} !important`,
  },
}));

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
    const item = NAMES.find(({ date }) => date === currentDate);
    if (!item) {
      return [];
    }
    return item.names.split(', ');
  }, [currentDate]);

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
            Календарь
          </Typography>
        </Toolbar>
      </AppBar>
      <Stack direction="row" justifyContent="center" marginTop={2}>
        <FullCalendarBox width="60vw">
          <FullCalendar
            ref={ref}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale="ru"
            dateClick={(info) => setDate(info.dateStr)}
            buttonText={{
              today: 'Сегодня',
            }}
          />
        </FullCalendarBox>
        <Stack paddingTop={8} p={2} width="30vw" height="calc(100vh - 100px)" overflow="auto">
          <Events items={currentHolydays} />
          <Names items={currentNames} />
        </Stack>
      </Stack>
    </ThemeProvider>
  );
};
