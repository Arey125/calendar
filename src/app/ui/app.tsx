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
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { getValuesFromCsv, HolydayItem, NamesItem, theme as appTheme } from 'shared/config';
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

  const [holydays, setHolydays] = useState<HolydayItem[]>([]);
  const [names, setNames] = useState<NamesItem[]>([]);

  useEffect(() => {
    void (async () => {
      const HOLYDAY_VALUES = await getValuesFromCsv('/holyday.csv');
      setHolydays(
        HOLYDAY_VALUES.map(([date, category, title, description, image]) => ({
          date,
          category,
          title,
          description,
          image,
        })),
      );
      const NAMES_VALUES = await getValuesFromCsv('/names.csv');
      setNames(NAMES_VALUES.map(([date, nameValues]) => ({ date, names: nameValues })));
    })();
  }, []);

  const [currentDate, setCurrentDate] = useState<string | null>(null);
  const localeDate = useMemo(() => {
    if (!currentDate) {
      return null;
    }
    return new Date(Date.parse(currentDate)).toLocaleDateString('ru', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });
  }, [currentDate]);

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

  const currentHolydays = useMemo(
    () => holydays.filter((item) => item.date === localeDate),
    [localeDate, holydays],
  );

  const currentNames = useMemo(() => {
    const item = names.find(({ date }) => date === localeDate);
    if (!item) {
      return [];
    }
    return item.names.split(', ');
  }, [localeDate, names]);

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
        <Stack paddingTop={8} p={2} width="30vw" height="calc(100vh - 100px)" overflow="auto">
          <Events items={currentHolydays} shortDate={shortDate as string} />
          <Names items={currentNames} />
        </Stack>
      </Stack>
    </ThemeProvider>
  );
};
