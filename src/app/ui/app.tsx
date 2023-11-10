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

import { theme as appTheme } from 'shared/config';
import { useData } from 'shared/model';
import { AutoScroll } from 'shared/ui';
import { Events, Names } from './components';

const FullCalendarBox = styled(Box)(({ theme }) => ({
  '& button': {
    backgroundColor: `${theme.palette.primary.main} !important`,
    borderColor: `${theme.palette.primary.dark} !important`,
  },
}));

export const App = () => {
  const ref = useRef<FullCalendar>(null);

  const [currentDate, setCurrentDate] = useState<string | null>(null);

  const { currentHolydays, currentNames } = useData(currentDate);

  const shortDate = useMemo(() => {
    if (!currentDate) {
      return null;
    }
    return new Date(Date.parse(currentDate)).toLocaleDateString('ru', {
      day: 'numeric',
      month: 'long',
    });
  }, [currentDate]);

  const setDate = (dateStr: string) => {
    setCurrentDate(dateStr);
  };

  useLayoutEffect(() => {
    const calendarApi = ref.current?.getApi();
    if (calendarApi) {
      const today = Date.now();
      if (today < Date.parse('2024-01-01')) {
        calendarApi.gotoDate('2024-01-01');
        setDate('2024-01-01');
      }
    }
  }, []);

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h4" component="div" sx={{ paddingLeft: 8 }}>
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
        <AutoScroll>
          <Events items={currentHolydays} shortDate={shortDate as string} />
          <Names items={currentNames} />
        </AutoScroll>
      </Stack>
    </ThemeProvider>
  );
};
