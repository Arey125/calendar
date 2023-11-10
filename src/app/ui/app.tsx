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
import { Icon } from './assets';
import { Events, Names } from './components';
import './index.css';

const FullCalendarBox = styled(Box)(({ theme }) => ({
  '& button': {
    backgroundColor: `${theme.palette.primary.main} !important`,
    borderColor: `${theme.palette.primary.dark} !important`,
  },
}));

export const App = () => {
  const ref = useRef<FullCalendar>(null);

  const [currentDate, setCurrentDate] = useState<string | null>(null);

  const { currentHolydays, currentNames, events } = useData(currentDate);

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
          <img src={Icon} alt="" height="44px" />
          <Typography variant="h4" component="div" sx={{ paddingLeft: 4, fontSize: '28px' }}>
            Календарь
          </Typography>
          <Typography
            variant="h4"
            component="div"
            sx={{ paddingLeft: 1, fontSize: '28px', fontWeight: '600' }}
          >
            2024
          </Typography>
        </Toolbar>
      </AppBar>
      <Box position="fixed" height="100vh" zIndex={-1}>
        <video height="100%" autoPlay muted loop>
          <source src="/video/test.mp4" type="video/mp4" />
        </video>
      </Box>
      <Stack
        direction="row"
        justifyContent="center"
        paddingTop={2}
        height="calc(100vh - 64px)"
        sx={{ backgroundColor: '#f0f0f0dd' }}
      >
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
            events={events
              .filter(({ gif }) => gif.length > 1)
              .map((item) => ({
                image: item.gif,
                date: item.date,
              }))}
            eventBackgroundColor="transparent"
            eventBorderColor="transparent"
            eventContent={(info) => <img src={info.event.extendedProps.image} alt="" width="30%" />}
          />
        </FullCalendarBox>
        <AutoScroll key={currentDate}>
          <Events items={currentHolydays} shortDate={shortDate as string} />
          <Names items={currentNames} />
        </AutoScroll>
      </Stack>
    </ThemeProvider>
  );
};
